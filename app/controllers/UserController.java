package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.ebean.Ebean;
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
import org.apache.commons.codec.digest.DigestUtils;

import static play.libs.Json.toJson;

public class UserController extends Controller {

    public Result getAllProf() {
        List<User> userList= null;

        userList = User.find.query().where().eq("droit",0).findList();

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
        Integer droit = json.get("droit").asInt();
        String email = json.get("email").asText();
        String pass = json.get("password").asText();
        Long classeId = json.get("classe").asLong();
        Classe classe = Classe.find.byId(classeId);
        String sha1pass = DigestUtils.sha1Hex(pass);

        if (classe == null && droit == 0) {
            if (classeId == 0) {
                Classe c = Classe.find.query().where().eq("name","Professeur").findUnique();
                if (c == null) {
                    c = new Classe("Professeur");
                }
            }
        }

        User u = User.find.query()
                .where()
                .ilike("email","%"+email+"%")
                .findUnique();

        if (u == null) {
            if (email != null) {
                if (!email.equals("")) {
                    User person = new User(name, surname, email, sha1pass, droit, classe);
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
        Long classe = json.get("classe").asLong();
        String email = json.get("email").asText();
        String pass = json.get("password").asText();
        String sha1pass = DigestUtils.sha1Hex(pass);

        User u = User.find.byId(id);
        Classe c = Classe.find.byId(classe);

        if (c == null) {
            if (classe == 0 && droit == 0) {
                Classe cl = Classe.find.query().where().eq("name","Professeur").findUnique();
                if (cl == null) {
                    cl = new Classe("Professeur");
                    cl.save();
                }
            }
        }

        if (u != null) {
            if (email != null) {
                if (!email.equals("")) {
                    u.setName(name);
                    u.setSurname(surname);
                    u.setDroit(droit);
                    u.setEmail(email);
                    u.setPassword(sha1pass);
                    u.setClasse(c);
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

    public static Result deleteClasse(Long id) {
        Classe c = Classe.find.byId(id);
        if (c != null) {
            Ebean.delete(c);
            return ok(Json.toJson(true));
        }
        return badRequest("Erreur dans la suppression");
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
                userList = User.find.query().where().not().eq("droit",0).findList();
            }
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


    public Result getAllClasse() {
        String idUser = Application.getCurrentUser();
        User u = null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id",id).findUnique();
        }
        JsonNode json = request().body().asJson();
        Long classeId = null;
        if (json != null) {
            if (json.get("classeId") != null) {
                classeId = json.get("classeId").asLong();
            }
        }
        if (u != null) {
            ArrayNode listResult;
            ObjectMapper mapper = new ObjectMapper();
            List<Classe> classeList = null;
            Classe classe = null;
            if (classeId != null) {
                classe = Classe.find.byId(classeId);
                return ok().sendJson(mapper.valueToTree(classe));
            } else {
                classeList = Classe.find.all();
                listResult = mapper.createArrayNode();
                for (Classe c : classeList) {
                    ObjectNode classeNode = mapper.valueToTree(c);
                    listResult.add(classeNode);
                }
                return ok().sendJson(listResult);
            }
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
                    return badRequest("Erreur dans le theme");
                }
            } else {
                return badRequest("Erreur dans le theme");
            }
        }
        return badRequest("Déjà inscrit !");
    }

    public Result updateClasse() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idClasse").asLong();
        String name = json.get("name").asText();
        Classe classe = Classe.find.byId(id);

        if (classe != null) {
            if (name != null) {
                if (!name.equals("")) {
                    classe.setName(name);
                    classe.save();
                    JsonNode result = Json.toJson(classe);
                    return ok(result);
                } else {
                    return badRequest("Erreur dans le theme");
                }
            } else {
                return badRequest("Erreur dans le theme");
            }
        }
        return badRequest("Déjà inscrit !");
    }

}
