package models.utils;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;

/**
 * Created by ttomc on 15/01/2017.
 */
public class HtmlUtils {


    public static JsonNode ObjectToJsonTab(Object o) {

        ObjectMapper mapper = new ObjectMapper();
//                JsonNode retourJson = mapper.convertValue(grp, JsonNode.class);

        String table = "<thead>";
        String rowStart =  "<tr>";
        String rowEnd =  "</tr>";
        String colStart =  "<td>";
        String colEnd =  "</td>";
        String headEnd =  "</thead>";
        String bodyStart =  "<tbody>";
        String bodyEnd =  "</tbody>";

        String hEnd =  "</th>";

        Class grpClass = null;

        if (o != null) {
            grpClass = o.getClass();
        }

        if (grpClass != null) {
            table += rowStart;
            for (Field f : grpClass.getFields()) {
                if (!f.getName().equals("find") && !f.getName().equals("_ebean_props")) {
                    String value = f.getName();
                    String hStart =  "<th data-field=\'"+f.getName()+"\'>";
                    table+= hStart + value + hEnd;
                }
            }
            table+= rowEnd + headEnd + bodyStart + rowStart;
            for (Field f : grpClass.getFields()) {
                if (!f.getName().equals("find") && !f.getName().equals("_ebean_props")) {
                    String value = "" ;
                    try {
                        value = f.get(o).toString();
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                    table+=  colStart + value + colEnd;
                }
            }
            table += rowEnd ;
            table += bodyEnd;
        }

        JsonFactory factory = mapper.getFactory(); // since 2.1 use mapper.getFactory() instead
        JsonParser jp = null;
        JsonNode retourJson = null;
        try {
            jp = factory.createParser("{\"html\":\" "+ table +" \"}");
            retourJson = mapper.readTree(jp);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return retourJson;
    }

    public static JsonNode ListObjectToJsonTab(List<?> lO) {

        ObjectMapper mapper = new ObjectMapper();
//                JsonNode retourJson = mapper.convertValue(grp, JsonNode.class);
        String table = "<thead>";
        String rowStart =  "<tr>";
        String rowEnd =  "</tr>";
        String colStart =  "<td>";
        String colEnd =  "</td>";
        String headEnd =  "</thead>";
        String bodyStart =  "<tbody>";
        String bodyEnd =  "</tbody>";

        String hEnd =  "</th>";

        Class grpClass = null;

        if (lO != null) {
            for (Object o : lO) {
                if (o!=null) {
                    grpClass = o.getClass();
                    if (grpClass != null) {
                        table += rowStart;
                        for (Field f : grpClass.getFields()) {
                            if (!f.getName().equals("find") && !f.getName().equals("_ebean_props")) {
                                String value = f.getName();
                                String hStart =  "<th data-field=\'"+f.getName()+"\'>";
                                table+= hStart + value + hEnd;
                            }
                        }
                        table+= rowEnd + headEnd + bodyStart + rowStart;
                        for (Field f : grpClass.getFields()) {
                            if (!f.getName().equals("find") && !f.getName().equals("_ebean_props")) {
                                String value = "" ;
                                try {
                                    value = f.get(o).toString();
                                } catch (IllegalAccessException e) {
                                    e.printStackTrace();
                                }
                                table+=  colStart + value + colEnd;
                            }
                        }
                        table += rowEnd ;
                    }
                }
            }
            table += bodyEnd;

        }
        JsonFactory factory = mapper.getFactory(); // since 2.1 use mapper.getFactory() instead
        JsonParser jp = null;
        JsonNode retourJson = null;
        try {
            jp = factory.createParser("{\"html\":\" "+ table +" \"}");
            retourJson = mapper.readTree(jp);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return retourJson;
    }


}
