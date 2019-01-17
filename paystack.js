function payWithPaystack() {
  var handler = PaystackPop.setup({
    key: "", //put your public key here
    email: "pinketu@gmail.com", //put your customer's email here
    amount: 100.0, //amount the customer is supposed to pay
    metadata: {
      custom_fields: [
        {
          display_name: "pinketu",
          variable_name: "123456789",
          value: "+2348012345678" //customer's mobile number
        }
      ]
    },
    callback: function(response) {
      //after the transaction have been completed
      //make post call  to the server with to verify payment
      //using transaction reference as post data
      $.post("verify.php", { reference: response.reference }, function(status) {
        if (status == "success")
          //successful transaction
          alert("Transaction was successful");
        //transaction failed
        else alert(response);
      });
    },
    onClose: function() {
      //when the user close the payment modal
      alert("Transaction cancelled");
    }
  });
  handler.openIframe(); //open the paystack's payment modal
}
