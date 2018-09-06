package controllers;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import models.CalendarEvent;
import models.Projet;
import models.User;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;


/**
 * Created by ttomc on 21/02/2017.
 */
public class CalendarController extends Controller{

    public Result getCalendar() {
        JsonNode json = request().body().asJson();
        User u = Application.getCurrentUserObj();
        if (u != null) {
            ObjectMapper mapper = new ObjectMapper();
            Long id = null;

            List<CalendarEvent> eventList = CalendarEvent.find.all();

            if (eventList != null) {
                ArrayNode listResult = mapper.valueToTree(eventList);
//                    listResult = Json.toJson(eventList).deepCopy();
                return ok().sendJson(listResult);
            }
        }
        return ok();
    }

    public Result getMyCalendar() {
        //JsonNode json = request().body().asJson();
        User u = Application.getCurrentUserObj();
        if (u != null) {
            ObjectMapper mapper = new ObjectMapper();
            Long id = null;
            List<Projet> listProj = UserController.getProjetList(u);
            List<CalendarEvent> eventList = new ArrayList<>();
            for (Projet p : listProj) {
                eventList.addAll(p.getEventList());
            }
            if (eventList != null) {
                ArrayNode listResult = mapper.valueToTree(eventList);
              //      listResult = Json.toJson(eventList).deepCopy();
                return ok().sendJson(listResult);
            }
        }
        return ok();
    }

    public Result addEvent() {
        JsonNode json = request().body().asJson();
        String titre = json.get("titre").asText();
        Long proj = json.get("proj").asLong();
        Long guestId = json.get("guestId").asLong();
        String dateEvent = json.get("dateEvent").asText();
        String hourStart = json.get("hourStart").asText();
        String hourEnd = json.get("hourEnd").asText();
        Projet projet = Projet.find.byId(proj);
        Date dateStart = null;
        Date dateEnd = null;
        User u = Application.getCurrentUserObj();
        SimpleDateFormat parser = new SimpleDateFormat("dd MMMM, yyyy hh:mm", Locale.FRENCH);
        try {
            dateStart = parser.parse(dateEvent+" "+hourStart);
            dateEnd = parser.parse(dateEvent+" "+hourEnd);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        CalendarEvent person = new CalendarEvent(titre, dateStart, dateEnd, projet, u);
        person.save();
        JsonNode retour = Json.toJson(person);
        return ok().sendJson(retour);
    }

    public Result updateEvent() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idEvent").asLong();
        String titre = json.get("titre").asText();
        Long proj = json.get("proj").asLong();
        String dateEvent = json.get("dateEvent").asText();
        String hourStart = json.get("hourStart").asText();
        String hourEnd = json.get("hourEnd").asText();
        Projet projet = Projet.find.byId(proj);
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
        calendarEvent.setProjet(projet);
        calendarEvent.setStart(dateStart);
        calendarEvent.setEnd(dateEnd);
        calendarEvent.save();
        JsonNode retour = Json.toJson(calendarEvent);
        return ok().sendJson(retour);
    }
}
