package controllers;

import play.api.mvc.Cookie;
import play.api.mvc.Cookies;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;

import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletionStage;

public class CookieAction extends Action.Simple {
    public CompletionStage<Result> call(Http.Context ctx) {
        ctx.request().cookies().forEach(cookie -> {
            if (cookie.name().equals("PLAY_SESSION")) {
                if (ctx.session().get("expire") !=null) {
                    Long l = Long.valueOf(ctx.session().get("expire"));
                    Date today = new Date();
                    Date expire = new Date();
                    expire.setTime(l);
                    if (expire.before(today)) {
                        ctx.session().clear();
                    }
                }
            }
        });
        return delegate.call(ctx);
    }
}