import filters.myFilter;
import play.http.DefaultHttpFilters;
import javax.inject.Inject;

public class Filters extends DefaultHttpFilters {
    @Inject
    public Filters(myFilter filter) {
        super(filter);
    }
}