package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.ebean.Expr;
import models.User;
import models.utils.ErrorUtils;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.Map;
import org.apache.commons.codec.digest.DigestUtils;

/**
 * Created by ttomc on 02/01/2017.
 */
public class Application extends Controller {

    public Application() {
    }

    public Result index()
    {
        if(checkConnected()) {
            return redirect("/home");
        } else {
            return redirect("/login");
        }
    }


    public Result home()
    {
        if(checkConnected()) {
            return ok(views.html.home.render());
        } else {
            return redirect("/login");
        }
    }

    public Result login()
    {
        return ok(views.html.login.render());
    }

    public Result projet()
    {
        if(checkConnected()) {
            return ok(views.html.project.render());
        } else {
            return redirect("/login");
        }
    }

    public Result admin()
    {
        if(checkConnected() && checkAdmin()) {
            return ok(views.html.admin.render());
        } else {
            if(checkConnected()) {
                return ok(views.html.home.render());
            } else {
                return redirect("/login");
            }
        }
    }

    public Result doc()
    {
        if(checkConnected()) {
            return ok(views.html.doc.render());
        } else {
            return redirect("/login");
        }
    }
    public Result agenda()
    {
        if(checkConnected()) {
            return ok(views.html.agenda.render());
        } else {
            return redirect("/login");
        }
    }
    public Result note()
    {
        if(checkConnected()) {
            return ok(views.html.note.render());
        } else {
            return redirect("/login");
        }
    }
    public Result admNote()
    {
        if(checkAdmin() && checkConnected()) {
            return ok(views.html.admnote.render());
        } else {
            return redirect("/login");
        }
    }


    public Result identifyUser()
    {
        String login, pswd;
        Map<String,String[]> param = request().body().asFormUrlEncoded();
        JsonNode json = request().body().asJson();
//        login = json.get("login").asText();
//        pswd =  json.get("pswd").asText();
        login = param.get("login")[0];
        pswd =  param.get("pswd")[0];
        String sha1pswd = DigestUtils.sha1Hex(pswd);

        ErrorUtils retour = null;
        User p = null;
        try
        {
            p = User.find.query().where().eq("login", login)
                    .and(Expr.eq("login", login),Expr.eq("password", sha1pswd))
                    .findUnique();

            if (p != null) {
                session("userId",p.getId().toString());
                return ok("/home");
            } else {
                retour = ErrorUtils.createError( true, "Pas de Compte", "erreur" );
            }
        }
        catch ( Exception e )
        {
            e.printStackTrace();
            retour = ErrorUtils.createError( true, e.getMessage(), "erreur" );
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
            case "groupe":
                r = ProjectController.deleteGroupe(id);
                break;
            case "suivi":
                r = ProjectController.deleteSuivi(id);
                break;
            case "classe":
                r = UserController.deleteClasse(id);
                break;
        }
        return r;
    }

    public Boolean checkConnected()
    {
        String user = session("userId");
        User u = null;
        if (user != null) {
            Long id = Long.parseLong(user);
            u = User.find.byId(id);
        }
        if(u != null) {
            return true;
        }
        return false;
    }

    public Boolean checkAdmin() {
        User u = Application.getCurrentUserObj();
        if (u!=null) {
            if (u.getDroit() == 0) {
                return true;
            }
        }
        return false;
    }

    public Result checkAdminJson() {
        if (checkAdmin())
        {
            JsonNode jsonNode = Json.toJson(true);
            return ok(jsonNode);
        } else {
            return forbidden();
        }
    }

    public static String getCurrentUser()
    {
        String user = session("userId");
        if(user != null) {
            return user;
        } else {
            return null;
        }
    }

    public static User getCurrentUserObj()
    {
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
}
