package controllers;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.GroupeProjet;
import models.SuiviProjet;
import models.User;


import models.utils.HtmlUtils;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.io.IOException;
import java.lang.reflect.Field;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * Created by ttomc on 06/01/2017.
 */
public class ProjectController extends Controller {

    public Result getGroupeProject() {


        String idUser = Application.getCurrentUser();
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            User u = User.find.query().where().eq("id",id).findUnique();

            if (u != null) {
                GroupeProjet grp = GroupeProjet.find.query().where()
                        .eq("id",u.groupe.id)
                        .findUnique();

                JsonNode retour = Json.toJson(grp);

                return ok().sendJson(retour);
            }
        }
        return notFound();

    }

    public Result getAllGroupeProject() {

        String idUser = Application.getCurrentUser();
        User u = null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id",id).findUnique();

        }
        if (u != null) {
            List<GroupeProjet> projetList= GroupeProjet.find.all();
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();
            Integer i = 0;
            for (GroupeProjet g : projetList) {
                List<User> userList = User.find.query().fetch("groupe").where().eq("groupe.id",g.id).findList();
                ArrayNode array = mapper.valueToTree(userList);
                ObjectNode userNode = mapper.valueToTree(g);
                userNode.remove("dateSoutenance");
                DateTime dt = new DateTime(g.dateSoutenance);
                DateTimeFormatter fmt = DateTimeFormat.forPattern("dd MMMM yyyy");
                DateTimeFormatter frenchFmt = fmt.withLocale(Locale.FRENCH);
                String date = frenchFmt.print(dt) ;
                userNode.put("date", date );
                userNode.putArray("users").addAll(array);
                listResult.add(userNode);
                i++;
            }


//                JsonNode retour = Json.toJson(projetList);
            return ok().sendJson(listResult);
        }
        return notFound();

    }

    public Result getProjects() {


        String idUser = Application.getCurrentUser();
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            User u = User.find.query().where().eq("id",id).findUnique();

            if (u != null) {
                List<SuiviProjet> list = SuiviProjet.find.query().fetch("groupe").fetch("groupe","id").where()
                        .eq("groupe.id",u.groupe.id)
                        .findList();

//                ObjectMapper mapper = new ObjectMapper();
                JsonNode result = Json.toJson(list);
                return ok(result);
//                JsonNode retourJson = HtmlUtils.ListObjectToJsonTab(list);

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
