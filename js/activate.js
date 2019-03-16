const appIsLive = location.hostname !== '127.0.0.1';
const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';
const publicKey = '';

function handleResponse(request) {
  const { _id, user } = JSON.parse(request.responseText);

  localStorage.removeItem('isSubmitting');

  const paystack = window.PaystackPop.setup({
    key: publicKey,
    email: user.email,
    amount: 1000,
    ref: _id,
    callback: res => console.log("Payment Completed"),
    onClose: () => console.log("Payment Closed"),
    currency: "NGN"
  });
  paystack.openIframe();
}

function activateViaPaystack() {
  if (localStorage.isSubmitting === true) return;

  const button = document.querySelector('button');
  toggleButtonSpinner(button, true);

  const query = decodeURIComponent(location.search);
  const id = query.slice(6);

  console.log('Activating');

  const URL = `${API}/transaction/activate/${id}`;
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
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