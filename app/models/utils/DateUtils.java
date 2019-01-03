package models.utils;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.util.Date;
import java.util.Locale;

/**
 * Created by ttomc on 11/02/2017.
 */
public class DateUtils {

    public String toFrenchDateString(Date date) {
        DateTime dt = new DateTime(date);
        DateTimeFormatter fmt = DateTimeFormat.forPattern("dd MMM, yyyy");
        DateTimeFormatter frenchFmt = fmt.withLocale(Locale.FRENCH);
        return frenchFmt.print(dt);
    }


}
