package controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.CalendarEvent;
import models.GroupeProjet;
import models.User;
import models.utils.DateUtils;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;


/**
 * Created by ttomc on 21/02/2017.
 */
public class CalendarController extends Controller{

    public Result getCalendar() {
        User u = Application.getCurrentUserObj();
        if (u != null) {
            ObjectMapper mapper = new ObjectMapper();
                List<CalendarEvent> eventList = CalendarEvent.find.query().where()
                        .eq("classe_id", u.getClasse().getId()).findList();

                if (eventList != null) {
                    ArrayNode listResult = mapper.valueToTree(eventList);
//                    listResult = Json.toJson(eventList).deepCopy();
                    return ok().sendJson(listResult);
                }

        }
        return ok();
    }
}
