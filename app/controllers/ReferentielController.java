package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.Anomalie;
import models.Referentiel;
import models.utils.TypesReferentiel;
import play.api.libs.json.Json;
import play.mvc.Controller;
import play.mvc.Result;
import java.util.ArrayList;
import java.util.List;

public class ReferentielController extends Controller {
    ObjectMapper mapper = new ObjectMapper();

    public Result getReferentiel(){
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong();
        Referentiel r = Referentiel.find.byId(id);
        JsonNode result = mapper.valueToTree(r);
        return ok().sendJson(result);
    }

    public Result getAllByTypeId(){
        JsonNode json = request().body().asJson();
        Integer type = json.get("id").asInt();
        List<Referentiel> list = Referentiel.find.query().where().eq("type", type).findList();
        JsonNode result = mapper.valueToTree(list);
        return ok().sendJson(result);
    }

    public Result getAllTypes(){
        TypesReferentiel tp = new TypesReferentiel();
        JsonNode result = mapper.valueToTree(tp.getAllTypes());
        return ok().sendJson(result);
    }

    public Result addNewRef() {
        JsonNode json = request().body().asJson();
        Integer type = json.get("typeId").asInt();
        if (type != -1) {
            Referentiel r = new Referentiel(type);
            r.save();
            JsonNode result = mapper.valueToTree(r);
            return ok().sendJson(result);
        }
        return badRequest();
    }

    public Result saveByChamps() {
        JsonNode json = request().body().asJson();
        Long id = json.get("id").asLong(0L);
        String code = null;
        String libelle = null;
        String commentaire = null;
        if (json.get("code") != null) {
            code = json.get("code").asText("");
        }
        if (json.get("libelle") != null) {
            libelle = json.get("libelle").asText("");
        }
        if (json.get("libelle") != null) {
            commentaire = json.get("commentaireLong").asText("");
        }
        try {
            Referentiel r = Referentiel.find.byId(id);
            if (r != null) {
                if (code != null) { r.setCode(code); }
                if (libelle != null) { r.setLibelle(libelle); }
                if (commentaire != null) { r.setCommentaire(commentaire); }
                r.save();
            }
            JsonNode result = mapper.valueToTree(r);
            return ok().sendJson(result);
        } catch ( Exception e ) {
            e.printStackTrace();
        }
        return internalServerError();
    }
    public Result getAllCategorieMetier() {
            JsonNode json = request().body().asJson();
            Integer type = json.get("id").asInt();
            List<Referentiel> list = Referentiel.find.query().where()
                    .eq("type", type).findList();
            JsonNode result = mapper.valueToTree(list);
            return ok().sendJson(result);
        }

}
