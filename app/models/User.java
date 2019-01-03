package models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.ebean.Model;
import io.ebean.Finder;
import mailer.MailerService;
import models.utils.FileUtils;
import org.apache.commons.codec.digest.DigestUtils;
import play.libs.mailer.MailerClient;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
//@Table(name="user")
public class User extends Model {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String login;
    private String password;
    private String folder;

    private String adresse;
    private String ville;
    private String codePostal;
    private String portable;
    private String telephone;
    private String dateNaissance;
    private String siret;
    private String societe;

    private Integer droit;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonBackReference
    private MailToken token;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    @JsonBackReference
    private List<Projet> projetListUser;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    @JsonBackReference
    private List<CalendarEvent> eventListUser;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "proList")
    @JsonBackReference
    private List<Projet> projetListPro;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "proList")
    @JsonBackReference
    private List<CalendarEvent> eventListPro;

    @ManyToOne(fetch = FetchType.EAGER)
    Referentiel categorie;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "expediteur")
    @JsonBackReference
    List<Message> messagesEnvoyes;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "destinataire")
    @JsonBackReference
    List<Message> messagesRecus;

    //TODO : date Entrée/Sortie

    public User(String name, String surname, String email,
                String password, Integer droit) {
        String sha1pass = DigestUtils.sha1Hex(password);
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.login = email;
        this.droit = droit;
        this.password = sha1pass;
    }

    public User(String name, String surname, String email,
                String password, Integer droit, @Nullable Referentiel categorie) {
        String sha1pass = DigestUtils.sha1Hex(password);
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.login = email;
        this.droit = droit;
        this.password = sha1pass;
        this.categorie = categorie;
    }

    public User(String name, String surname, String email, String password, String adresse,
                String ville, String codePostal, String portable, String telephone,
                String dateNaissance, String siret, String societe, Integer droit ) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.login = email;
        this.password = password;
        this.adresse = adresse;
        this.ville = ville;
        this.codePostal = codePostal;
        this.portable = portable;
        this.telephone = telephone;
        this.dateNaissance = dateNaissance;
        this.siret = siret;
        this.societe = societe;
        this.droit = droit;
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
        String sha1pass = DigestUtils.sha1Hex(password);
        this.password = sha1pass;
    }

    public Integer getDroit() {
        return droit;
    }

    public void setDroit(Integer droit) {
        this.droit = droit;
    }

    public List<Projet> getProjetListPro() {
        return projetListPro;
    }

    public void setProjetListPro(List<Projet> projetList) {
        this.projetListPro = projetList;
    }

    public void addToProjetListPro(Projet projet) {
        this.projetListPro.add(projet);
    }

    public void removeFromProjetListPro(Projet projet) {
        this.projetListPro.remove(projet);
    }

    public List<Projet> getProjetListUser() {
        return projetListUser;
    }

    public void setProjetListUser(List<Projet> projetList) {
        this.projetListUser = projetList;
    }

    public void addToProjetListUser(Projet projet) {
        this.projetListUser.add(projet);
    }

    public void removeFromProjetListUser(Projet projet) {
        this.projetListUser.remove(projet);
    }

    public static void makeAdmin() {
        User u = User.find.query().where().eq("login", "admin@ifpass.fr").findOne();
        if (u == null) {
            String pass = "soleil";
            User adm = new User("Admin", "Admin", "admin@ifpass.fr", pass, 0);
            adm.save();
        }
    }

    public List<Message> getMessagesEnvoyes() {
        return messagesEnvoyes;
    }

    public void setMessagesEnvoyes(List<Message> messagesEnvoyes) {
        this.messagesEnvoyes = messagesEnvoyes;
    }

    public void addToMessages(Message messagesEnvoye) {
        this.messagesEnvoyes.add(messagesEnvoye);
    }

    public List<Message> getMessagesRecus() {
        return messagesRecus;
    }

    public void setMessagesRecus(List<Message> messagesRecus) {
        this.messagesRecus = messagesRecus;
    }

    public void addToMessagesRecus(Message message) {
        this.messagesRecus.add(message);
    }

    public Referentiel getCategorie() {
        return categorie;
    }

    public void setCategorie(Referentiel categorie) {
        this.categorie = categorie;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }

    public void makeUserDir() {
        this.folder = FileUtils.createUploadDir(this);
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getPortable() {
        return portable;
    }

    public void setPortable(String portable) {
        this.portable = portable;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(String dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getSiret() {
        return siret;
    }

    public void setSiret(String siret) {
        this.siret = siret;
    }

    public String getSociete() {
        return societe;
    }

    public void setSociete(String societe) {
        this.societe = societe;
    }

    public void resetPassword(MailerClient mailerClient) {
        MailerService ms = new MailerService(mailerClient);
        ms.resetPassword(this);
    }

    public MailToken getToken() {
        return token != null ? token : this.setToken(new MailToken()).saveAndReturn().getToken();
    }

    public User setToken(MailToken token) {
        this.token = token;
        if (token.getUser() == null) {
            token.setUser(this);
        }
        return this;
    }

    public List<CalendarEvent> getEventList() {
        List<CalendarEvent> eventList = new ArrayList<>();
        if (this.getDroit()!= null) {
            if (this.getDroit() == 2) {
                if (getEventListUser() != null) {
                    eventList = getEventListUser();
                }
            } else if (this.getDroit() == 1) {
                if (getEventListPro() != null) {
                    eventList = getEventListPro();
                }
            }
        }
        return eventList;
    }

    public void setEventListUser(List<CalendarEvent> eventListUser) {
        this.eventListUser = eventListUser;
    }

    public void setEventListPro(List<CalendarEvent> eventListPro) {
        this.eventListPro = eventListPro;
    }

    public List<CalendarEvent> getEventListUser() {
        return eventListUser;
    }

    public void addToEventList(CalendarEvent event) {
        if (droit == 2) {
            this.eventListUser.add(event);
        } else if (droit == 1) {
            this.eventListPro.add(event);
        }
    }

    public void addToEventListUser(CalendarEvent event) {
        this.eventListUser.add(event);
    }

    public List<CalendarEvent> getEventListPro() {
        return eventListPro;
    }

    public void addToEventListPro(CalendarEvent event) {
        if (!this.eventListPro.contains(event)) {
            this.eventListPro.add(event);
        }
    }

    public User saveAndReturn() {
        super.save();
        return this;
    }

    public static Finder<Long, User> find = new Finder<Long, User>(User.class);

}
