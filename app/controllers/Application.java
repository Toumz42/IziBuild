package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.MailToken;
import models.User;
import models.utils.ErrorUtils;
import org.apache.commons.codec.digest.DigestUtils;
import play.libs.Json;
import play.libs.mailer.MailerClient;
import play.mvc.*;

import javax.inject.Inject;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Map;

/**
 * Created by ttomc on 02/01/2017.
 */
@With(CookieAction.class)
public class Application extends Controller {
    @Inject
    MailerClient mailerClient;

    public Application() {
    }

    public Result editAccount() {
        User u = Application.getCurrentUserObj();
        if (checkConnected()) {
            if (u != null) {
                switch (u.getDroit()) {
                    case 0:
                        return ok(views.html.home.render(checkConnected(), checkAdmin()));
                    case 1:
                        return ok(views.html.editPro.render(checkConnected(), checkAdmin()));
                    case 2:
                        return ok(views.html.editPart.render(checkConnected(), checkAdmin()));
                }
            }
        }
        return redirect("/login");
    }

    public Result index() {
        return ok(views.html.index.render(checkConnected(), checkAdmin()));
    }

    public Result home() {
        User u = Application.getCurrentUserObj();
        if (checkConnected()) {
            if (u != null) {
                switch (u.getDroit()) {
                    case 0:
                        return ok(views.html.home.render(checkConnected(), checkAdmin()));
                    case 1:
                        return ok(views.html.homePro.render(checkConnected(),checkAdmin()));
                    case 2:
                        return ok(views.html.homePart.render(checkConnected(),checkAdmin()));
                }
            }
        }
        return redirect("/login");
    }

    public Result login() {
        User.makeAdmin();
        User u = getCurrentUserObj();
        return ok(views.html.login.render(checkConnected(), checkAdmin()));
    }

    public Result projet() {
        if (checkConnected()) {
            User u = Application.getCurrentUserObj();
            if (u != null) {
                switch (u.getDroit()) {
                    case 0:
                        return ok(views.html.adminProjects.render(checkConnected(), checkAdmin()));
                    case 1:
                        return ok(views.html.projectPro.render(checkConnected(), checkAdmin()));
                    case 2:
                        return ok(views.html.project.render(checkConnected(), checkAdmin()));
                }
            }
        }
        return redirect("/login");
    }

    public Result admin() {
        User u = getCurrentUserObj();
        if (checkConnected() && checkAdmin()) {
            return ok(views.html.admin.render(checkConnected(), checkAdmin()));
        } else {
            if (checkConnected()) {
                return ok(views.html.home.render(checkConnected(), checkAdmin()));
            } else {
                return redirect("/login");
            }
        }
    }

    public Result doc() {
        if (checkConnected() && checkAdmin()) {
            return ok(views.html.doc.render(checkConnected(), checkAdmin()));
        } else {
            return redirect("/login");
        }
    }

    public Result incident() {
        if (checkConnected() && checkAdmin()) {
            return ok(views.html.incident.render(checkConnected(), checkAdmin()));
        } else {
            return redirect("/login");
        }
    }

    public Result agenda() {
        if (checkConnected()) {
            return ok(views.html.agenda.render(checkConnected(), checkAdmin()));
        } else {
            return redirect("/login");
        }
    }

    public Result repertoire() {
        if (checkAdmin()) {
            return ok(views.html.repertoireAdmin.render(checkConnected(), checkAdmin()));
        } else if (checkConnected()) {
            return ok(views.html.repertoire.render(checkConnected(), checkAdmin()));
        } else {
            return redirect("/login");
        }
    }

    public Result note() {
        if (checkConnected()) {
            return ok(views.html.note.render(checkConnected(), checkAdmin()));
        } else {
            return redirect("/login");
        }
    }

    public Result createPart() {
        return ok(views.html.createPart.render(checkConnected(), checkAdmin()));
    }

    public Result createPro() {
        return ok(views.html.createPro.render(checkConnected(), checkAdmin()));
    }


    public Result referentiel() {
        if (checkConnected()) {
            return ok(views.html.referentiel.render(checkConnected(), checkAdmin()));
        } else {
            return redirect("/login");
        }
    }

    public Result identifyUser() {
        String login, pswd;
        Map<String, String[]> param = request().body().asFormUrlEncoded();
        JsonNode json = request().body().asJson();
        login = json.get("login").asText();
        pswd =  json.get("pswd").asText();
        Boolean stay =  json.get("stay").asBoolean(true);
        //login = param.get("login")[0];
        //pswd = param.get("pswd")[0];
        String sha1pswd = DigestUtils.sha1Hex(pswd);

        ErrorUtils retour = null;
        User p = null;
        try {
            p = User.find.query().where()
                    .eq("login", login)
                    .eq("password", sha1pswd)
                    .findOne();
            if (p != null) {
                session("userId", p.getId().toString());
                if (stay) {
                    return ok("/home");
                }
                Calendar c = GregorianCalendar.getInstance();
                c.setTime(new Date());
                long h24 = (24L * 3600L * 1000L);
                String time = (c.getTimeInMillis() + h24 ) + "";
                session("expire", time);
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
                r = ProjectController.deleteProject(id);
                break;
            case "task":
                r = ProjectController.deleteTasks(id);
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
            return u.getDroit() != null && u.getDroit() == 0;
        }
        return false;
//        return true;
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


    public Result getCurrentUserJSON() {
        String user = session("userId");
        ObjectMapper mapr = new ObjectMapper();
        if (user != null) {
            Long id = Long.parseLong(user);
            User u = User.find.byId(id);
            JsonNode usr = mapr.valueToTree(u);
            return ok(usr);
        } else {
            return notFound();
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
        if (checkConnected()) {
            return ok(views.html.messagerie.render(checkConnected(), checkAdmin()));
        }
        return redirect("/login");
    }

    public Result conversation() {
        return ok(views.html.conversation.render(checkConnected(), checkAdmin()));
    }

    public Result faq() {
        return ok(views.html.faq.render(checkConnected(), checkAdmin()));
    }

    public Result forgotPassword() {
        JsonNode json = request().body().asJson();
        String mail = json.get("mail").asText();
        User u = User.find.query()
                .where().ilike("email","%"+mail+"%")
                .findOne();
        if (u != null) {
            u.setToken(new MailToken());
            u.save();
            u.resetPassword(mailerClient);
            return ok();
        }
        return badRequest();
    }

    public Result resetPasswordForm(String tokenId) {
        Long id = Long.parseLong(tokenId.split("-")[0]);
        String token = tokenId.split("-")[1];
        MailToken mailToken = MailToken.find.byId(id);
        if (mailToken != null && mailToken.getToken() != null) {
            if (mailToken.getToken().equals(token) && mailToken.getExpireDate().after(new Date())) {
                User u = mailToken.getUser();
                if (u != null) {
                    session("userId", u.getId().toString());
                    return ok(views.html.password.render(true, false));
                }
            }
        }
        return badRequest();
    }

    public Result resetPassword() {
        JsonNode json = request().body().asJson();
        String password = json.get("password").asText();
        User u = Application.getCurrentUserObj();
        if (u != null) {
            u.setPassword(password);
            return ok();
        }
        return badRequest();
    }
}
