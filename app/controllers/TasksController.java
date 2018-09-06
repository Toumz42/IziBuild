package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.*;
import models.utils.DateUtils;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * Created by ttomc on 28/03/2017.
 */
public class TasksController extends Controller {

    public Result addTask() {
        JsonNode json = request().body().asJson();
        String idProjStr = json.get("idProj").asText();
        String dateString = json.get("date").asText();
        String contenu = json.get("contenu").asText();
        dateString = dateString.replace(",","");
        Date date = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMMM yyyy", Locale.FRENCH);
        try {
            date = parser.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        String idUser = Application.getCurrentUser();
        User u = null;
        Projet grp = null;
        if (idUser != null && !idUser.equals("")) {
            Long id = Long.parseLong(idUser);
            u = User.find.byId(id);
            if (u != null) {
                Long idProj = Long.parseLong(idProjStr);
                grp = Projet.find.byId(idProj);
            }
        }

        if (contenu != null) {
            if (!contenu.equals("")) {
                Task suivi = new Task(date,contenu,0,grp);
                suivi.save();
                ObjectNode result = Json.toJson(suivi).deepCopy();
                return ok(result);

            } else {
                return ok("Erreur dans le nom");
            }
        } else {
            return ok("Erreur dans le nom");
        }
    }


    public Result getTasksbyProjectId() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong();
        Projet p = Projet.find.byId(id);
        if (p != null) {
            ObjectMapper mapper = new ObjectMapper();
            List<Task> list = p.getTaskList();
            JsonNode result = mapper.valueToTree(list);
            return ok().sendJson(result);

        }
        return ok().sendJson(Json.toJson(false));
    }

    public Result toggleTasksbyId() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong();
        Boolean val = json.get("value").asBoolean();
        Task p = Task.find.byId(id);
        if (p != null) {
            p.setEtatBoolean(val);
            p.save();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode result = mapper.valueToTree(p);
            return ok().sendJson(result);

        }
        return ok().sendJson(Json.toJson(false));
    }


}
