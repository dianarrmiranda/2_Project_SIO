package com.shop_backend.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;

import java.util.List;
import java.util.LinkedList;
@Entity // This tells Hibernate to make a table out of this class
public class App_User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer ID;

    private String Name;
    private String Email;
    private String Image;
    private String Password;
    private String Salt;
    private String Credit_Card;
    private String Role;
    private boolean Deleted = false;

    @Column(length = 1536)
    private String Active_Token;
    private Integer Token_Expiration;

    @OneToMany
    private List<ShoppingCartItem> Shopping_Cart = new LinkedList<ShoppingCartItem>();

    @OneToMany
    private List<Request> Request_History;

    public Integer getID() {
        return ID;
    }

    public void setID(Integer iD) {
        ID = iD;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getImage() {
        return Image;
    }

    public void setImage(String image) {
        Image = image;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getCredit_Card() {
        return Credit_Card;
    }

    public void setCredit_Card(String credit_Card) {
        Credit_Card = credit_Card;
    }

    public String getRole() {
        return Role;
    }

    public void setRole(String role) {
        Role = role;
    }

    public List<ShoppingCartItem> getShopping_Cart() {
        return Shopping_Cart;
    }

    public void setShopping_Cart(List<ShoppingCartItem> shopping_Cart) {
        Shopping_Cart = shopping_Cart;
    }

    public void addProdToCart(ShoppingCartItem item) {
        //  Overwrites value if a new quantity is specified for an already existing product in this cart 

        //  Check if the product is already in the cart
        for (ShoppingCartItem iterItem : Shopping_Cart) {
            if (iterItem.getProd().equals(item.getProd())) {
                //  If the product is already in the cart, update the quantity
                iterItem.setQuantity(item.getQuantity());
                return;
            }
        }

        //  If the product is not in the cart, add the new ShoppingCartItem
        Shopping_Cart.add(item);
    }

    public void removeProdFromCart(Product prod) {
        for (ShoppingCartItem item : Shopping_Cart) {
            if (item.getProd().equals(prod)) {
                Shopping_Cart.remove(item);
                return;
            }
        }
    }

    public void clearFromCart() {
        Shopping_Cart.clear();
    }

    public String printCart() {
        if (Shopping_Cart.isEmpty()) {
            return "Your cart is currently empty!";
        }
        String ret = "";
        for (ShoppingCartItem item : Shopping_Cart) {
            ret += item.toString();
        }
        return ret;
    }

    public List<Request> getRequest_History() {
        return Request_History;
    }

    public void addToRequestHistory(Request Request) {
        Request_History.add(Request);
    }

    public String printRequestHistory() {
        if (Request_History.isEmpty()) {
            return "No requests have been made yet!";
        }
        String ret = "";
        for (Request Request : Request_History) {
            ret += Request.toString() + "\n";
        }
        return ret;
    }

    public String getActive_Token() {
        return Active_Token;
    }

    public void setActive_Token(String active_Token) {
        Active_Token = active_Token;
    }
    
    public Integer getToken_Expiration() {
        return Token_Expiration;
    }

    public void setToken_Expiration(Integer token_Expiration) {
        Token_Expiration = token_Expiration;
    }

    public String getSalt() {
        return Salt;
    }

    public void setSalt(String salt) {
        Salt = salt;
    }

    public boolean isDeleted() {
        return Deleted;
    }

    public void setDeleted(boolean deleted) {
        Deleted = deleted;
    }
}