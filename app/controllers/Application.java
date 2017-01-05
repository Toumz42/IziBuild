package controllers;

import com.avaje.ebean.Expr;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.javafx.collections.MappingChange;
import models.User;
import models.utils.ErrorUtils;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.Map;

/**
 * Created by ttomc on 02/01/2017.
 */
public class Application extends Controller {





    public Result index()
    {
        if(checkConnected()) {
            return redirect("/project");
        } else {
            return redirect("/login");
        }
    }


    public Result home()
    {
//        if(checkConnected()) {
            return ok(views.html.home.render());
//        } else {
//            return redirect("/login");
//        }
    }

    public Result login()
    {
        return ok(views.html.login.render());
    }

    public Result project()
    {
        if(checkConnected()) {
            return ok(views.html.project.render());
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
            p = User.find.where().eq("login", login)
                    .and(Expr.eq("login", login),Expr.eq("password", pswd))
                    .findUnique();

            if (p != null) {
                session("userId",p.id.toString());
                return ok("/project");
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
}
