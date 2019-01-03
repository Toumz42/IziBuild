package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import models.Projet;
import models.Referentiel;
import models.User;
import org.apache.commons.codec.digest.DigestUtils;
import play.libs.Json;
import play.mvc.*;

import java.util.List;

public class UserController extends Controller {
    ObjectMapper mapper = new ObjectMapper();

    public Result getAllPros() {
        List<User> userList = User.find.query().where().eq("droit",1).findList();
        if (userList != null) {
            JsonNode userNode = mapper.valueToTree(userList);
            return ok().sendJson(userNode);
        }
        return notFound();
    }

    public Result getAllProsByPage() {
        JsonNode json = request().body().asJson();
        Integer page = (json.get("page").asInt() - 1) * 10;
        List<User> userList = User.find.query()
                .where()
                .eq("droit",1)
                .setFirstRow(page)
                .setMaxRows(10)
                .findList();
        if (userList != null) {
            JsonNode userNode = mapper.valueToTree(userList);
            return ok().sendJson(userNode);
        }
        return notFound();
    }

    public Result getProsPages() {
        List<User> userList = User.find.query().where().eq("droit",1).findList();
        if (userList != null) {
            Integer size = (int) Math.ceil((double) userList.size() / 10d);
            JsonNode userNode = mapper.valueToTree(size);
            return ok().sendJson(userNode);
        }
        return notFound();
    }

    public Result getPartPages() {
        List<User> userList = User.find.query().where().eq("droit",2).findList();
        if (userList != null) {
            Integer size = (int) Math.ceil((double) userList.size() / 10d);
            JsonNode userNode = mapper.valueToTree(size);
            return ok().sendJson(userNode);
        }
        return notFound();
    }

    public Result getAllUserPages() {
        List<User> userList = User.find.query().where().not().eq("droit",0).findList();
        if (userList != null) {
            Integer size = (int) Math.ceil((double) userList.size() / 10d);
            JsonNode userNode = mapper.valueToTree(size);
            return ok().sendJson(userNode);
        }
        return notFound();
    }


    public Result addUser() {
        JsonNode json = request().body().asJson();
        String name = json.get("name")!= null ? json.get("name").asText() : "";
        String surname = json.get("surname")!= null ? json.get("surname").asText() : "";
        Integer droit = json.get("droit") != null ? json.get("droit").asInt() : null;
        String email = json.get("email")!= null ? json.get("email").asText() : "";
        String pass = json.get("password")!= null ? json.get("password").asText() : "";
        String adresse = json.get("adresse")!= null ? json.get("adresse").asText() : "";
        String ville = json.get("ville")!= null ? json.get("ville").asText() : "";
        String codePostal = json.get("codePostal")!= null ? json.get("codePostal").asText() : "";
        String portable = json.get("portable")!= null ? json.get("portable").asText() : "";
        String telephone = json.get("telephone")!= null ? json.get("telephone").asText() : "";
        String dateNaissance = json.get("dateNaissance")!= null ? json.get("dateNaissance").asText() : "";
        String siret = json.get("siret") != null ? json.get("siret").asText() : "";
        String societe = json.get("societe") != null ? json.get("societe").asText() : "";
        Long categorieId = json.get("categorie") != null ? json.get("categorie").asLong() : null;
        String sha1pass = DigestUtils.sha1Hex(pass);


        Referentiel categorie = null;
        if (categorieId != null) {
            categorie = Referentiel.find.byId(categorieId);
        }

        User u = User.find.query()
                .where()
                .ilike("email","%"+email+"%")
                .findOne();

        if (u == null) {
            if (email != null) {
                if (!email.equals("")) {
                    User person = new User(name, surname, email, sha1pass, adresse, ville, codePostal, portable, telephone, dateNaissance, siret, societe,droit);
                    if (categorie != null) {
                        person.setCategorie(categorie);
                    }
                    person.save();
                    person.makeUserDir();
                    person.save();
                    session("userId", person.getId().toString());
                    JsonNode retour = mapper.valueToTree(person);
                    return redirect("/home");
                } else {
                    return badRequest("Erreur dans le mail");
                }
            } else {
                return badRequest("Erreur dans le mail");
            }
        }
        return badRequest("Ce mail est déjà utilisé !");
    }

