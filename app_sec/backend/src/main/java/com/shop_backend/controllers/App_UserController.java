package com.shop_backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.List;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import org.json.JSONObject;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Base64.Encoder;
import java.security.spec.KeySpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;
import java.util.regex.Pattern;
import java.util.Arrays;

import com.shop_backend.models.repos.App_UserRepo;
import com.shop_backend.models.repos.RequestRepo;
import com.shop_backend.models.repos.ShoppingCartItemRepo;
import com.shop_backend.models.repos.ProductRepo;

import com.shop_backend.models.entities.App_User;
import com.shop_backend.models.entities.Request;
import com.shop_backend.models.entities.Product;
import com.shop_backend.models.entities.ShoppingCartItem;

@Controller
@CrossOrigin("*")
@RestController
@RequestMapping(path = "/user")
public class App_UserController {

  // Needed repositories (database tables)
  @Autowired
  private App_UserRepo app_userRepository;
  @Autowired
  private RequestRepo RequestRepository;
  @Autowired
  private ShoppingCartItemRepo itemRepository;
  @Autowired
  private ProductRepo productRepository;

  // Create and save a new app_user object to the repository (database)
  @PostMapping(path = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public @ResponseBody String addapp_user(@RequestParam String name, @RequestParam String email,
      @RequestParam String password, @RequestParam String cartao,
      @RequestParam String role, @RequestParam(required = false) MultipartFile img) {

    // Check if any required value is empty
    if (name == null || name.equals("") || email == null || email.equals("")
        || password == null || password.equals("") || cartao == null || cartao.equals("") || role == null
        || role.equals("")) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Provide all the required data fields!");
    }

    // Check the given email is already associated with another user
    if (app_userRepository.findapp_userByEmail(email) != null) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "A user with this email already exists!");
    }

    String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\."+ 
                            "[a-zA-Z0-9_+&*-]+)*@" + 
                            "(?:[a-zA-Z0-9-]+\\.)+[a-z" + 
                            "A-Z]{2,7}$"; 
    Pattern pat = Pattern.compile(emailRegex); 
    // Check if the email is valid
    if (!pat.matcher(email).matches()) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
          "The provided Email must be valid!");
    }

    // Check if the card number has 12 characters in lenght
    if (cartao.length() != 12) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
          "The Card number must have twelve digits!");
    }

    
    if (img != null) {
      String OGfileName = img.getOriginalFilename();
      String fileExtention = OGfileName.substring(OGfileName.lastIndexOf(".") + 1);
      String[] a= {"png", "jpeg", "jpg", "tiff", "tif", "webp"};

      //  Check file type
      if (!Arrays.asList(a).contains(fileExtention)) {
        throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
            "The image file must be of the png, jpeg, jpg, tiff, tif or webp type!");
      }
    
    }

    // Check the role is app_user or admin
    if (!role.equals("user") && !role.equals("admin")) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
          "The role value must either be 'user' or 'admin'!");
    }

    // Register the App_User Object
    try {
      App_User usr = new App_User();
      usr.setName(name);
      usr.setEmail(email);
      usr.setPassword(password);
      usr.setCredit_Card(cartao);
      usr.setRole(role);

      String folder = "../frontend/src/assets/prod_images/";
      String filename = usr.getName().replace("\s", "") + ".jpg";

      Path path = Paths.get(folder + filename);

      if (img != null) {
        // Create the directory if it does not exist
        if (!Files.exists(path.getParent())) {
          Files.createDirectories(path.getParent());
        }

        // Create the file if it does not exist
        if (!Files.exists(path)) {
          Files.createFile(path);
        }
        try (InputStream inputStream = img.getInputStream()) {
          Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
          throw new IOException("Could not save image file: " + filename, e);
        }

        usr.setImage("/src/assets/prod_images/" + filename);
      } else {
        usr.setImage("");
      }

      Encoder encoder = Base64.getUrlEncoder().withoutPadding();

      //  Generate the random number
      SecureRandom random = new SecureRandom();
      //  Generate the salt
      byte[] salt = new byte[16];
      random.nextBytes(salt);
      String saltStr = encoder.encodeToString(salt);
      //  Generate the salted key
      KeySpec spec = new PBEKeySpec(password.toCharArray(), saltStr.getBytes(), 65536, 128);
      //  Generate the final hashed + salted key
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      byte[] hash = factory.generateSecret(spec).getEncoded();

      usr.setSalt(saltStr);
      usr.setPassword(encoder.encodeToString(hash));

      // Generate the token
      SecureRandom rng = new SecureRandom();
      byte bytes[] = new byte[64];
      rng.nextBytes(bytes);
      String token = encoder.encodeToString(bytes);

      usr.setActive_Token(token);
      app_userRepository.save(usr);

      // Generate the output user object for the frontend
      JSONObject out = new JSONObject();
      out.put("id", usr.getID().toString());
      out.put("name", usr.getName());
      out.put("email", usr.getEmail());
      out.put("image", usr.getImage());
      out.put("token", usr.getActive_Token());
      out.put("shopping_Cart", usr.getShopping_Cart());
      out.put("request_History", usr.getRequest_History());

      return out.toString(1);
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }
  }

  // List produtos from the repository (database)
  @GetMapping(path = "/list")
  public @ResponseBody LinkedList<HashMap<String, String>> listapp_user() {
    LinkedList<HashMap<String, String>> data = new LinkedList<HashMap<String, String>>();

    // Get all Users
    List<App_User> returnedVals = app_userRepository.listapp_users();

    // Create an array of maps with the intended values (like a JSON object)
    for (App_User usr : returnedVals) {
      HashMap<String, String> temp = new HashMap<String, String>();

      // Select what values to give to the app_user
      temp.put("id", usr.getID().toString());
      temp.put("name", usr.getName());
      temp.put("email", usr.getEmail());

      data.add(temp);
    }

    return data;
  }

  // List produtos from the repository (database)
  @GetMapping(path = "/listByRole")
  public @ResponseBody LinkedList<HashMap<String, String>> listapp_userRole(@RequestParam String role) {

    // Check the role is app_user or admin
    if (!role.equals("user") && !role.equals("admin")) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
          "The role value must either be 'user' or 'admin'!");
    }

    LinkedList<HashMap<String, String>> data = new LinkedList<HashMap<String, String>>();
    List<App_User> returnedVals = app_userRepository.listapp_usersByType(role);

    for (App_User usr : returnedVals) {
      HashMap<String, String> temp = new HashMap<String, String>();

      // Select what values to give to the app_user
      temp.put("id", usr.getID().toString());
      temp.put("name", usr.getName());
      temp.put("email", usr.getEmail());

      data.add(temp);
    }

    return data;
  }

  // Get the number of total app_users in the repository (database)
  @GetMapping(path = "/number")
  public @ResponseBody LinkedList<HashMap<String, String>> numberOfapp_users() {

    // Create a "JSON"ish object
    LinkedList<HashMap<String, String>> data = new LinkedList<HashMap<String, String>>();
    HashMap<String, String> temp = new HashMap<String, String>();

    temp.put("num", app_userRepository.getNumberOfapp_users());
    data.add(temp);

    return data;
  }

  // View all information of a specific object based on ID
  @GetMapping(path = "/view")
  public @ResponseBody String viewapp_userByID(@RequestParam Integer id, @RequestParam String token) {
    App_User user;

    // Check if a User with this ID exists
    try {
      user = app_userRepository.findapp_userByID(id);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    if (user == null) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "An entity the specified ID does not exist!");
    }
    if (!user.getActive_Token().equals(token)) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Token does not match the given user ID!");
    }    
    
    // Generate the output user object for the frontend
    JSONObject out = new JSONObject();
    out.put("id", user.getID().toString());
    out.put("name", user.getName());
    out.put("email", user.getEmail());
    out.put("role", user.getRole());
    out.put("image", user.getImage());
    out.put("credit_Card", user.getCredit_Card());
    out.put("shopping_Cart", user.getShopping_Cart());
    out.put("request_History", user.getRequest_History());

    return out.toString(1);
  }

  // View all app_user info IF email and password check out, else return bad login
  // info
  @GetMapping(path = "/checkLogin")
  public @ResponseBody String checkLoginInfo(@RequestParam String email, @RequestParam String password) {
    App_User user;

    // Check if a User with this login information exists or nor
    try {
      user = app_userRepository.findapp_userByEmail(email);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    if (user == null) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User email has no account associated!");
    }

    String hashedPassword = user.getPassword();
    String hashedPassToCheck = "";

    Encoder encoder = Base64.getUrlEncoder().withoutPadding();
    KeySpec spec = new PBEKeySpec(password.toCharArray(), user.getSalt().getBytes(), 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      byte[] hash = factory.generateSecret(spec).getEncoded();
      hashedPassToCheck = encoder.encodeToString(hash);
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }
    if (!hashedPassword.equals(hashedPassToCheck)) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User authentication is incorrect >");
    }

    SecureRandom rng = new SecureRandom();
    byte bytes[] = new byte[64];
    rng.nextBytes(bytes);

    user.setActive_Token(encoder.encodeToString(bytes));
    app_userRepository.save(user);

    // Generate the output user object for the frontend
    JSONObject out = new JSONObject();
    out.put("id", user.getID().toString());
    out.put("name", user.getName());
    out.put("email", user.getEmail());
    out.put("image", user.getImage());
    out.put("token", user.getActive_Token());
    out.put("shopping_Cart", user.getShopping_Cart());
    out.put("request_History", user.getRequest_History());

    return out.toString(1);
  }

  // Update the password of a specific object based on ID
  @PostMapping(path = "/updatePassword")
  public @ResponseBody String updatePassword(@RequestParam Integer id, @RequestParam String token,
      @RequestParam String oldPassword, @RequestParam String newPassword) {
    App_User user;

    // Check if a User with this ID exists
    try {
      user = app_userRepository.findapp_userByID(id);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    if (user == null) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
          "A user with the specified ID does not exist!");
    }

    if (!user.getActive_Token().equals(token)) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Token does not match the given user ID!");
    }

    String currentHashedPass = user.getPassword();
    String oldHashedPassToCheck = "";
    String newHashedPass = "";

    Encoder encoder = Base64.getUrlEncoder().withoutPadding();
    KeySpec spec = new PBEKeySpec(oldPassword.toCharArray(), user.getSalt().getBytes(), 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      byte[] hash = factory.generateSecret(spec).getEncoded();
      oldHashedPassToCheck = encoder.encodeToString(hash);
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }
    if (!currentHashedPass.equals(oldHashedPassToCheck)) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User authentication is incorrect");
    }

    spec = new PBEKeySpec(newPassword.toCharArray(), user.getSalt().getBytes(), 65536, 128);
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
      byte[] hash = factory.generateSecret(spec).getEncoded();
      newHashedPass = encoder.encodeToString(hash);
    } catch (Exception e) {
      e.printStackTrace();
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    // Set the new password and save the User Object (overwrite old object)
    user.setPassword(newHashedPass);
    app_userRepository.save(user);

    return "Saved";
  }

  // Add a product to this app_user's cart
  @PostMapping(path = "/addToCart")
  public @ResponseBody List<ShoppingCartItem> addProdToCart(@RequestParam Integer userID, @RequestParam String token,
      @RequestParam Product prod, @RequestParam Integer quantity) {
    App_User usr;

    // Check if a User with this ID exists
    try {
      usr = app_userRepository.findapp_userByID(userID);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    if (usr == null) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "The specified User does not exist!");
    }

    if (!usr.getActive_Token().equals(token)) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
          "Token does not match the given user ID");
    }

    // Create a new shopping cart item
    try {
      ShoppingCartItem item = new ShoppingCartItem();
      item.setProd(prod);
      item.setQuantity(quantity);
      itemRepository.save(item);

      // Add the item to the user's cart
      usr.addProdToCart(item);
      app_userRepository.save(usr);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    return usr.getShopping_Cart();
  }

  // Remove a product from this app_user's cart
  @PostMapping(path = "/removeFromCart")
  public @ResponseBody List<ShoppingCartItem> removeProdFromCart(@RequestParam Integer userID,
      @RequestParam String token, @RequestParam Product prod) {
    App_User usr;

    // Check if a User with this ID exists
    try {
      usr = app_userRepository.findapp_userByID(userID);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    if (usr == null) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "The specified User does not exist!");
    }

    if (!usr.getActive_Token().equals(token)) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Token does not match the given user ID!");
    }

    // Remove the item from the cart
    try {
      usr.removeProdFromCart(prod);
      app_userRepository.save(usr);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    return usr.getShopping_Cart();
  }

  // Request the current cart as an order
  @PostMapping(path = "/requestCurrentCart")
  public @ResponseBody String RequestCart(@RequestParam Integer userID, @RequestParam String token) {
    App_User usr;
    String receipt = "";

    // Check if a User with this ID exists
    try {
      usr = app_userRepository.findapp_userByID(userID);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
    }

    if (usr == null) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "The specified User does not exist!");
    }

    if (!usr.getActive_Token().equals(token)) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Token does not match the given user ID!");
    }

    // Create the receipt String object
    receipt += "------------ Client ----------\n";
    receipt += "Client Name: " + usr.getName() + "\n";
    receipt += "Client Email: " + usr.getEmail() + "\n";
    receipt += "Payment Information: " + usr.getCredit_Card() + "\n\n";

    List<ShoppingCartItem> currentCart = usr.getShopping_Cart();
    List<ShoppingCartItem> orderCart = new ArrayList<>();
    double total = 0;
    int i = 0;

    // Check if the user has any items in its cart
    if (currentCart.size() < 1) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
          "The current shopping cart of this user is empty!");
    }

    // Add the current items in the shopping cart to an order object
    receipt += "------------ Products ----------\n";
    for (ShoppingCartItem item : currentCart) {
      ShoppingCartItem orderItem = item;
      orderCart.add(orderItem);
      total += item.getProd().getPrice() * item.getQuantity();

      // Check if requested item quantity is available
      if (item.getProd().getIn_Stock() < item.getQuantity()) {
        throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
            "Only " + item.getProd().getIn_Stock() + " items of type " + item.getProd().getName()
                + " are in stock, but " + item.getQuantity() + " where requested!");
      }

      receipt += "\n ----- Product " + i + " ------\n";
      receipt += "Name: " + item.getProd().getName() + "\n";
      receipt += "Price: " + item.getProd().getPrice() + "€\n";
      receipt += "Quantity: " + item.getQuantity() + "\n";

      item.getProd().setIn_Stock(item.getProd().getIn_Stock() - item.getQuantity());
      productRepository.save(item.getProd());
      i++;
    }

    receipt += "\n------------ Total ----------\n";
    receipt += "Total: " + total + "€\n";

    // Save the new order request and update the user's shopping history and clear
    // the shopping cart
    Request ord = new Request();
    ord.setItem(orderCart);
    ord.setTotal(total);
    RequestRepository.save(ord);

    usr.clearFromCart();
    usr.addToRequestHistory(ord);
    app_userRepository.save(usr);

    return receipt;
  }
}