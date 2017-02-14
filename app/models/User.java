package models;

import io.ebean.Model;
import io.ebean.Finder;

import javax.persistence.*;

@Entity
//@Table(name="user")
public class User extends Model {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	public Long id;
    public String name;
    public String surname;
    public String email;
    public String login = surname+"."+name;
    public String password;
    public Integer droit;
    @OneToOne
    public Classe classe;
    @OneToOne
    public GroupeProjet groupe;

    public User(String name, String surname, String email, String password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
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

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public GroupeProjet getGroupe() {
        return groupe;
    }

    public void setGroupe(GroupeProjet groupe) {
        this.groupe = groupe;
    }

    public static Finder<Long, User> find = new Finder<Long,User>(User.class);

}
