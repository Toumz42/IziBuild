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
    private String theme;
    private Date dateCreation;

    @ManyToOne
    @JsonManagedReference
    private User user;

    @ManyToMany
    @JsonManagedReference
    private List<User> proList;

    @OneToMany(mappedBy="projet")
    @JsonManagedReference
    private List<Anomalie> anomalieList;

    @OneToMany(mappedBy="projet")
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

    public String getDateSoutenanceString() {
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

    public void addToProList(User user) { this.proList.add(user); }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Anomalie> getAnomalieList() {
        return anomalieList;
    }

    public void setAnomalieList(List<Anomalie> anomalieList) {
        this.anomalieList = anomalieList;
    }

    public List<CalendarEvent> getEventList() {
        return eventList;
    }

    public void setEventList(List<CalendarEvent> eventList) {
        this.eventList = eventList;
    }

    public static Finder<Long, Projet> find = new Finder<Long, Projet>(Projet.class);

}
