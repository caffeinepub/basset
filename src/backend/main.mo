import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  type SubmissionStatus = {
    #pending;
    #selected;
    #rejected;
  };

  type FashionDesignSubmission = {
    artistName : Text;
    email : Text;
    title : Text;
    description : Text;
    image : Storage.ExternalBlob;
    timestamp : Time.Time;
    status : SubmissionStatus;
    isPaid : Bool;
  };

  module FashionDesignSubmission {
    public func compareByTitle(a : FashionDesignSubmission, b : FashionDesignSubmission) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  include MixinStorage();

  // Prepare the actor and include authentication system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data storage setup
  let submissions = Map.empty<Text, FashionDesignSubmission>();
  var submissionCounter = 0;

  // Get all submissions (public)
  public query func getAllSubmissions() : async [FashionDesignSubmission] {
    submissions.values().toArray();
  };

  // Get submissions by status (public)
  public query func getSubmissionsByStatus(status : SubmissionStatus) : async [FashionDesignSubmission] {
    let filtered = List.empty<FashionDesignSubmission>();

    for (sub in submissions.values()) {
      if (sub.status == status) {
        filtered.add(sub);
      };
    };

    filtered.toArray();
  };

  // Submit a new design (public)
  public shared ({ caller }) func submitDesign(submission : FashionDesignSubmission) : async Text {
    let id = submission.title.concat(submission.artistName).concat(Time.now().toText());
    if (submissions.containsKey(id)) { Runtime.trap("Submission with this id already exists.") };
    let newSubmission : FashionDesignSubmission = {
      submission with
      timestamp = Time.now();
      status = #pending;
      isPaid = false;
    };

    submissions.add(id, newSubmission);
    submissionCounter += 1;
    id;
  };

  // Get design count (public)
  public query func getSubmissionCount() : async Nat {
    submissionCounter;
  };

  // Admin: Get all submissions (admin only)
  public query ({ caller }) func adminGetAllSubmissions() : async [FashionDesignSubmission] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all submissions");
    };
    submissions.values().toArray();
  };

  // Admin: Update submission status (admin only)
  public shared ({ caller }) func updateSubmissionStatus(id : Text, status : SubmissionStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update submission status");
    };

    switch (submissions.get(id)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?submission) {
        let updated : FashionDesignSubmission = {
          submission with
          status;
          isPaid = if (status == #selected) {
            false;
          } else {
            submission.isPaid;
          };
        };
        submissions.add(id, updated);
      };
    };
  };

  // Admin: Mark design as paid (admin only)
  public shared ({ caller }) func markDesignAsPaid(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can mark as paid");
    };

    switch (submissions.get(id)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?submission) {
        if (submission.status != #selected) {
          Runtime.trap("Cannot mark as paid unless selected");
        };
        let updated : FashionDesignSubmission = {
          submission with
          isPaid = true;
        };
        submissions.add(id, updated);
      };
    };
  };

  // Get unpaid selected designs (admin only)
  public query ({ caller }) func getUnpaidSelectedDesigns() : async [FashionDesignSubmission] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view unpaid designs");
    };

    let filtered = List.empty<FashionDesignSubmission>();

    for (sub in submissions.values()) {
      if (sub.status == #selected and not sub.isPaid) {
        filtered.add(sub);
      };
    };

    filtered.toArray();
  };
};
