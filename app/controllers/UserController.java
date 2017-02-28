package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.Classe;
import models.GroupeProjet;
import models.User;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import play.data.FormFactory;
import play.db.jpa.JPAApi;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import scala.App;

import javax.inject.Inject;
import java.util.List;
import java.util.Locale;

import static play.libs.Json.toJson;

public class UserController extends Controller {

    public Result addUser(/*String name, String surname, String email, String password*/) {
        JsonNode json = request().body().asJson();
        String name = json.get("name").asText();
        String surname = json.get("surname").asText();
        Integer droit = json.get("droit").asInt();
        String email = json.get("email").asText();
        String pass = json.get("password").asText();

        User u = User.find.query()
                .where()
                .ilike("email","%"+email+"%")
                .findUnique();

        if (u == null) {
            if (email != null) {
                if (!email.equals("")) {
                    User person = new User(name, surname, email, pass,droit);
                    person.save();
                    JsonNode retour = Json.toJson(person);
                    return ok().sendJson(retour);
                } else {
                    return badRequest("Erreur dans le mail");
                }
            } else {
                return badRequest("Erreur dans le mail");
            }
        }

        return badRequest("Déjà inscrit !");
    }

    public Result getAllUser() {
        JsonNode json = request().body().asJson();
        Long classeId = null;
        if (json != null) {
          if (json.get("classeId") != null) {
              classeId = json.get("classeId").asLong();
          }
        }
        String idUser = Application.getCurrentUser();
        User u = null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id",id).findUnique();

        }
        if (u != null) {
            List<User> userList= null;
            if (classeId != null) {
                userList = User.find.query().where().eq("classe_id",classeId).findList();
            } else {
                userList = User.find.all();
            }
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();

            for (User user : userList) {
                ObjectNode userNode = mapper.valueToTree(user);
                listResult.add(userNode);
            }
            return ok().sendJson(listResult);
        }
        return notFound();
    }

    public Result getAllClasse() {
        String idUser = Application.getCurrentUser();
        User u = null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id",id).findUnique();
        }
        if (u != null) {
            List<Classe> classeList= Classe.find.all();
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();
            for (Classe classe : classeList) {
                ObjectNode classeNode = mapper.valueToTree(classe);
                listResult.add(classeNode);
            }
            return ok().sendJson(listResult);
        }
        return notFound();
    }

    public Result addClasse() {
        JsonNode json = request().body().asJson();
        String name = json.get("name").asText();

        Classe u = Classe.find.query()
                .where()
                .ilike("name","%"+name+"%")
                .findUnique();

        if (u == null) {
            if (name != null) {
                if (!name.equals("")) {
                    Classe claz = new Classe(name);
                    claz.save();
                    JsonNode result = Json.toJson(claz);
                    return ok(result);
                } else {
                    return ok("Erreur dans le theme");
                }
            } else {
                return ok("Erreur dans le theme");
            }
        }
        return ok("Déjà inscrit !");
    }
}
