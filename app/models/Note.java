package models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.*;

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

    private Integer note;

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

    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public static Finder<Long, Note> find = new Finder<Long,Note>(Note.class);
}
