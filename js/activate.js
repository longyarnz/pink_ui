const appIsLive = location.hostname !== '127.0.0.1';
const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';
const publicKey = 'pk_test_99aefb07d699525e9eed76be0cbe03fda6ad0ff6';

function handlePayment(response) {
  const URL = `${API}/transaction/verify`;
  const xhttp = new XMLHttpRequest();
  console.log(response);

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      toggleButtonSpinner(button, false);
      console.log(this.responseText);
    }
  };

  xhttp.open("POST", URL, true);
  xhttp.send(JSON.stringify(response));
}

function handleResponse(request) {
  const { _id, user, message } = JSON.parse(request.responseText);
  localStorage.removeItem('isSubmitting');

  if (message) location.assign('/login.html');

  else if (_id && user) {
    const paystack = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: 100000,
      ref: _id,
      callback: handlePayment,
      onClose: () => console.log("Payment Closed"),
      currency: "NGN"
    });
    paystack.openIframe();
  }
}

function activateViaPaystack() {
  if (localStorage.isSubmitting === 'true') return;

  const button = document.querySelector('button');
  toggleButtonSpinner(button, true);

  const query = decodeURIComponent(location.search);
  const id = query.slice(6);

  console.log('Activating');

  const URL = `${API}/transaction/activate/${id}`;
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      toggleButtonSpinner(button, false);
      handleResponse(this);
    }
  };

  xhttp.open("POST", URL, true);
  xhttp.send();
}

document.addEventListener('DOMContentLoaded', a => {
  const button = document.querySelector('button');
  button.addEventListener('click', activateViaPaystack);
});