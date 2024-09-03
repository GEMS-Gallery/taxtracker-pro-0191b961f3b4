import Array "mo:base/Array";
import Func "mo:base/Func";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  stable var taxPayerEntries : [(Nat, TaxPayer)] = [];
  var taxPayers = HashMap.HashMap<Nat, TaxPayer>(0, Nat.equal, Nat.hash);

  // Create a mutable variable to keep track of the next available TID
  stable var nextTID : Nat = 1;

  // Function to add a new TaxPayer
  public func addTaxPayer(firstName: Text, lastName: Text, address: Text) : async Result.Result<Nat, Text> {
    let newTaxPayer : TaxPayer = {
      tid = nextTID;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayers.put(nextTID, newTaxPayer);
    let currentTID = nextTID;
    nextTID += 1;
    #ok(currentTID)
  };

  // Function to get all TaxPayers
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Function to get a TaxPayer by TID
  public query func getTaxPayerByTID(tid: Nat) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Upgrade hook to reinitialize the hashmap
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Nat, TaxPayer>(taxPayerEntries.vals(), 0, Nat.equal, Nat.hash);
  };
}
