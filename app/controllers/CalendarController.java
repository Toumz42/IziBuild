package controllers;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
            List<CalendarEvent> eventList = new ArrayList<>();
            eventList = u.getEventList();
            if (eventList != null) {
                ArrayNode listResult = mapper.createArrayNode();
                for (CalendarEvent cal : eventList) {
                    ObjectNode o = mapper.valueToTree(cal);
                    ArrayNode proList = mapper.createArrayNode();
                    for (User p : cal.getProList()) {
                        ObjectNode pro = mapper.valueToTree(p);
                        proList.add(pro);
                    }
                    o.set("proList", proList);
                    listResult.add(o);
                }
                return ok().sendJson(listResult);
            }
        }
        return ok();
    }

    public Result addEvent() {
        JsonNode json = request().body().asJson();
        String titre = json.get("titre").asText();
        Long proj = json.get("proj").asLong();
        ArrayNode guestIds = json.get("groupids") != null ? json.get("groupids").deepCopy() : null;
        String dateEvent = json.get("dateEvent").asText();
        String hourStart = json.get("hourStart").asText();
        String hourEnd = json.get("hourEnd").asText();
        Projet projet = Projet.find.byId(proj);
        Date dateStart = null;
        Date dateEnd = null;
        User u = Application.getCurrentUserObj();


        SimpleDateFormat parser = new SimpleDateFormat("dd MMM, yyyy HH:mm", Locale.FRENCH);
        try {
            String ds = dateEvent + " " + hourStart;
            String de = dateEvent + " " + hourEnd;
            dateStart = parser.parse(ds);
            dateEnd = parser.parse(de);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        CalendarEvent event = new CalendarEvent(titre, dateStart, dateEnd, projet, u);
        event.save();
        addFromJsonToPro(guestIds, event);
        JsonNode retour = Json.toJson(event);
        return ok().sendJson(retour);
    }

    private void addFromJsonToPro(ArrayNode guestIds, CalendarEvent event) {
        for (JsonNode guest : guestIds) {
            Long guestId = guest.asLong();
            User pro = User.find.byId(guestId);
            if (pro != null) {
                pro.addToEventListPro(event);
                pro.save();
            }
        }
    }

    public Result updateEvent() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idEvent").asLong();
        String titre = json.get("titre").asText();
        Long proj = json.get("proj").asLong();
        ArrayNode guestIds = json.get("groupids") != null ? json.get("groupids").deepCopy() : null;
        String dateEvent = json.get("dateEvent").asText();
        String hourStart = json.get("hourStart").asText();
        String hourEnd = json.get("hourEnd").asText();
        Projet projet = Projet.find.byId(proj);
        Date dateStart = null;
        Date dateEnd = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMM, yyyy hh:mm", Locale.FRENCH);
        try {
            dateStart = parser.parse(dateEvent+" "+hourStart);
            dateEnd = parser.parse(dateEvent+" "+hourEnd);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        CalendarEvent calendarEvent = CalendarEvent.find.byId(id);
        calendarEvent.setTitle(titre);
        if (projet != null) {
            calendarEvent.setProjet(projet);
        }
        calendarEvent.setStart(dateStart);
        calendarEvent.setEnd(dateEnd);
        addFromJsonToPro(guestIds, calendarEvent);
        calendarEvent.save();
        JsonNode retour = Json.toJson(calendarEvent);
        return ok().sendJson(retour);
    }
}
