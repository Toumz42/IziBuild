package models.utils;

import models.User;
import play.api.Play;

import java.io.File;

public class FileUtils {

    public static String createUploadDir(User u) {
        String userFolder = "" + u.getId() + u.getName() + "/";
        File folder = new File(Play.current().path().getAbsolutePath()+"/public/uploaded/"+userFolder);
        if (!folder.exists()) {
            folder.mkdirs();
            return userFolder;
        } else {
            return userFolder;
        }
    }
}
