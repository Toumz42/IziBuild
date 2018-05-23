package models;

import io.ebean.Finder;
import io.ebean.Model;
import models.utils.TypesReferentiel;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by ghanem01 on 28/02/2017.
 */
@Entity
public class Referentiel extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    private String code;
    private String libelle;
    private String commentaire;
    private int type;

    public Referentiel(int type) {
        this.type = type;
    }

    public Referentiel(String code, String libelle, int type) {
        this.code = code;
        this.libelle = libelle;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public static Finder<Long, Referentiel> find = new Finder<Long, Referentiel>(Referentiel.class);
}