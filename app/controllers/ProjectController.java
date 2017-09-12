package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.GroupeProjet;
import models.SuiviProjet;
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


    public Result getGroupeProject() {
        User u = Application.getCurrentUserObj();
        if (u != null ) {

            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();
            if (u != null) {
                GroupeProjet grp = GroupeProjet.find.query().where()
                        .eq("id",u.getGroupe().getId())
                        .findUnique();
                List<User> userList = null;
                userList = grp.getUserList();
//                List<User> userList = User.find.query().fetch("groupe").where().eq("groupe.id",grp.getId()).findList();
                if (userList !=null) {
                    ArrayNode array = mapper.valueToTree(userList);
                    ObjectNode userNode = mapper.valueToTree(grp);
                    userNode.remove("dateSoutenance");
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
        GroupeProjet grp = GroupeProjet.find.byId(id);
        if (grp != null) {
            if (grp.getUserList()!=null) {
                List<User> users =  grp.getUserList();
                for (User u : users) {
                    u.setGroupe(null);
                    u.update();
                }
            }
            grp.delete();
            return ok(Json.toJson(true));
        }
        return badRequest("Erreur dans la suppression");
    }

    public static Result deleteSuivi(Long id) {
        SuiviProjet suivi = SuiviProjet.find.byId(id);
        if (suivi != null) {
            suivi.delete();
            return ok(Json.toJson(true));
        }
        return badRequest("Erreur dans la suppression");
    }

    public Result getAllGroupeProject() {
        JsonNode json = request().body().asJson();
        Long classeId = null;
        if (json != null) {
            if (json.get("classeId") != null) {
                classeId = json.get("classeId").asLong();
            }
        }
        String idUser = Application.getCurrentUser();
        User u = null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id",id).findUnique();

        }
        if (u != null) {

            List<GroupeProjet> projetList= new ArrayList<>();
            if (classeId != null) {
                List<User> userList = User.find.query().fetch("groupe").fetch("classe").where().eq("classe.id",classeId).findList();
                for (User user : userList) {
                    if (user.getGroupe() != null) {
                        if (!projetList.contains(user.getGroupe())) {
                            projetList.add(user.getGroupe());
                        }
                    }
                }
            } else {
                projetList = GroupeProjet.find.all();
            }

            ObjectMapper mapper = new ObjectMapper();
            ArrayNode listResult = mapper.createArrayNode();
            for (GroupeProjet g : projetList) {
                List<User> userList = User.find.query().fetch("groupe").where().eq("groupe.id",g.getId()).findList();
                ArrayNode array = mapper.valueToTree(userList);
                ObjectNode userNode = mapper.valueToTree(g);
                userNode.remove("dateSoutenance");
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
        Long grpId = null;
        if (json != null) {
            if (json.get("id") != null) {
                grpId = json.get("id").asLong();
            }
        }
        String idUser = Application.getCurrentUser();
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            User u = User.find.query().where().eq("id",id).findUnique();

            if (u != null) {

                List<SuiviProjet> list = null;
                if (grpId != null) {
                    list = SuiviProjet.find.query().fetch("groupe").fetch("groupe", "id").where()
                            .eq("groupe.id", grpId)
                            .findList();
                } else {
                    list = SuiviProjet.find.query().fetch("groupe").fetch("groupe", "id").where()
                            .eq("groupe.id", u.getGroupe().getId())
                            .findList();
                }

                JsonNode result = Json.toJson(list);
                if (result.isArray() && result.size() == list.size()) {
                    ArrayNode arrayNode = result.deepCopy();
                    for ( int i = arrayNode.size() - 1; i >= 0; i--) {
                        JsonNode j = arrayNode.get(i);
                        ObjectNode o = j.deepCopy();
                        o.remove("dateSuivi");
                        DateUtils dU = new DateUtils();
                        String dateSuivi = dU.toFrenchDateString(list.get(i).dateSuivi);
                        o.put("dateSuivi", dateSuivi );
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

    public Result addProjectGroup() {
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
        GroupeProjet u = GroupeProjet.find.query()
                .where()
                .ilike("theme","%"+theme+"%")
                .findUnique();

        if (u == null) {
            if (theme != null) {
                if (!theme.equals("")) {
                    GroupeProjet groupeProjet = new GroupeProjet(theme, date);
                    groupeProjet.save();
                    ObjectMapper mapper = new ObjectMapper();
                    ObjectNode groupeNode = mapper.valueToTree(groupeProjet);
                    groupeNode.remove("dateSoutenance");
                    groupeNode.put("date", groupeProjet.getDateSoutenanceString());
                    ArrayNode userList = mapper.createArrayNode();
                    for (JsonNode jsonNode : groupString ) {
                        Long id = jsonNode.asLong();
                        User user = User.find.byId(id);
                        if (user != null) {
                            user.setGroupe(groupeProjet);
                            user.update();
                            userList.add(Json.toJson(user));
                        }
                    }
                    groupeProjet.update();
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
        GroupeProjet u = GroupeProjet.find.byId(id);

        if (u != null) {
            if (theme != null) {
                if (!theme.equals("")) {
                    u.setTheme(theme);
                    u.setDateSoutenance(date);
                    List<User> userList = new ArrayList<>();
                    for (JsonNode jsonNode : groupString ) {
                        Long idGroupUser = jsonNode.asLong();
                        User user = User.find.byId(idGroupUser);
                        if (user != null) {
                            user.setGroupe(u);
                            user.save();
                        }
                    }
                    u.save();
                    u.refresh();
                    ObjectMapper mapper = new ObjectMapper();
                    ObjectNode groupeNode = mapper.valueToTree(u);
                    groupeNode.remove("dateSoutenance");
                    groupeNode.put("date", u.getDateSoutenanceString());
                    ArrayNode usersNode = mapper.valueToTree(u.getUserList());
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
        SuiviProjet suiviProjet = SuiviProjet.find.byId(id);
        if (suiviProjet != null) {
          suiviProjet.setEtatBoolean(state);
          suiviProjet.update();
        }
        return ok();
    }

    public Result addProject() {
        JsonNode json = request().body().asJson();
        String dateString = json.get("date").asText();
        String contenu = json.get("contenu").asText();
        dateString = dateString.replace(",","");
        Date date = null;
        SimpleDateFormat parser = new SimpleDateFormat("dd MMMM yyyy", Locale.ENGLISH);
        try {
            date = parser.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        String idUser = Application.getCurrentUser();
        User u = null;
        GroupeProjet grp = null;
        Integer idGroupe=null;
        if (idUser != null && !idUser.equals("")) {
            Integer id = Integer.parseInt(idUser);
            u = User.find.query().where().eq("id", id).findUnique();
            if (u != null) {
                grp = u.getGroupe();
            }
        }
        SuiviProjet s = SuiviProjet.find.query()
                .where()
                .ilike("date_suivi","%"+date+"%")
                .findUnique();

        if (s == null) {
            if (contenu != null) {
                if (!contenu.equals("")) {
                    SuiviProjet suivi = new SuiviProjet(date,contenu,0,grp);
                    suivi.save();
                    ObjectNode result = Json.toJson(suivi).deepCopy();
                    result.remove("dateSoutenance");
                    DateUtils dU = new DateUtils();
                    String dateSuivi = dU.toFrenchDateString(suivi.dateSuivi);
                    result.put("dateSuivi", dateSuivi );
                    return ok(result);

                } else {
                    return ok("Erreur dans le nom");
                }
            } else {
                return ok("Erreur dans le nom");
            }
        }
        return ok("Déjà inscrit !");
    }

    public Boolean checkCfProjet()
    {
        Long user = Long.parseLong(session("userId"));
        int droit = User.find.query().select("droit").where().eq("id",user).findUnique().getDroit();
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
