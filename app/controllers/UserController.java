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
import play.mvc.Controller;
import play.mvc.Result;
import scala.App;

import javax.inject.Inject;
import java.util.List;
import java.util.Locale;

import static play.libs.Json.toJson;

public class UserController extends Controller {

    public Result addUser(/*String name, String surname, String email, String password*/) {
//        return redirect(routes.UserController.index());
        JsonNode json = request().body().asJson();
        String name = json.get("name").asText();
        String surname = json.get("surname").asText();
        String email = json.get("email").asText();
        String pass = json.get("password").asText();

        User u = User.find.query()
                .where()
                .ilike("email","%"+email+"%")
                .findUnique();

        if (u == null) {
            if (email != null) {
                if (!email.equals("")) {
                    User person = new User(name, surname, email, pass);
                    person.save();
                    return ok("L'incription s'est bien passée ! :)");
                } else {
                    return ok("Erreur dans le mail");
                }
            } else {
                return ok("Erreur dans le mail");
            }
        }

        return ok("Déjà inscrit !");
    }

    public Result getAllUser() {

        String idUser = Application.getCurrentUser();
        User u = null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id",id).findUnique();

        }
        if (u != null) {
            List<User> userList= User.find.all();
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();
            Integer i = 0;
            for (User user : userList) {
//                List<User> userList = User.find.query().fetch("groupe").where().eq("groupe.id",g.id).findList();
//                ArrayNode array = mapper.valueToTree(userList);
                ObjectNode userNode = mapper.valueToTree(user);
//                ObjectNode userNode = mapper.valueToTree(g);
//                userNode.remove("dateSoutenance");
//                DateTime dt = new DateTime(g.dateSoutenance);
//                DateTimeFormatter fmt = DateTimeFormat.forPattern("dd MMMM yyyy");
//                DateTimeFormatter frenchFmt = fmt.withLocale(Locale.FRENCH);
//                String date = frenchFmt.print(dt) ;
//                userNode.put("date", date );
//                userNode.putArray("users").addAll(array);
                listResult.add(userNode);
                i++;
            }
//                JsonNode retour = Json.toJson(projetList);
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
            Integer i = 0;
            for (Classe classe : classeList) {
//                List<User> userList = User.find.query().fetch("groupe").where().eq("groupe.id",g.id).findList();
//                ArrayNode array = mapper.valueToTree(userList);
                ObjectNode classeNode = mapper.valueToTree(classe);
//                ObjectNode userNode = mapper.valueToTree(g);
//                userNode.remove("dateSoutenance");
//                DateTime dt = new DateTime(g.dateSoutenance);
//                DateTimeFormatter fmt = DateTimeFormat.forPattern("dd MMMM yyyy");
//                DateTimeFormatter frenchFmt = fmt.withLocale(Locale.FRENCH);
//                String date = frenchFmt.print(dt) ;
//                userNode.put("date", date );
//                userNode.putArray("users").addAll(array);
                listResult.add(classeNode);
                i++;
            }
//                JsonNode retour = Json.toJson(projetList);
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
                    Classe person = new Classe(name);
                    person.save();
                    return ok("La création s'est bien passée ! :)");
                } else {
                    return ok("Erreur dans le theme");
                }
            } else {
                return ok("Erreur dans le theme");
            }
        }
        return ok("Déjà inscrit !");
    }

    public Boolean checkAdmin() {
        User u = Application.getCurrentUserObj();
        if (u!=null) {
            if (u.droit == 0) {
                return true;
            }
        }
        return false;
    }
}