    public Result updateUser() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idUser") != null ? json.get("idUser").asLong() : null;
        String name = json.get("name") != null ? json.get("name").asText() : "";
        String surname = json.get("surname") != null ? json.get("surname").asText() : "";
        Integer droit = json.get("droit") != null ? json.get("droit").asInt() : null;
        String email = json.get("email") != null ? json.get("email").asText() : "";
        String adresse = json.get("adresse") != null ? json.get("adresse").asText() : "";
        String ville = json.get("ville") != null ? json.get("ville").asText() : "";
        String codePostal = json.get("codePostal") != null ? json.get("codePostal").asText() : "";
        String portable = json.get("portable") != null ? json.get("portable").asText() : "";
        String telephone = json.get("telephone") != null ? json.get("telephone").asText() : "";
        String dateNaissance = json.get("dateNaissance") != null ? json.get("dateNaissance").asText() : "";
        String siret = json.get("siret") != null ? json.get("siret").asText() : "";
        String societe = json.get("societe") != null ? json.get("societe").asText() : "";
        String pass = json.get("password") != null ? json.get("password").asText() : "";
        Long categorieId = json.get("categorie") != null ? json.get("categorie").asLong() : null;

        User u = User.find.byId(id);
        if (u != null) {
            if (!u.getPassword().contains(pass)) {
                String sha1pass = DigestUtils.sha1Hex(pass);
                u.setPassword(sha1pass);
            }
            if (!email.equals("")) {
                u.setName(name);
                u.setSurname(surname);
                u.setDroit(droit);
                u.setEmail(email);
                u.setAdresse(adresse);
                u.setVille(ville);
                u.setCodePostal(codePostal);
                u.setPortable(portable);
                u.setTelephone(telephone);
                u.setDateNaissance(dateNaissance);
                u.setSiret(siret);
                u.setSociete(societe);
                if (categorieId != null) {
                    Referentiel categorie = Referentiel.find.byId(categorieId);
                    u.setCategorie(categorie);
                }
                u.save();
                JsonNode retour = mapper.valueToTree(u);
                return ok().sendJson(retour);
            } else {
                return badRequest("Erreur dans le mail");
            }
        }
        return notFound();
    }


    public static Result deleteUser(Long id) {
        User u = User.find.byId(id);
        if (u != null) {
            u.delete();
            return ok(Json.toJson(true));
        }
        return badRequest("Erreur dans la suppression");
    }


    public Result getUserById() {
        User u = Application.getCurrentUserObj();
        if (u != null) {
            return ok(Json.toJson(u));
        }
        return badRequest("Erreur dans la recuperqtion");
    }

    public Result getAllUser() {
        List<User> userList = User.find.query()
                .where()
                .not().eq("droit", 0)
                .findList();
        User u = User.find.query().where().eq("login", "admin@ecole-isitech.fr").findOne();
        if (userList.contains(u)) {
            userList.remove(u);
        }
        if (userList.size() > 0) {
            ArrayNode listResult = mapper.valueToTree(userList);
            return ok().sendJson(listResult);
        }
        return notFound();
    }

    public Result getAllUserByPage() {
        JsonNode json = request().body().asJson();
        Integer page = (json.get("page").asInt() - 1) * 10;
        List<User> userList = User.find.query()
                .where()
                .not().eq("droit", 0)
                .setFirstRow(page)
                .setMaxRows(10)
                .findList();
        User u = User.find.query().where()
                .eq("login", "admin@ecole-isitech.fr")
                .findOne();

        if (userList.contains(u)) {
            userList.remove(u);
        }
        if (userList.size() > 0) {
            ArrayNode listResult = mapper.valueToTree(userList);
            return ok().sendJson(listResult);
        }
        return notFound();
    }

    public Result getAllParticulierByPage() {
        JsonNode json = request().body().asJson();
        Integer page = (json.get("page").asInt() - 1) * 10;
        List<User> userList = User.find.query().where()
                .eq("droit",2)
                .setFirstRow(page)
                .setMaxRows(10)
                .findList();
        ArrayNode listResult = mapper.valueToTree(userList);
        return ok().sendJson(listResult);
    }

    public Result getAllParticulier() {
        List<User> userList= null;
        userList = User.find.query().where().eq("droit",2).findList();
        ArrayNode listResult = mapper.valueToTree(userList);
        return ok().sendJson(listResult);
    }

    public static List<Projet> getProjetList(User u) {
        switch (u.getDroit()) {
            case 0 :
                return null;
            case 1 :
                return u.getProjetListPro();
            case 2 :
                return u.getProjetListUser();
            default:
                return null;
        }
    }


}
