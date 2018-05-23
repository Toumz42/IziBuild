package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.Referentiel;
import models.User;
import org.apache.commons.codec.digest.DigestUtils;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;

public class UserController extends Controller {

    public Result getAllPros() {
        List<User> userList= null;

        userList = User.find.query().where().eq("droit",1).findList();

        if (userList != null) {

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


    public Result addUser() {
        JsonNode json = request().body().asJson();
        String name = json.get("name").asText();
        String surname = json.get("surname").asText();
        Integer type = json.get("type").asInt();
        String email = json.get("email").asText();
        String pass = json.get("password").asText();
        Long categorieId = json.get("categorie").asLong();
        String sha1pass = DigestUtils.sha1Hex(pass);

        Referentiel categorie = Referentiel.find.byId(categorieId);

        User u = User.find.query()
                .where()
                .ilike("email","%"+email+"%")
                .findOne();

        if (u == null) {
            if (email != null) {
                if (!email.equals("")) {
                    User person = new User(name, surname, email, sha1pass, type, categorie);
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

    public Result updateUser() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idUser").asLong();
        String name = json.get("name").asText();
        String surname = json.get("surname").asText();
        Integer droit = json.get("droit").asInt();
        String email = json.get("email").asText();
        String pass = json.get("password").asText();
        String sha1pass = DigestUtils.sha1Hex(pass);

        User u = User.find.byId(id);

        if (u != null) {
            if (email != null) {
                if (!email.equals("")) {
                    u.setName(name);
                    u.setSurname(surname);
                    u.setDroit(droit);
                    u.setEmail(email);
                    u.setPassword(sha1pass);
                    u.save();
                    JsonNode retour = Json.toJson(u);
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


    public static Result deleteUser(Long id) {
        User u = User.find.byId(id);
        if (u != null) {
            u.delete();
            return ok(Json.toJson(true));
        }
        return badRequest("Erreur dans la suppression");
    }

    public Result getAllUser() {
        JsonNode json = request().body().asJson();
        String idUser = Application.getCurrentUser();
        User u = null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id",id).findOne();

        }
        if (u != null) {
            List<User> userList= null;

            userList = User.find.query().where().not().eq("droit",0).findList();

            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();

            if (userList != null) {
                for (User user : userList) {
                    ObjectNode userNode = mapper.valueToTree(user);
                    listResult.add(userNode);
                }
            }
            return ok().sendJson(listResult);
        }
        return notFound();
    }



}
