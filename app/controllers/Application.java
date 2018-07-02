package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.User;
import models.utils.ErrorUtils;
import org.apache.commons.codec.digest.DigestUtils;
import play.libs.Json;
import play.mvc.*;

import java.util.Map;
import org.apache.commons.codec.digest.DigestUtils;

/**
 * Created by ttomc on 02/01/2017.
 */
public class Application extends Controller {

    public Application() {
    }

    public Result editPro() {
        return ok(views.html.editPro.render(checkConnected()));
    }

    public Result editPart() {
        return ok(views.html.editPart.render(checkConnected()));
    }

    public Result index() {
        return ok(views.html.index.render(checkConnected()));
    }

    public Result home() {
        User u = Application.getCurrentUserObj();
        if (checkConnected()) {
            if (u != null) {
                switch (u.getDroit()) {
                    case 0:
                        return ok(views.html.home.render(checkConnected()));
                    case 1:
                        return ok(views.html.homePro.render(checkConnected()));
                    case 2:
                        return ok(views.html.homePart.render(checkConnected()));
                }
            }
        }
        return redirect("/login");
    }

    public Result login() {
        User.makeAdmin();
        User u = getCurrentUserObj();
        return ok(views.html.login.render(checkConnected()));
    }

    public Result projet() {
        if (checkConnected()) {
            User u = Application.getCurrentUserObj();
            if (u != null) {
                switch (u.getDroit()) {
                    case 0:
                    case 1:
                        return ok(views.html.projectPro.render(checkConnected()));
                    case 2:
                        return ok(views.html.project.render(checkConnected()));
                }
            }
        }
        return redirect("/login");
    }

    public Result admin() {
        User u = getCurrentUserObj();
        if (checkConnected() && checkAdmin()) {
            return ok(views.html.admin.render(checkConnected()));
        } else {
            if (checkConnected()) {
                return ok(views.html.home.render(checkConnected()));
            } else {
                return redirect("/login");
            }
        }
    }

    public Result doc() {
        if (checkConnected()) {
            return ok(views.html.doc.render(checkConnected()));
        } else {
            return redirect("/login");
        }
    }

    public Result agenda() {
        if (checkConnected()) {
            return ok(views.html.agenda.render(checkConnected()));
        } else {
            return redirect("/login");
        }
    }

    public Result repertoire() {
        if (checkConnected()) {
            return ok(views.html.repertoire.render(checkConnected()));
        } else {
            return redirect("/login");
        }
    }

    public Result note() {
        if (checkConnected()) {
            return ok(views.html.note.render(checkConnected()));
        } else {
            return redirect("/login");
        }
    }

    public Result createPart() {
        return ok(views.html.createPart.render(checkConnected()));
    }

    public Result createPro() {
        return ok(views.html.createPro.render(checkConnected()));
    }

    public Result admNote() {
        if (checkAdmin() && checkConnected()) {
            return ok(views.html.admnote.render(checkConnected()));
        } else {
            return redirect("/login");
        }
    }

    public Result referentiel() {
        if (checkConnected()) {
            return ok(views.html.referentiel.render(checkConnected()));
        } else {
            return redirect("/login");
        }
    }

    public Result identifyUser() {
        String login, pswd;
        Map<String, String[]> param = request().body().asFormUrlEncoded();
        JsonNode json = request().body().asJson();
//        login = json.get("login").asText();
//        pswd =  json.get("pswd").asText();
        login = param.get("login")[0];
        pswd = param.get("pswd")[0];
        String sha1pswd = DigestUtils.sha1Hex(pswd);

        ErrorUtils retour = null;
        User p = null;
        try {
            p = User.find.query().where().eq("login", login).eq("password", sha1pswd)
                    .findOne();

            if (p != null) {
                session("userId", p.getId().toString());
                return ok("/home");
            } else {
                retour = ErrorUtils.createError(true, "Pas de Compte", "erreur");
            }
        } catch (Exception e) {
            e.printStackTrace();
            retour = ErrorUtils.createError(true, e.getMessage(), "erreur");
        }
        ObjectMapper mapper = new ObjectMapper();
        JsonNode retourJson = mapper.convertValue(retour, JsonNode.class);

        return ok().sendJson(retourJson);
    }

    public Result deleteDispatcher() {
        JsonNode json = request().body().asJson();
        String type = json.get("type").asText();
        Long id = json.get("id").asLong();
        Result r = badRequest();
        switch (type) {
            case "user":
                r = UserController.deleteUser(id);
                break;
            case "projet":
                r = ProjectController.deleteGroupe(id);
                break;
            case "suivi":
                r = ProjectController.deleteAnomalies(id);
                break;
        }
        return r;
    }

    public Boolean checkConnected() {
        String user = session("userId");
        User u = null;
        if (user != null) {
            Long id = Long.parseLong(user);
            u = User.find.byId(id);
        }
        return u!=null;
        //return true;
    }

    public Boolean checkAdmin() {
        User u = Application.getCurrentUserObj();
        if (u != null) {
            if (u.getDroit() == 0) {
                return true;
            }
        }
        //return false;
        return true;
    }

    public Boolean checkPro() {
        User u = Application.getCurrentUserObj();
        if (u != null) {
            if (u.getDroit() == 1) {
                return true;
            }
        }
        return false;
        //return true;
    }

    public Result checkAdminJson() {
        if (checkAdmin()) {
            JsonNode jsonNode = Json.toJson(true);
            return ok(jsonNode);
        } else {
            return forbidden();
        }
    }

    public static String getCurrentUser() {
        String user = session("userId");
        if (user != null) {
            return user;
        } else {
            return null;
        }
    }

    public static User getCurrentUserObj() {
        User u = null;
        String user = session("userId");
        if (user != null) {
            Long id = Long.parseLong(user);
            u = User.find.byId(id);
        }
        return u;
    }

    public Result logout() {
        session().clear();
        return ok("/login");
    }

    public Result messagerie() {
        return ok(views.html.messagerie.render(checkConnected()));
    }

    public Result conversation() {
        return ok(views.html.conversation.render(checkConnected()));
    }

    public Result faq() {
        return ok(views.html.faq.render(checkConnected()));
    }

}
