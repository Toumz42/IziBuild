import org.junit.Test;
import play.data.FormFactory;
import play.db.jpa.JPAApi;
import play.mvc.Result;
import play.twirl.api.Content;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static play.mvc.Http.Status.OK;
import static play.test.Helpers.*;

/**
 * Simple (JUnit) tests that can call all parts of a play app.
 *
 * https://www.playframework.com/documentation/latest/JavaTest
 */
public class UnitTest {


    @Test
    public void checkTemplate() {
        Content html = views.html.index.render(true, false);
        assertEquals("text/html", html.contentType());
        assertTrue(contentAsString(html).contains("Add Person"));
    }
}
