package models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.ebean.Model;

import javax.persistence.*;
import java.util.List;

/**
 * Created by ghanem01 on 28/02/2017.
 */
@Entity
public class Matiere extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String matiere;
    private Float  coef;


    public Matiere() {
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

    public Float getCoef() {
        return coef;
    }

    public void setCoef(Float coef) {
        this.coef = coef;
    }
}