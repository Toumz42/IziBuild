package controllers;

/**
 * Created by ttomc on 04/04/2017.
 */

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import models.User;
import org.apache.commons.lang3.StringUtils;
import play.api.Play;
import play.api.mvc.MultipartFormData;
import play.mvc.Controller;
import play.mvc.*;
import play.mvc.Result;

import javax.imageio.ImageIO;


public class FileController extends Controller {

    ObjectMapper mapper = new ObjectMapper();

    public Result doGet()  {
        User u = Application.getCurrentUserObj();
        if (request().queryString().containsKey("getfile")) {
            if (request().queryString().get("getfile") != null) {
                File file = new File(Play.current().path().getAbsolutePath()
                        + "/public/uploaded/"
                        + u.getFolder()
                        + request().queryString().get("getfile"));
                if (file.exists()) {
                    response().setHeader("Content-Length", ""+file.length());
                    response().setHeader( "Content-Disposition", "inline; filename=\"" + file.getName() + "\"" );
                    return ok(file).as(getMimeType(file));
                }
            }
        } else if (request().queryString().containsKey("delfile")) {
            if (request().queryString().get("delfile") != null) {
                String filename = request().queryString().get("delfile")[0];
                File file = new File(Play.current().path().getAbsolutePath()
                        + "/public/uploaded/"
                        + u.getFolder()
                        + filename);
                if (file.exists()) {
                    file.delete(); // TODO:check and report success
                    ArrayNode json = mapper.createArrayNode();
                    ObjectNode jsonF = mapper.createObjectNode();
                    jsonF.put("success", true);
                    json.add(jsonF);
                    System.out.println(jsonF.toString());
                    return ok(json);
                }
            }
        } else if (request().queryString().containsKey("getthumb")) {
            if (request().queryString().get("getthumb") != null) {
                File file = new File(Play.current().path().getAbsolutePath()
                        + "/public/uploaded/"
                        + u.getFolder()
                        + request().queryString().get("getthumb")[0]);
                if (file.exists()) {
                    System.out.println(file.getAbsolutePath());
                    String mimetype = getMimeType(file);
                    try {
                        if (mimetype.endsWith("png") || mimetype.endsWith("jpeg") || mimetype.endsWith("jpg") || mimetype.endsWith("gif")) {
                            BufferedImage im = ImageIO.read(file);
                            if (im != null) {
                                BufferedImage thumb = resizeImage(im);
                                File dir = new File(Play.current().path().getAbsolutePath() + "/public/uploaded/temp/");
                                if (!dir.exists()) {
                                    dir.mkdir();
                                }
                                File f = new File(Play.current().path().getAbsolutePath() + "/public/uploaded/temp/temp");
                                f.createNewFile();
                                if (mimetype.endsWith("png")) {
                                    ImageIO.write(thumb, "PNG", f);
                                    response().setHeader("Content-Type", "image/png");
                                } else if (mimetype.endsWith("jpeg")) {
                                    ImageIO.write(thumb, "jpg", f);
                                    response().setHeader("Content-Type", "image/jpeg");
                                } else if (mimetype.endsWith("jpg")) {
                                    ImageIO.write(thumb, "jpg", f);
                                    response().setHeader("Content-Type", "image/jpeg");
                                } else {
                                    ImageIO.write(thumb, "GIF", f);
                                    response().setHeader("Content-Type", "image/gif");
                                }
                                response().setHeader("Content-Disposition", "inline; filename=\"" + file.getName() + "\"");
                                response().setHeader("Content-Length", "" + f.length());
                                return ok(f);
                            }
                        } else if (mimetype.endsWith("pdf") || file.getAbsolutePath().endsWith("pdf")) {
                            File f = new File(Play.current().path().getAbsolutePath() + "/public/images/pdf-flat.png" );
                            File thumbFile = makeThumbFile(f, file);
                            return ok(thumbFile);
                        } else if (mimetype.endsWith("docx") || file.getAbsolutePath().endsWith("docx")) {
                            File f = new File(Play.current().path().getAbsolutePath() + "/public/images/docx-flat.png" );
                            File thumbFile = makeThumbFile(f, file);
                            return ok(thumbFile);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } // TODO: check and report success
            }
        } else {
            ArrayNode json = mapper.createArrayNode();
            ObjectNode jsonF = mapper.createObjectNode();

            try (Stream<Path> paths = Files.walk(Paths.get(Play.current().path().getAbsolutePath()
                    + "/public/uploaded/"
                    + u.getFolder()))) {
                paths.forEach(filePath -> {
                    if (Files.isRegularFile(filePath) && !filePath.toString().contains("temp")) {
                        File f = filePath.toFile();
                        ObjectNode jsono = mapper.createObjectNode();
                        jsono.put("url", "upload?getfile=" + f.getName());
                        jsono.put("name", f.getName());
                        jsono.put("size", f.length());
                        jsono.put("thumbnailUrl", "upload?getthumb=" + f.getName());
                        jsono.put("deleteUrl", "upload?delfile=" + f.getName());
                        jsono.put("deleteType", "GET");
                        json.add(jsono);
                        jsonF.set("files", json);
                        System.out.println(jsonF.toString());
                    }
                });
                return ok(jsonF);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return ok("call POST with multipart form data");

    }


    public Result doPost() {
        User u = Application.getCurrentUserObj();
        if (!request().contentType().get().equals("multipart/form-data")) {
            return badRequest("Request is not multipart, please 'multipart/form-data' enctype for your form.");
        }

        Http.MultipartFormData<File> body = request().body().asMultipartFormData();
        List<Http.MultipartFormData.FilePart<File>> files = body.getFiles();
        ObjectMapper mapper = new ObjectMapper();
        File folder = new File(Play.current().path().getAbsolutePath() + "/public/uploaded/" +u.getFolder());
        if (!folder.exists()) {
            folder.mkdir();
        }
        if (files != null) {
            for (Http.MultipartFormData.FilePart<File> file : files) {
                Path tempfile = file.getFile().toPath();
                File newFile = new File(Play.current().path().getAbsolutePath() + "/public/uploaded/" + u.getFolder(),
                        file.getFilename());
                Path path = newFile.toPath();
                try {
                    Files.move(tempfile, path);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                ArrayNode json = mapper.createArrayNode();
                ObjectNode jsonF = mapper.createObjectNode();
                ObjectNode jsono = mapper.createObjectNode();
                jsono.put("url", "upload?getfile=" + newFile.getName());
                jsono.put("name", newFile.getName());
                jsono.put("size", newFile.length());
                jsono.put("thumbnailUrl", "upload?getthumb=" + newFile.getName());
                jsono.put("deleteUrl", "upload?delfile=" + newFile.getName());
                jsono.put("deleteType", "GET");
                json.add(jsono);
                jsonF.set("files", json);
                System.out.println(jsonF.toString());
                return ok(jsonF);
            }
        }
        flash("error", "Missing file");
        return badRequest();
    }

    private String getMimeType(File file) {
        String mimetype = "";
        if (file.exists()) {
            if (getSuffix(file.getName()).equalsIgnoreCase("png")) {
                mimetype = "image/png";
            } else if(getSuffix(file.getName()).equalsIgnoreCase("jpg")){
                mimetype = "image/jpg";
            } else if(getSuffix(file.getName()).equalsIgnoreCase("jpeg")){
                mimetype = "image/jpeg";
            } else if(getSuffix(file.getName()).equalsIgnoreCase("gif")){
                mimetype = "image/gif";
            } else {
                javax.activation.MimetypesFileTypeMap mtMap = new javax.activation.MimetypesFileTypeMap();
                mimetype  = mtMap.getContentType(file);
            }
        }
        return mimetype;
    }



    private String getSuffix(String filename) {
        String suffix = "";
        int pos = filename.lastIndexOf('.');
        if (pos > 0 && pos < filename.length() - 1) {
            suffix = filename.substring(pos + 1);
        }
        return suffix;
    }

    private static BufferedImage resizeImage(BufferedImage originalImage){
        int type = originalImage.getType() == 0? BufferedImage.TYPE_INT_ARGB : originalImage.getType();
        BufferedImage resizedImage = new BufferedImage(50, 50, type);
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, 50, 50, null);
        g.dispose();

        return resizedImage;
    }

    private static File makeThumbFile(File f , File file) throws IOException {
        BufferedImage img = ImageIO.read(f);
        File dir = new File(Play.current().path().getAbsolutePath() + "/public/uploaded/temp/");
        if (!dir.exists()) {
            dir.mkdir();
        }
        File thumbFile = new File(Play.current().path().getAbsolutePath() + "/public/uploaded/temp/temp");
        if (img != null) {
            BufferedImage thumb = resizeImage(img);
            thumbFile.createNewFile();
            ImageIO.write(thumb, "PNG", thumbFile);
            response().setHeader("Content-Type", "image/png");
            response().setHeader("Content-Disposition", "inline; filename=\"" + file.getName() + "\"");
            response().setHeader("Content-Length", "" + thumbFile.length());
        }
        return thumbFile;
    }
}
