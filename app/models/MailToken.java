package models;

import io.ebean.Finder;
import io.ebean.Model;
import models.utils.RandomString;
import org.apache.commons.lang3.time.DateUtils;

import javax.persistence.*;
import java.util.Date;

@Entity
public class MailToken extends Model {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public String token;
    public Date expireDate;

    @OneToOne( fetch = FetchType.EAGER )
    public User user;

    public MailToken() {
        this.token = new RandomString().nextString();
        this.expireDate = DateUtils.addHours(new Date(), 1);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpireDate() {
        return expireDate;
    }

    public void setExpireDate(Date expireDate) {
        this.expireDate = expireDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user.getToken() == null) {
            user.setToken(this);
        }
    }

    public static Finder<Long, MailToken> find = new Finder<Long, MailToken>(MailToken.class);
}
