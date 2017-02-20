package models;
import io.ebean.Finder;
import io.ebean.Model;
import scala.reflect.internal.Trees;

import javax.persistence.*;
import java.util.Date;


/**
 * Created by ttomc on 04/01/2017.
 */

@Entity
public class SuiviProjet extends Model {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    public Long id;
    public Date dateSuivi;
    public String contenu;
    public Integer etat;
    @ManyToOne
    public GroupeProjet groupe;

    public SuiviProjet() {
    }

    public SuiviProjet(Date dateSuivi, String contenu, Integer etat, GroupeProjet groupe) {
        this.dateSuivi = dateSuivi;
        this.contenu = contenu;
        this.etat = etat;
        this.groupe = groupe;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDateSuivi() {
        return dateSuivi;
    }

    public void setDateSuivi(Date dateSuivi) {
        this.dateSuivi = dateSuivi;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public Integer getEtat() {
        return etat;
    }

    public void setEtat(Integer etat) {
        this.etat = etat;
    }

    public Boolean getEtatBoolean() {
        return etat == 1 ;
    }

    public void setEtatBoolean(Boolean etat) {
        this.etat = etat ? 1 : 0;
    }

    public GroupeProjet getGroupe() {
        return groupe;
    }

    public void setGroupe(GroupeProjet groupe) {
        this.groupe = groupe;
    }

    public static Finder<Long, SuiviProjet> find = new Finder<Long,SuiviProjet>(SuiviProjet.class);

}
