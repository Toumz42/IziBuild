package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.ebean.Expr;
import models.User;
import models.utils.ErrorUtils;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.Map;

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
        if(checkConnected()) {
            return ok(views.html.admin.render());
        } else {
            return redirect("/login");
        }
    }

    public Result info()
    {
        if(checkConnected()) {
            return ok(views.html.info.render());
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
    public Result stockage()
    {
        if(checkConnected()) {
            return ok(views.html.stockage.render());
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

        ErrorUtils retour = null;
        User p = null;
        try
        {
//            p = User.find.query().where().eq("login", login)
//                    .and(Expr.eq("login", login),Expr.eq("password", pswd))
//                    .findUnique();

            p = User.find.query().where().eq("login", login)
                    .and(Expr.eq("login", login),Expr.eq("password", pswd))
                    .findUnique();

            if (p != null) {
                session("userId",p.id.toString());
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


    public Boolean checkConnected()
    {
        String user = session("userId");
        if(user != null) {
            return true;
        } else {
            return false;
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
        String user = session("userId");
        Long id = Long.parseLong(user);
        User u = User.find.byId(id);
        if(u != null) {
            return u;
        } else {
            return null;
        }
    }

    public Result logout() {
        session().clear();
        return ok("/login");
    }
}
