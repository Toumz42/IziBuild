package models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


/**
 * Created by ttomc on 04/01/2017.
 */

@Entity
public class Classe extends Model {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private String name;
    @OneToMany(mappedBy="classe",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CalendarEvent> calendarEventList;
    @OneToMany(mappedBy="classe")
    @JsonManagedReference
    private List<User> userList;
    @ManyToMany
    @JoinTable(name="classe_matiere",
            joinColumns=@JoinColumn(name="classe_id", referencedColumnName="id"),
            inverseJoinColumns=@JoinColumn(name="matiere_id", referencedColumnName="id"))
    @JsonManagedReference
    private List<Matiere> matiereList = new ArrayList<>();

    @PreRemove
    private void preRemove() {
        for (CalendarEvent c : this.calendarEventList) {
            c.setClasse(null);
            c.save();
        }
        for (User u : this.userList) {
            u.setClasse(null);
            u.save();
        }
    }

    public Classe() {
    }

    public Classe(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CalendarEvent> getCalendarEventList() {
        return calendarEventList;
    }

    public void setCalendarEventList(List<CalendarEvent> calendarEventList) {
        this.calendarEventList = calendarEventList;
    }

    public List<User> getUserList() {
        return userList;
    }

    public void setUserList(List<User> userList) {
        this.userList = userList;
    }

    public List<Matiere> getMatiereList() {
        return matiereList;
    }

    public void setMatiereList(List<Matiere> matiereList) {
        this.matiereList = matiereList;
    }

    public void addMatiereList(Matiere matiere) {
        if (!this.matiereList.contains(matiere)) {
            this.matiereList.add(matiere);
        }
    }

    public static Finder<Long, Classe> getFind() {
        return find;
    }

    public static void setFind(Finder<Long, Classe> find) {
        Classe.find = find;
    }

    public static Finder<Long, Classe> find = new Finder<Long,Classe>(Classe.class);
}
