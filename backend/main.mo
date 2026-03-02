import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Product = {
    id : Text;
    name : Text;
    category : Category;
    description : Text;
    price : Nat;
    brand : Text;
    imageUrl : Text;
    stock : Nat;
  };

  type NewProduct = {
    name : Text;
    category : Category;
    description : Text;
    price : Nat;
    brand : Text;
    imageUrl : Text;
    stock : Nat;
  };

  type UpdateProduct = {
    id : Text;
    name : Text;
    category : Category;
    description : Text;
    price : Nat;
    brand : Text;
    imageUrl : Text;
    stock : Nat;
  };

  type Category = {
    #electronics;
    #watches;
  };

  let products = Map.empty<Text, Product>();

  var adminPassword : Text = "password";
  let adminLogin : Text = "admin";

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().filter(func(p) { p.category == category }).toArray();
  };

  public query ({ caller }) func getProductById(id : Text) : async ?Product {
    products.get(id);
  };

  public shared ({ caller }) func addProduct(id : Text, productInfo : NewProduct) : async Product {
    switch (products.get(id)) {
      case (?_existingProduct) {
        Runtime.trap("Product with this ID already exists");
      };
      case (null) {
        let newProduct : Product = {
          productInfo with id;
        };
        products.add(id, newProduct);
        newProduct;
      };
    };
  };

  public shared ({ caller }) func updateProduct(productInfo : UpdateProduct) : async Product {
    switch (products.get(productInfo.id)) {
      case (?_existingProduct) {
        let updatedProduct : Product = {
          productInfo with id = productInfo.id;
        };
        products.add(productInfo.id, updatedProduct);
        updatedProduct;
      };
      case (null) {
        Runtime.trap("Product does not exist, so it cannot be updated");
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (?existingProduct) {
        products.remove(id);
        existingProduct;
      };
      case (null) {
        Runtime.trap("Product does not exist, so it cannot be deleted");
      };
    };
  };

  /// ADMIN
  public query ({ caller }) func verifyAdminPassword(password : Text) : async Bool {
    password == adminPassword;
  };
};
