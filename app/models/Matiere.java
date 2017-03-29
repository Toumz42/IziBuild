package models;

import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by ghanem01 on 28/02/2017.
 */
@Entity
public class Matiere extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String matiere;
    private Double  coef;




    public Matiere() {
    }


    public Matiere(String matiere, Double coef) {
        this.matiere = matiere;
        this.coef = coef;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatiere() {
        return matiere;
    }

    public void setMatiere(String matiere) {
        this.matiere = matiere;
    }

    public Double getCoef() {
        return coef;
    }

    public void setCoef(Double coef) {
        this.coef = coef;
    }

    public static Finder<Long, Matiere> find = new Finder<Long,Matiere>(Matiere.class);
}