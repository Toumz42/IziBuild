package filters;
import java.util.concurrent.CompletionStage;
import java.util.function.Function;
import java.util.Map;
import javax.inject.Inject;
import akka.stream.Materializer;
import play.Logger;
import play.mvc.*;
import play.routing.Router.Tags;

public class myFilter extends Filter {

    @Inject
    public myFilter(Materializer mat) {
        super(mat);
    }

    @Override
    public CompletionStage<Result> apply(
            Function<Http.RequestHeader, CompletionStage<Result>> nextFilter,
            Http.RequestHeader requestHeader) {
        return nextFilter.apply(requestHeader).thenApply(result -> result.withHeader("Service-Worker-Allowed", "/"));
    }
}