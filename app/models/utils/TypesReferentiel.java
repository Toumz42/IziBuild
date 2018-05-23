package models.utils;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

public class TypesReferentiel {

    public static final int TYPE_METIER = 0 ;
    public static final int TYPE_PIECE = 1;

    public HashMap<String,Integer> getAllTypes() {
        HashMap<String, Integer> hm = new HashMap<>();
        Field[] fs = this.getClass().getDeclaredFields();
        List<Field> fl = Arrays.asList(fs);
        for (Field f : fl) {
            try {
                f.setAccessible(true);
                hm.put(f.getName(), f.getInt(null));
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return hm;
    }

    public Integer getAllTypes(String type) {
        Field[] fs = this.getClass().getDeclaredFields();
        List<Field> fl = Arrays.asList(fs);
        for (Field f : fl) {
            try {
                f.setAccessible(true);
                if (f.getName().equals(type)){
                    return f.getInt(null);
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return 0;
    }
}
