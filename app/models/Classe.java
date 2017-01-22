package models;

import io.ebean.Finder;
import io.ebean.Model;
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

    public Classe() {
    }

    public Classe(String name) {
        this.name = name;
    }

    public static Finder<Long, Classe> find = new Finder<Long,Classe>(Classe.class);
}
