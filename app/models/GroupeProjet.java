package models;
import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by ttomc on 04/01/2017.
 */
@Entity
public class GroupeProjet extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    public Long id;
    public String theme;
    public Date dateSoutenance;

    public GroupeProjet() {
    }

    public GroupeProjet(String theme, Date dateSoutenance) {
        this.theme = theme;
        this.dateSoutenance = dateSoutenance;
    }

    public static Finder<Long, GroupeProjet> find = new Finder<Long,GroupeProjet>(GroupeProjet.class);

}
