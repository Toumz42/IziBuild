package models;

import com.avaje.ebean.Model;
import javax.persistence.*;


/**
 * Created by ttomc on 04/01/2017.
 */

@Entity
public class Classe extends Model {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    public Long id;
    public String name;


}
