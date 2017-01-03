package models;

import com.avaje.ebean.Model;

import javax.persistence.*;

@Entity
public class User extends Model {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	public Long id;
    public String name;
    public String surname;
    public String email;
    public String password;

    public User(String name, String surname, String email, String password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }

    public User() {
    }
    public static Finder<Long, User> find = new Finder<Long,User>(User.class);

}
