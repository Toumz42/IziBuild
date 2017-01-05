package models;
import com.avaje.ebean.Model;
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

}
