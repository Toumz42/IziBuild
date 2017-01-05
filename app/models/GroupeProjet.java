package models;
import com.avaje.ebean.Model;

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
    public String name;
    public String theme;
    public Date dateSoutenance;


}
