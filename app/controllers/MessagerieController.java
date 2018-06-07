package controllers;


import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.ebean.Ebean;
import io.ebean.Expr;
import models.Message;
import models.User;
import models.utils.DateUtils;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;

public class MessagerieController extends Controller {
    ObjectMapper mapper = new ObjectMapper();

    public Result getAllMessageFromUserAndDestinataire() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong();
        User u = Application.getCurrentUserObj();
        User v = User.find.byId(id);
        List<Message> msgsRet = new ArrayList<>();
        if (u != null) {
            List<Message> msgsSent = Message.find.query()
                    .where()
                    .or(Expr.and(
                            Expr.eq("expediteur_id", u.getId()),
                            Expr.eq("destinataire_id", v.getId())),
                            Expr.and(
                                    Expr.eq("expediteur_id", v.getId()),
                                    Expr.eq("destinataire_id", u.getId())))
                    .orderBy("date desc")
                    .findList();
            ArrayNode retourList = mapper.createArrayNode();
            for (Message m : msgsSent) {
                ObjectNode message = mapper.valueToTree(m);
                DateUtils dU = new DateUtils();
                String dateSuivi = dU.toFrenchDateString(m.getDate());
                JsonNode date = mapper.valueToTree(dateSuivi);
                message.set("date", date);
                JsonNode type = null;
                if (m.getExpediteur().equals(u)) {
                    type = mapper.valueToTree("exp");
                }
                if (m.getDestinataire().equals(u)) {
                    type = mapper.valueToTree("dest");
                }
                ObjectNode retour = mapper.createObjectNode();
                retour.set("message", message);
                retour.set("type", type);
                retourList.add(retour);
            }
            return ok(retourList);
        }
        return ok();
    }

    public Result getLastMessageFromUserAndDestinataire() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong();
        User u = Application.getCurrentUserObj();
        User v = User.find.byId(id);
        if (u != null) {
            Message lastMsg = Message.find.query()
                    .where()
                    .or(Expr.and(
                            Expr.eq("expediteur_id", u.getId()),
                            Expr.eq("destinataire_id", v.getId())),
                        Expr.and(
                            Expr.eq("expediteur_id", v.getId()),
                            Expr.eq("destinataire_id", u.getId())))
                    .orderBy("date desc")
                    .setMaxRows(1)
                    .findOne();
            if (lastMsg != null) {
                ObjectNode message = mapper.valueToTree(lastMsg);
                DateUtils dU = new DateUtils();
                String dateSuivi = dU.toFrenchDateString(lastMsg.getDate());
                JsonNode date = mapper.valueToTree(dateSuivi);
                message.set("date", date);
                JsonNode type = null;
                if (lastMsg.getExpediteur().equals(u)) {
                    type = mapper.valueToTree("exp");
                }
                if (lastMsg.getDestinataire().equals(u)) {
                    type = mapper.valueToTree("dest");
                }
                ObjectNode retour = mapper.createObjectNode();
                retour.set("message", message);
                retour.set("type", type);
                return ok(retour);
            }
        }
        return ok();
    }

    public Result getAllConversations() {
        User u = Application.getCurrentUserObj();
        if (u != null) {
            List<User> destinataires = new ArrayList<>();
            Ebean.find(Message.class).select("destinataire")
            .fetch("destinataire")
            .where()
            .eq("expediteur", u)
            .findEach((Message m) -> {
                if (!destinataires.contains(m.getDestinataire())) {
                    destinataires.add(m.getDestinataire());
                }
            });
            List<User> expediteurs = new ArrayList<>();
            Ebean.find(Message.class).select("expediteur")
                    .fetch("expediteur")
                    .where()
                    .eq("destinataire", u)
                    .findEach((Message m) -> {
                        if (!expediteurs.contains(m.getExpediteur())) {
                            expediteurs.add(m.getExpediteur());
                        }
                    });
            for (User user : expediteurs) {
                if (!destinataires.contains(user)) {
                    destinataires.add(user);
                }
            }
            JsonNode retour = mapper.valueToTree(destinataires);
            return ok(retour);
        }
        return ok();
    }

    public Result sendMessage() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong();
        String message = json.get("message").asText();
        User dest = User.find.byId(id);
        User exp = Application.getCurrentUserObj();
        Message m = new Message(message, exp, dest);
        m.save();
        return ok();
    }

}
