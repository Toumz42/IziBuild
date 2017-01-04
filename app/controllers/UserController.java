package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import models.User;
import play.data.FormFactory;
import play.db.jpa.JPAApi;
import play.db.jpa.Transactional;
import play.mvc.Controller;
import play.mvc.Result;

import javax.inject.Inject;
import java.util.List;

import static play.libs.Json.toJson;

public class UserController extends Controller {



    public UserController() {

    }

    public Result index() {

        return ok(views.html.index.render());
    }


    public Result addUser(/*String name, String surname, String email, String password*/) {
//        return redirect(routes.UserController.index());
        JsonNode json = request().body().asJson();
        String name = json.get("name").asText();
        String surname = json.get("surname").asText();
        String email = json.get("email").asText();
        String pass = json.get("password").asText();


        User u = User.find.where().ilike("email","%"+email+"%").findUnique();

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

        return ok("T'es déjà inscrit connard !");
    }

}
