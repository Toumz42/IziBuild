package models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.ebean.Model;
import io.ebean.Finder;
import org.apache.commons.codec.digest.DigestUtils;

import javax.persistence.*;
import java.util.List;

@Entity
//@Table(name="user")
public class User extends Model {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String login;
    private String password;
    private Integer droit;
    @ManyToOne
    @JsonBackReference
    private Classe classe;
    @ManyToOne
    @JsonBackReference
    private GroupeProjet groupe;
    @OneToMany(mappedBy="user")
    @JsonManagedReference
    private List<Note> noteList;

    //TODO : date Entrée/Sortie

    public User(String name, String surname, String email,
                String password, Integer droit,Classe classe) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.login = email;
        this.droit = droit;
        this.password = password;
        this.classe = classe;
    }

    public User() {
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

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getDroit() {
        return droit;
    }

    public void setDroit(Integer droit) {
        this.droit = droit;
    }

    public Classe getClasse() {
        return classe;
    }

    public Long getClasseId() {
        if (this.classe != null) {
            return classe.getId();
        }
        return null;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public GroupeProjet getGroupe() {
        return groupe;
    }

    public void setGroupe(GroupeProjet groupe) {
        this.groupe = groupe;
    }

    public List<Note> getNoteList() {
        return noteList;
    }

    public void setNoteList(List<Note> noteList) {
        this.noteList = noteList;
    }

    public static void makeAdmin() {
        User u = User.find.query().where().eq("login", "admin@ecole-isitech.fr").findOne();
        if (u == null) {
            String pass = "1Sit3CH!";
            pass = DigestUtils.sha1Hex(pass);
            User adm = new User("Admin","Admin","admin@ecole-isitech.fr",pass,0,null);
            adm.save();
        }
    }

    public static Finder<Long, User> find = new Finder<Long, User>(User.class);

}
