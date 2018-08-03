package mailer;

import models.User;
import play.libs.mailer.Email;
import play.libs.mailer.MailerClient;
import javax.inject.Inject;
import java.io.File;
import org.apache.commons.mail.EmailAttachment;
import play.mvc.Controller;
import play.mvc.Result;

public class MailerService extends Controller {

    private final MailerClient mailerClient;


    public MailerService(MailerClient mailerClient) {
        this.mailerClient = mailerClient;
    }


    public Result resetPassword(User u) {
        //String cid = "1234";

        String http = "http://";
        String host = "localhost:9000";
        String token = u.getToken().getToken();
        String id = u.getToken().getId().toString();
        String hrefToken = http + host + "/resetPasswordForm/" + id + "-" + token;
        Email email = new Email()
                .setSubject("EasyBuild - Récupération de mot de passe")
                .setFrom("Robot EasyBuild <robot@email.com>")
                .addTo(u.getEmail())
                // adds attachment
                //.addAttachment("attachment.pdf", new File("/some/path/attachment.pdf"))
                // adds inline attachment from byte array
                //.addAttachment("data.txt", "data".getBytes(), "text/plain", "Simple data", EmailAttachment.INLINE)
                // adds cid attachment
                //.addAttachment("image.jpg", new File("/some/path/image.jpg"), cid)
                // sends text, HTML or both...
                //.setBodyText("A text message")
                .setBodyHtml("<html><body>" +
                        "<h1>Reinitialisation de mot de passe</h1>" +
                        "<div>" +
                        "<a href='"+hrefToken+"'>" +
                        "Cliquez içi pour réinitialiser votre mot de passe</a>" +
                        "</div>" +
                        "</body></html>");
        mailerClient.send(email);
        return ok();
    }


}