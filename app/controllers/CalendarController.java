package controllers;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.CalendarEvent;
import models.Classe;
import models.GroupeProjet;
import models.User;
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
 * Created by ttomc on 21/02/2017.
 */
public class CalendarController extends Controller{

    public Result getCalendar() {
        JsonNode json = request().body().asJson();
        Long classeId = json.get("classeId").asLong();
        User u = Application.getCurrentUserObj();
        if (u != null) {
            ObjectMapper mapper = new ObjectMapper();
            Long id = u.getClasse().getId();
            if (classeId != null) {
                id = classeId;
            }
            List<CalendarEvent> eventList = CalendarEvent.find.all();

            if (classeId > 0 ) {
                eventList = CalendarEvent.find.query().where()
                    .eq("classe_id",id).findList();
            }

            if (eventList != null) {
                ArrayNode listResult = mapper.valueToTree(eventList);
//                    listResult = Json.toJson(eventList).deepCopy();
                return ok().sendJson(listResult);
            }
        }
        return ok();
    }
    public Result addEvent() {
        JsonNode json = request().body().asJson();
        String titre = json.get("titre").asText();
        Long prof = json.get("prof").asLong();
        String dateEvent = json.get("dateEvent").asText();
        String hourStart = json.get("hourStart").asText();
        String hourEnd = json.get("hourEnd").asText();
        Long classeId = json.get("classe").asLong();
        Classe classe = Classe.find.byId(classeId);
        User professeur = User.find.byId(prof);
        Date dateStart = null;
        Date dateEnd = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMMM, yyyy hh:mm", Locale.FRENCH);
        try {
            dateStart = parser.parse(dateEvent+" "+hourStart);
            dateEnd = parser.parse(dateEvent+" "+hourEnd);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        CalendarEvent person = new CalendarEvent(titre, dateStart, dateEnd, professeur, classe);
        person.save();
        JsonNode retour = Json.toJson(person);
        return ok().sendJson(retour);
    }

    public Result updateEvent() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idEvent").asLong();
        String titre = json.get("titre").asText();
        Long prof = json.get("prof").asLong();
        String dateEvent = json.get("dateEvent").asText();
        String hourStart = json.get("hourStart").asText();
        String hourEnd = json.get("hourEnd").asText();
        Long classeId = json.get("classe").asLong();
        Classe classe = Classe.find.byId(classeId);
        User professeur = User.find.byId(prof);
        Date dateStart = null;
        Date dateEnd = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMMM, yyyy hh:mm", Locale.FRENCH);
        try {
            dateStart = parser.parse(dateEvent+" "+hourStart);
            dateEnd = parser.parse(dateEvent+" "+hourEnd);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        CalendarEvent calendarEvent = CalendarEvent.find.byId(id);
        calendarEvent.setTitle(titre);
        calendarEvent.setProf(professeur);
        calendarEvent.setClasse(classe);
        calendarEvent.setStart(dateStart);
        calendarEvent.setEnd(dateEnd);

        calendarEvent.save();
        JsonNode retour = Json.toJson(calendarEvent);
        return ok().sendJson(retour);
    }
}
