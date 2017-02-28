package models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.ebean.Model;

import javax.persistence.*;
import java.util.List;

/**
 * Created by ghanem01 on 28/02/2017.
 */
@Entity
public class Matiere extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String matiere;
    @OneToMany(mappedBy="matiere")
    @JsonManagedReference
    private List<Note> noteList;



}