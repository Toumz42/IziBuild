package controllers;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.GroupeProjet;
import models.SuiviProjet;
import models.User;

import models.query.QSuiviProjet;
import models.query.QUser;
import models.utils.HtmlUtils;
import play.mvc.Controller;
import play.mvc.Result;

import java.io.IOException;
import java.lang.reflect.Field;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * Created by ttomc on 06/01/2017.
 */
public class ProjectController extends Controller {

    public Result getGroupeProject() {

        QUser user = models.query.QUser.alias();
        QSuiviProjet proj = QSuiviProjet.alias();

        String idUser = Application.getCurrentUser();
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            User u = User.find.query().where().eq("id",id).findUnique();

            if (u != null) {
                GroupeProjet grp = GroupeProjet.find.query().where()
                        .eq("id",u.groupe.id)
                        .findUnique();

                JsonNode tableauRetour = HtmlUtils.ObjectToJsonTab(grp);

                return ok().sendJson(tableauRetour);
            }
        }
        return notFound();

    }

    public Result getProjects() {

        QUser user = models.query.QUser.alias();
        QSuiviProjet proj = QSuiviProjet.alias();

        String idUser = Application.getCurrentUser();
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            User u = User.find.query().where().eq("id",id).findUnique();

            if (u != null) {
                List<SuiviProjet> list = SuiviProjet.find.query().fetch("groupe").fetch("groupe","id").where()
                        .eq("groupe.id",u.groupe.id)
                        .findList();

                ObjectMapper mapper = new ObjectMapper();
                JsonNode retourJson = mapper.convertValue(list, JsonNode.class);

                return ok().sendJson(retourJson);
            }
        }
        return notFound();

    }

    public Result addProjectGroup() {

        JsonNode json = request().body().asJson();
        String name = json.get("name").asText();
        String theme = json.get("theme").asText();
        String dateString = json.get("date").asText();
        dateString = dateString.replace(",","");
        Date date = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMMM yyyy", Locale.ENGLISH);
        try {
            date = parser.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        GroupeProjet u = GroupeProjet.find.query()
                .where()
                .ilike("name","%"+name+"%")
                .findUnique();

        if (u == null) {
            if (theme != null) {
                if (!theme.equals("")) {
                    GroupeProjet person = new GroupeProjet(name, theme, date);
                    person.save();
                    return ok("L'incription s'est bien passée ! :)");
                } else {
                    return ok("Erreur dans le nom");
                }
            } else {
                return ok("Erreur dans le nom");
            }
        }

        return ok("Déjà inscrit !");
    }
}
