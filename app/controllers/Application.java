package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

        return ok(views.html.index.render());

    }


    public Result home()
    {
        User u = Application.getCurrentUserObj();
        if(checkConnected()) {
            switch (u.getDroit()) {
                case 0 :
                return ok(views.html.home.render());
                case 1 :
                return ok(views.html.homePro.render());
                case 2 :
                return ok(views.html.homePart.render());
            }
        }
        return redirect("/login");
    }

    public Result login()
    {
        User.makeAdmin();
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

    public Result createPart()
    {
        return ok(views.html.createPart.render());
    }
    public Result createPro()
    {
        return ok(views.html.createPro.render());
    }
    public Result admNote()
    {
        if(checkAdmin() && checkConnected()) {
            return ok(views.html.admnote.render());
        } else {
            return redirect("/login");
        }
    }

    public Result referentiel() {
        if(checkConnected()) {
            return ok(views.html.referentiel.render());
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
            p = User.find.query().where().eq("login", login).eq("password", sha1pswd)
                    .findOne();

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
            case "projet":
                r = ProjectController.deleteGroupe(id);
                break;
            case "suivi":
                r = ProjectController.deleteAnomalies(id);
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
        //return u!=null;
        return true;
    }

    public Boolean checkAdmin() {
        User u = Application.getCurrentUserObj();
        if (u!=null) {
            if (u.getDroit() == 0) {
                return true;
            }
        }
        return false;
        //return true;
    }

    public Boolean checkPro() {
        User u = Application.getCurrentUserObj();
        if (u!=null) {
            if (u.getDroit() == 1) {
                return true;
            }
        }
        return false;
        //return true;
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
