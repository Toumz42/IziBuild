package models;
import io.ebean.Finder;
import io.ebean.Model;
import scala.reflect.internal.Trees;

import javax.persistence.*;
import java.util.Date;


/**
 * Created by ttomc on 04/01/2017.
 */

@Entity
public class SuiviProjet extends Model {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    public Long id;
    public Date dateSuivi;
    public String contenu;
    public Integer etat;
    @ManyToOne
    public GroupeProjet groupe;

    public SuiviProjet() {
    }

    public SuiviProjet(Date dateSuivi, String contenu, Integer etat, GroupeProjet groupe) {
        this.dateSuivi = dateSuivi;
        this.contenu = contenu;
        this.etat = etat;
        this.groupe = groupe;
    }

    public static Finder<Long, SuiviProjet> find = new Finder<Long,SuiviProjet>(SuiviProjet.class);

}
