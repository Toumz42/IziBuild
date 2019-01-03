package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.CalendarEvent;
import models.Projet;
import models.Task;
import models.User;
import models.utils.DateUtils;
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
 * Created by ttomc on 06/01/2017.
 */
public class ProjectController extends Controller {

    ObjectMapper mapper = new ObjectMapper();

    public Result getProjectbyId() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong();
        if (id != null ) {
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();
            Projet grp = Projet.find.byId(id);
            if (grp != null) {
                List<User> userList = null;
                userList = grp.getProList();
//                List<User> userList = User.find.query().fetch("projet").where().eq("projet.id",grp.getId()).findList();
                if (userList !=null) {
                    ArrayNode array = mapper.valueToTree(userList);
                    ObjectNode userNode = mapper.valueToTree(grp);
                    userNode.putArray("userList").addAll(array);
                    listResult.add(userNode);
                    return ok().sendJson(listResult);
                }
            }
        }
        return notFound();

    }

    public static Result deleteProject(Long id) {
        Projet grp = Projet.find.byId(id);
        if (grp != null) {
            if (grp.getProList()!=null) {
                List<User> users =  grp.getProList();
                for (User u : users) {
                    u.removeFromProjetListPro(grp);
                    u.update();
                    grp.setProList(new ArrayList<>());
                }
            }
            if (grp.getUser() != null) {
                grp.getUser().removeFromProjetListUser(grp);
                grp.getUser().update();
                grp.setUser(null);
            }
            if (grp.getEventList() != null) {
                for (CalendarEvent event : grp.getEventList()) {
                    event.setProjet(null);
                    event.save();
                }
                grp.setEventList(new ArrayList<>());
            }
            grp.delete();
            return ok(Json.toJson(true));
        }
        return badRequest("Erreur dans la suppression");
    }

    public static Result deleteTasks(Long id) {
        Task task = Task.find.byId(id);
        if (task != null) {
            task.delete();
            return ok(Json.toJson(true));
        }
        return badRequest("Erreur dans la suppression");
    }

    public Result getAllGroupeProject() {
        JsonNode json = request().body().asJson();
        String idUser = Application.getCurrentUser();
        User u = null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id",id).findOne();
        }
        if (u != null) {
            List<Projet> projetList= new ArrayList<>();
            projetList = Projet.find.all();
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();
//            for (Projet g : projetList) {
//                List<User> userList = User.find.query().fetch("projet").where().eq("projet.id",g.getId()).findList();
//                ArrayNode array = mapper.valueToTree(userList);
//                ObjectNode userNode = mapper.valueToTree(g);
//                userNode.remove("dateCreation");
//                userNode.put("date", g.getDateSoutenanceString());
//                userNode.put("theme", g.getTheme() );
//                userNode.putArray("users").addAll(array);
//                listResult.add(userNode);
//            }
            JsonNode retour = Json.toJson(projetList);
            //return ok().sendJson(listResult);
            return ok().sendJson(retour);
        }
        return notFound();

    }

    public Result getProjects() {
        JsonNode json = request().body().asJson();
        User u = Application.getCurrentUserObj();
        if (u != null) {
            List<Projet> list = u.getProjetListUser();
            JsonNode result = Json.toJson(list);
            if (result.isArray() && result.size() == list.size()) {
                ArrayNode arrayNode = result.deepCopy();
                result = arrayNode.deepCopy();
            }
            return ok(result);
        }
        return notFound();
    }

    public Result getProjectsPro() {
        JsonNode json = request().body().asJson();
        User u  = Application.getCurrentUserObj();
        if (u != null ) {
            List<Projet> list = u.getProjetListPro();
            JsonNode result = Json.toJson(list);
            if (result.isArray() && result.size() == list.size()) {
                ArrayNode arrayNode = result.deepCopy();
                for ( int i = arrayNode.size() - 1; i >= 0; i--) {
                    ObjectNode o = arrayNode.get(i).deepCopy();
                    DateUtils dU = new DateUtils();
                    List<User> pro = list.get(i).getProList();
                    if (pro.contains(u)) {
                        pro.remove(u);
                    }
                    JsonNode dateSuivi = mapper.valueToTree(
                            dU.toFrenchDateString(
                                list.get(i)
                                .getDateCreation()
                            ));
                    JsonNode proNode = mapper.valueToTree(pro);
                    o.remove("dateCreation");
                    o.set("date", dateSuivi);
                    o.set("proList", proNode);
                    arrayNode.remove(i);
                    arrayNode.add(o);
                }
                result = arrayNode.deepCopy();
            }
            return ok(result);
        }
        return notFound();
    }
    public Result getProjectPages() {
        List<Projet> projetList = Projet.find.all();
        if (projetList != null) {
            Integer size = (int) Math.ceil((double) projetList.size() / 10d);
            JsonNode userNode = mapper.valueToTree(size);
            return ok().sendJson(userNode);
        }
        return notFound();
    }

    public Result getAllProjectByPage() {
        JsonNode json = request().body().asJson();
        Integer page = (json.get("page").asInt() - 1) * 10;
        List<Projet> projetList = Projet.find.query()
                .setFirstRow(page)
                .setMaxRows(10)
                .findList();
        if (projetList != null) {
            JsonNode userNode = mapper.valueToTree(projetList);
            return ok().sendJson(userNode);
        }
        return notFound();
    }


    public Result addProject() {
        JsonNode json = request().body().asJson();
        String theme = json.get("theme") != null ? json.get("theme").asText() : "";
        String dateString = json.get("date") != null ? json.get("date").asText() : "";
        String adresse = json.get("adresse") != null ? json.get("adresse").asText() : "";
        Long superficie = json.get("superficie") != null ? json.get("superficie").asLong() : 0L;
        ArrayNode groupString = json.get("groupids") != null ? json.get("groupids").deepCopy() : null;
        Date date = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMM, yyyy", Locale.FRENCH);
        try {
            date = parser.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        User u = Application.getCurrentUserObj();
        if (theme != null) {
            if (!theme.equals("")) {
                Projet projet = new Projet(theme, date);
                projet.setAdresse(adresse);
                projet.setSuperficie(superficie);
                u.addToProjetListUser(projet);
                u.save();
                projet.setUser(u);
                projet.save();
                ObjectMapper mapper = new ObjectMapper();
                ObjectNode groupeNode = mapper.valueToTree(projet);
                ArrayNode userList = mapper.createArrayNode();
                if (groupString != null) {
                    for (JsonNode jsonNode : groupString) {
                        Long id = jsonNode.asLong();
                        User user = User.find.byId(id);
                        if (user != null) {
                            user.addToProjetListPro(projet);
                            user.update();
                            projet.addToProList(user);
                            userList.add(Json.toJson(user));
                        }
                    }
                }
                projet.update();
                groupeNode.set("proList", userList );
                return ok(groupeNode);
            } else {
                return badRequest("Erreur dans le nom");
            }
        } else {
            return badRequest("Erreur dans le nom");
        }
    }

    public Result updateProjectGroup() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id") != null ? json.get("id").asLong() : -1L;
        String theme = json.get("theme") != null ? json.get("theme").asText() : "";
        String dateString = json.get("date") != null ? json.get("date").asText() : "";
        String adresse = json.get("adresse") != null ? json.get("adresse").asText() : "";
        Long superficie = json.get("superficie") != null ? json.get("superficie").asLong() : -1;
        ArrayNode groupString = json.get("groupids").deepCopy();
        Date date = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMM, yyyy", Locale.FRENCH);
        try {
            date = parser.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Projet u = Projet.find.byId(id);

        if (u != null) {
            if (theme != null) {
                if (!theme.equals("")) {
                    u.setTheme(theme);
                    u.setAdresse(theme);
                    u.setSuperficie(superficie);
                    u.setDateCreation(date);
                    for (JsonNode jsonNode : groupString ) {
                        Long idGroupUser = jsonNode.asLong();
                        User user = User.find.byId(idGroupUser);
                        if (user != null) {
                            u.addToProList(user);
                            user.save();
                        }
                    }
                    u.save();
                    u.refresh();
                    ObjectMapper mapper = new ObjectMapper();
                    ObjectNode groupeNode = mapper.valueToTree(u);
                    ArrayNode usersNode = mapper.valueToTree(u.getProList());
                    groupeNode.set("userList", usersNode );
                    ArrayNode wrap = mapper.createArrayNode().add(groupeNode);
                    return ok(wrap);
                } else {
                    return badRequest("Erreur dans le nom");
                }
            } else {
                return badRequest("Erreur dans le nom");
            }
        }
        return badRequest("Déjà inscrit !");
    }


    public Result toggleStateSuivi() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong();
        Boolean state = json.get("state").asBoolean();
        Task task = Task.find.byId(id);
        if (task != null) {
            task.setEtatBoolean(state);
            task.update();
        }
        return ok();
    }

    public Boolean checkCfProjet()
    {
        Long user = Long.parseLong(session("userId"));
        int droit = User.find.query().select("droit").where().eq("id",user).findOne().getDroit();
        return droit == 1;
    }

    public Result getAllProjectPros() {
        User u = Application.getCurrentUserObj();
        ArrayNode jsonNodes = mapper.createArrayNode();
        if (u != null) {
            List<Projet> projetList = u.getProjetListUser();
            List<User> proList = new ArrayList<>();
            ObjectMapper mapper = new ObjectMapper();
            for (Projet p : projetList) {
                proList.addAll(p.getProList());
            }
            jsonNodes = mapper.valueToTree(proList);
        }
        return ok(jsonNodes);
    }

    public Result getAllProjectUsers() {
        User u = Application.getCurrentUserObj();
        ArrayNode jsonNodes = mapper.createArrayNode();
        if (u != null) {
            List<Projet> projetList = u.getProjetListPro();
            List<User> userList = new ArrayList<>();
            ObjectMapper mapper = new ObjectMapper();
            for (Projet p : projetList) {
                userList.add(p.getUser());
            }
            jsonNodes = mapper.valueToTree(userList);
        }
        return ok(jsonNodes);
    }


    public Result checkCfProjetJson() {
        if (checkCfProjet())
        {
            JsonNode jsonNode = Json.toJson(true);
            return ok(jsonNode);
        } else {
            return forbidden();
        }
    }

}
