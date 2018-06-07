package models;

import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class Message extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String message;
    private Date date;
    @ManyToOne
    private User expediteur;
    @ManyToOne
    private User destinataire;

    public Message() {
    }

    public Message(String message, User expediteur) {
        this.message = message;
        this.date = new Date();
        this.expediteur = expediteur;
    }
    public Message(String message, User expediteur, User destinataire) {
        this.message = message;
        this.date = new Date();
        this.expediteur = expediteur;
        this.destinataire = destinataire;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public User getExpediteur() {
        return expediteur;
    }

    public void setExpediteur(User expediteur) {
        this.expediteur = expediteur;
    }

    public User getDestinataire() {
        return destinataire;
    }

    public void setDestinataire(User destinataire) {
        this.destinataire = destinataire;
    }

    public static Finder<Long, Message> find = new Finder<Long, Message>(Message.class);
}
