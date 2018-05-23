package models;
import com.fasterxml.jackson.annotation.JsonBackReference;
import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.*;
import java.util.Date;


/**
 * Created by ttomc on 04/01/2017.
 */

@Entity
public class Anomalie extends Model {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    public Long id;
    public Date dateAnomalie;
    public String contenu;
    public Integer etat;
    @ManyToOne
    @JsonBackReference
    public Projet projet;

    public Anomalie() {
    }

    public Anomalie(Date dateAnomalie, String contenu, Integer etat, Projet projet) {
        this.dateAnomalie = dateAnomalie;
        this.contenu = contenu;
        this.etat = etat;
        this.projet = projet;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDateAnomalie() {
        return dateAnomalie;
    }

    public void setDateAnomalie(Date dateAnomalie) {
        this.dateAnomalie = dateAnomalie;
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

    public Projet getProjet() {
        return projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }

    public static Finder<Long, Anomalie> find = new Finder<Long, Anomalie>(Anomalie.class);

}
