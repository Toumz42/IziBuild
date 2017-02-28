package models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.ebean.Finder;
import io.ebean.LikeType;
import io.ebean.Model;
import io.ebean.annotation.Formula;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Created by ttomc on 21/02/2017.
 */


@Entity
public class CalendarEvent extends Model {

    @Transient
    private ArrayList<String> colorList = new ArrayList<String>(
            Arrays.asList( "#D32F2F", "#C2185B", "#7B1FA2", "#512DA8", "#303F9F", "#1976D2", "#0288D1",
            "#0097A7", "#00796B", "#388E3C", "#689F38", "#AFB42B", "#FBC02D", "#FFA000", "#F57C00", "#E64A19",
            "#5D4037", "#616161", "#455A64" ));
    public static String lastColor;
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String title;
    private Date start;
    private Date end;
    @OneToOne
    private User prof;
    private String color;
    @ManyToOne
    @JsonBackReference
    private Classe classe;

    public CalendarEvent() {
    }

    public CalendarEvent(String title) {
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getStart() {

        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getEnd() {
        return end;
    }

    public void setEnd(Date end) {
        this.end = end;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public User getProf() {
        return prof;
    }

    public void setProf(User prof) {
        this.prof = prof;
    }

    public Classe getClasse() {
        return classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public String toCalendarString(Date date) {
        String res = "";


        return res;
    }
    public String generateColor() {
        int randomNum = ThreadLocalRandom.current().nextInt(0, (colorList.size()) + 1);
        String res = this.colorList.get(randomNum);
        lastColor = res;
        return res;
    }
    public static Finder<Long, CalendarEvent> find = new Finder<Long,CalendarEvent>(CalendarEvent.class);

}
