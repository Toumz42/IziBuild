package models;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.ebean.Finder;
import io.ebean.Model;
import models.utils.DateUtils;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by ttomc on 04/01/2017.
 */
@Entity
public class Projet extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    @OneToOne
    private Referentiel type;
    private String theme;
    private Date dateCreation;

    private String adresse;
    private Long superficie;

    @ManyToOne
    @JsonManagedReference
    private User user;

    @ManyToMany
    @JsonManagedReference
    private List<User> proList;

    @OneToMany(mappedBy="projet", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Task> taskList;

    @OneToMany(mappedBy="projet", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CalendarEvent> eventList;

    public Projet() {
    }

    public Projet(String theme, Date dateCreation) {
        this.theme = theme;
        this.dateCreation = dateCreation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public String getDateString() {
        DateUtils dU = new DateUtils();
        return dU.toFrenchDateString(dateCreation);
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public List<User> getProList() {
        return proList;
    }

    public void setProList(List<User> userList) {
        this.proList = userList;
    }

    public void addToProList(User user) {
        if (!this.proList.contains(user)) {
            this.proList.add(user);
        }
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Task> getTaskList() {
        return taskList;
    }

    public void setTaskList(List<Task> taskList) {
        this.taskList = taskList;
    }

    public List<CalendarEvent> getEventList() {
        return eventList;
    }

    public void setEventList(List<CalendarEvent> eventList) {
        this.eventList = eventList;
    }

    public Referentiel getType() {
        return type;
    }

    public void setType(Referentiel type) {
        this.type = type;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Long getSuperficie() {
        return superficie;
    }

    public void setSuperficie(Long superficie) {
        this.superficie = superficie;
    }

    public static Finder<Long, Projet> find = new Finder<Long, Projet>(Projet.class);

}
