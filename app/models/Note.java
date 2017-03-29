package models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.ebean.Model;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by ghanem01 on 28/02/2017.
 */
@Entity
public class Note extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private User user;
    @ManyToOne
    @JsonBackReference
    private Matiere matiere;

    private int note;

    public Note() {
    }

    public Note(int note, User user, Matiere matiere ) {
        this.note = note;
        this.user = user;
        this.matiere = matiere;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Matiere getMatiere() {
        return matiere;
    }

    public void setMatiere(Matiere matiere) {
        this.matiere = matiere;
    }

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }
}
