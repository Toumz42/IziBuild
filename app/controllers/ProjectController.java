package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.Projet;
import models.Anomalie;
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
                    userNode.remove("date");
                    String date = grp.getDateSoutenanceString();
                    userNode.put("date", date );
                    userNode.putArray("userList").addAll(array);
                    listResult.add(userNode);

                    return ok().sendJson(listResult);
                }
            }
        }
        return notFound();

    }

    public static Result deleteGroupe(Long id) {
        Projet grp = Projet.find.byId(id);
        if (grp != null) {
            if (grp.getProList()!=null) {
                List<User> users =  grp.getProList();
                for (User u : users) {
                    u.setProjetListPro(null);
                    u.update();
                }
            }
            grp.delete();
            return ok(Json.toJson(true));
        }
        return badRequest("Erreur dans la suppression");
    }

    public static Result deleteAnomalies(Long id) {
        Anomalie anomalie = Anomalie.find.byId(id);
        if (anomalie != null) {
            anomalie.delete();
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
            for (Projet g : projetList) {
                List<User> userList = User.find.query().fetch("projet").where().eq("projet.id",g.getId()).findList();
                ArrayNode array = mapper.valueToTree(userList);
                ObjectNode userNode = mapper.valueToTree(g);
                userNode.remove("dateCreation");
                userNode.put("date", g.getDateSoutenanceString());
                userNode.put("theme", g.getTheme() );
                userNode.putArray("users").addAll(array);
                listResult.add(userNode);
            }
//                JsonNode retour = Json.toJson(projetList);
            return ok().sendJson(listResult);
        }
        return notFound();

    }

    public Result getProjects() {
        JsonNode json = request().body().asJson();
        String idUser = Application.getCurrentUser();
        if (idUser != null && !idUser.equals("")) {
            Long id = Long.parseLong(idUser);
            User u = User.find.byId(id);
            if (u != null) {
                List<Projet> list = u.getProjetListUser();
                JsonNode result = Json.toJson(list);
                if (result.isArray() && result.size() == list.size()) {
                    ArrayNode arrayNode = result.deepCopy();
                    for ( int i = arrayNode.size() - 1; i >= 0; i--) {
                        JsonNode j = arrayNode.get(i);
                        ObjectNode o = j.deepCopy();
                        o.remove("dateCreation");
                        DateUtils dU = new DateUtils();
                        String dateSuivi = dU.toFrenchDateString(list.get(i).getDateCreation());
                        o.put("date", dateSuivi );
                        arrayNode.remove(i);
                        j=o.deepCopy();
                        arrayNode.add(j);
                    }
                    result = arrayNode.deepCopy();
                }
                return ok(result);
            }
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

    public Result addProject() {
        JsonNode json = request().body().asJson();
        String theme = json.get("theme").asText();
        String dateString = json.get("date").asText();
        ArrayNode groupString = json.get("groupids").deepCopy();
        dateString = dateString.replace(",","");
        Date date = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMMM yyyy", Locale.FRENCH);
        try {
            date = parser.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        User u = Application.getCurrentUserObj();
        Projet p = Projet.find.query()
                .where()
                .ilike("theme","%"+theme+"%")
                .findOne();

        if (p == null) {
            if (theme != null) {
                if (!theme.equals("")) {
                    Projet projet = new Projet(theme, date);
                    u.addToProjetListUser(projet);
                    u.save();
                    projet.setUser(u);
                    projet.save();
                    ObjectMapper mapper = new ObjectMapper();
                    ObjectNode groupeNode = mapper.valueToTree(projet);
                    groupeNode.remove("dateCreation");
                    groupeNode.put("date", projet.getDateSoutenanceString());
                    ArrayNode userList = mapper.createArrayNode();
                    for (JsonNode jsonNode : groupString ) {
                        Long id = jsonNode.asLong();
                        User user = User.find.byId(id);
                        if (user != null) {
                            user.addToProjetListPro(projet);
                            user.update();
                            projet.addToProList(user);
                            userList.add(Json.toJson(user));
                        }
                    }
                    projet.update();
                    groupeNode.set("userList", userList );
                    return ok(groupeNode);
                } else {
                    return badRequest("Erreur dans le nom");
                }
            } else {
                return badRequest("Erreur dans le nom");
            }
        }
        return badRequest("Déjà inscrit !");
    }

    public Result updateProjectGroup() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idGroup").asLong();
        String theme = json.get("theme").asText();
        String dateString = json.get("date").asText();
        ArrayNode groupString = json.get("groupids").deepCopy();
        dateString = dateString.replace(",","");
        Date date = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMMM yyyy", Locale.FRENCH);
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
                    u.setDateCreation(date);
                    List<User> userList = new ArrayList<>();
                    for (JsonNode jsonNode : groupString ) {
                        Long idGroupUser = jsonNode.asLong();
                        User user = User.find.byId(idGroupUser);
                        if (user != null) {
                            user.save();
                        }
                    }
                    u.save();
                    u.refresh();
                    ObjectMapper mapper = new ObjectMapper();
                    ObjectNode groupeNode = mapper.valueToTree(u);
                    groupeNode.remove("dateCreation");
                    groupeNode.put("date", u.getDateSoutenanceString());
                    ArrayNode usersNode = mapper.valueToTree(u.getProList());
                    groupeNode.set("userList", usersNode );
                    return ok(groupeNode);
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
        Anomalie anomalie = Anomalie.find.byId(id);
        if (anomalie != null) {
            anomalie.setEtatBoolean(state);
            anomalie.update();
        }
        return ok();
    }

    public Boolean checkCfProjet()
    {
        Long user = Long.parseLong(session("userId"));
        int droit = User.find.query().select("droit").where().eq("id",user).findOne().getDroit();
        return droit == 1;
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
