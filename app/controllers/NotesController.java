package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import models.*;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;

/**
 * Created by ttomc on 28/03/2017.
 */
public class NotesController extends Controller {


    public Result addNote() {
        JsonNode json = request().body().asJson();
        Integer note = json.get("note").asInt();
        Long user = json.get("user").asLong();
        Long matiereId = json.get("matiere").asLong();
        User eleve = User.find.byId(user);
        Matiere matiere = Matiere.find.byId(matiereId);

        if (note != null && user != null && matiere != null) {
            Note newNote = new Note(note, eleve, matiere);
            newNote.save();
            JsonNode retour = Json.toJson(eleve);
            return ok().sendJson(retour);
        }
        return badRequest();

    }

    public Result addMatiere() {
        JsonNode json = request().body().asJson();
        String matiere = json.get("matiere").asText();
        Double coef = json.get("coef").asDouble();
        Long classeId = json.get("classe").asLong();
        Classe classe = Classe.find.byId(classeId);

        if (matiere != null && coef != null && classe != null) {
            Matiere newMatiere = new Matiere(matiere, coef);
            classe.addMatiereList(newMatiere);
            newMatiere.save();
            classe.save();
            JsonNode retour = Json.toJson(newMatiere);
            return ok().sendJson(retour);
        }
        return badRequest();

    }

    public Result updateNote() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idNote").asLong();
        Integer note = json.get("note").asInt();
        Long user = json.get("user").asLong();
        Long matiereId = json.get("matiere").asLong();
        User eleve = User.find.byId(user);
        Matiere matiere = Matiere.find.byId(matiereId);

        if (note != null && user != null && matiere != null) {

            Note newNote = Note.find.byId(id);
            if (newNote != null) {
                newNote.setNote(note);
                newNote.save();
                JsonNode retour = Json.toJson(newNote);
                return ok().sendJson(retour);
            }
        }
        return badRequest();

    }

    public Result updateMatiere() {
        JsonNode json = request().body().asJson();
        Long id = json.get("idMatiere").asLong();
        String matiere = json.get("matiere").asText();
        Double coef = json.get("coef").asDouble();
        Long classeId = json.get("classe").asLong();
        Classe classe = Classe.find.byId(classeId);

        if (matiere != null && coef != null && classe != null) {
            Matiere newMatiere = Matiere.find.byId(id);
            if (newMatiere != null) {
                newMatiere.setMatiere(matiere);
                newMatiere.setCoef(coef);
                newMatiere.save();
                classe.addMatiereList(newMatiere);
                classe.save();
                JsonNode retour = Json.toJson(newMatiere);
                return ok().sendJson(retour);
            }

        }
        return badRequest();
    }

    public Result getMatiere() {
        JsonNode json = request().body().asJson();
        JsonNode classeNode = json.get("classeId");
        JsonNode userNode = json.get("userId");
        Long classeId = null;
        Long userId = null;
        if (classeNode != null) {
            classeId = classeNode.asLong();
        }
        if (userNode != null) {
            userId = userNode.asLong();
        }
        User u = Application.getCurrentUserObj();
        if (u != null) {
            ObjectMapper mapper = new ObjectMapper();
            List<Matiere> matiereList = null;
            if (userId != null || classeId != null) {
                    Classe classe = null;
                    if (userId != null) {
                        User user = User.find.byId(userId);
                        if (user != null) {
                            classe = user.getClasse();
                        }
                    } else {
                        classe = Classe.find.byId(classeId);
                    }
                    if (classe != null) {
                        matiereList = classe.getMatiereList();
                    }

            } else {
                matiereList = Matiere.find.all();
            }
            if (matiereList != null) {
                ArrayNode listResult = mapper.valueToTree(matiereList);
                return ok().sendJson(listResult);
            }
        }
        return ok().sendJson(Json.toJson(false));
    }

    public Result getMyNotes() {
        User u = Application.getCurrentUserObj();
        if (u != null) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode result = mapper.valueToTree(u);
            return ok().sendJson(result);

        }
        return ok().sendJson(Json.toJson(false));
    }
}
