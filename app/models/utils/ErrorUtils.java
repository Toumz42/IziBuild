package models.utils;

/**
 * Created by ttomc on 03/01/2017.
 */
public class ErrorUtils {

    private boolean				isError;
    private String				messageRetour;
    private String				gravite;
    private Long				id;

    public ErrorUtils()
    {
    }

    /**
     * Permet de creer un enregistrement d'une erreur renvoyée via json
     *
     * @param isError
     *            : true = erreur, false = doc ou message de retour à afficher
     * @param messageRetour
     *            : message à afficher coté client
     * @param gravite
     *            : niveau de gravité de l'erreur (doc, warn ou erreur)
     */
    public static ErrorUtils createError( boolean isError, String messageRetour, String gravite )
    {
        ErrorUtils e = new ErrorUtils();
        e.isError = isError;
        e.messageRetour = messageRetour;
        e.gravite = gravite;
        return e;
    }

    public boolean isError()
    {
        return isError;
    }

    public void setError( boolean isError )
    {
        this.isError = isError;
    }

    public String getMessageRetour()
    {
        return messageRetour;
    }

    public void setMessageRetour( String messageRetour )
    {
        this.messageRetour = messageRetour;
    }

    public String getGravite()
    {
        return gravite;
    }

    public void setGravite( String gravite )
    {
        this.gravite = gravite;
    }

    public Long getId()
    {
        return id;
    }

    public void setId( Long id )
    {
        this.id = id;
    }

}
