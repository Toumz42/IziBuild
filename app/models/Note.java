package models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * Created by ghanem01 on 28/02/2017.
 */
@Entity
public class Note extends Model {
    @ManyToOne
    @JsonBackReference
    private User user;
    @ManyToOne
    @JsonBackReference
    private Matiere matiere;
    private int note;


}
