package models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.ebean.Finder;
import io.ebean.Model;
import javax.persistence.*;
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
    @OneToMany(mappedBy="classe")
    @JsonManagedReference
    private List<CalendarEvent> calendarEventList;
    @OneToMany(mappedBy="classe")
    @JsonManagedReference
    private List<User> userList;

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

    public static Finder<Long, Classe> find = new Finder<Long,Classe>(Classe.class);
}
