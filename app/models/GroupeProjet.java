package models;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.ebean.Finder;
import io.ebean.Model;
import models.utils.DateUtils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by ttomc on 04/01/2017.
 */
@Entity
public class GroupeProjet extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String theme;
    private Date dateSoutenance;
    @OneToMany(mappedBy="groupe")
    @JsonManagedReference
    private List<User> userList;
    @OneToMany(mappedBy="groupe")
    @JsonManagedReference
    private List<SuiviProjet> suiviList;

    public GroupeProjet() {
    }

    public GroupeProjet(String theme, Date dateSoutenance) {
        this.theme = theme;
        this.dateSoutenance = dateSoutenance;
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

    public Date getDateSoutenance() {
        return dateSoutenance;
    }

    public String getDateSoutenanceString() {
        DateUtils dU = new DateUtils();
        return dU.toFrenchDateString(dateSoutenance);
    }

    public void setDateSoutenance(Date dateSoutenance) {
        this.dateSoutenance = dateSoutenance;
    }

    public List<User> getUserList() {
        return userList;
    }

    public void setUserList(List<User> userList) {
        this.userList = userList;
    }

    public List<SuiviProjet> getSuiviList() {
        return suiviList;
    }

    public void setSuiviList(List<SuiviProjet> suiviList) {
        this.suiviList = suiviList;
    }

    public static Finder<Long, GroupeProjet> find = new Finder<Long,GroupeProjet>(GroupeProjet.class);

}
