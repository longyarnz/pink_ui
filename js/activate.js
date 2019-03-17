const appIsLive = location.hostname !== '127.0.0.1';
const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';
const publicKey = 'pk_test_99aefb07d699525e9eed76be0cbe03fda6ad0ff6';
const query = decodeURIComponent(location.search);
const id = query.slice(6);
let button;

function handlePaymentResponse(response) {
  response.id = id;
  const URL = `${API}/transaction/verify`;
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      toggleButtonSpinner(button, false);
      const text = JSON.parse(this.responseText);
      if (text === 'Activation is Verified') {
        location.assign('/login.html');
      }
    }
    else if (this.readyState === 4 && this.status === 400){
      const p = document.querySelector('#signup-main > div > p');
      p.textContent = 'Account Activation Failed';
      p.style.color = '#d9534f';
      p.style.fontWeight = '900';
    }
  };
  
  xhttp.open("POST", URL, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(response));
}

function handleActivationResponse(request) {
  const { id, user, message, status } = JSON.parse(request.responseText);
  localStorage.removeItem('isSubmitting');
  
  if (message) location.assign('/login.html');

  else if (status) {
    const p = document.querySelector('#signup-main > div > p');
    p.textContent = status;
    p.style.color = '#5cb85c';
    p.style.fontWeight = '900';
    toggleButtonSpinner(button, false);
  }
  
  else if (id && user) {
    const paystack = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: 100000,
      ref: id,
      callback: handlePaymentResponse,
      onClose: () => console.log('Payment Closed'),
      currency: 'NGN'
    });
    paystack.openIframe();
  }
}

function activateViaPaystack() {
  if (localStorage.isSubmitting === 'true') return;

  toggleButtonSpinner(button, true);

  const URL = `${API}/transaction/activate/${id}`;
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      handleActivationResponse(this);
    }
  };

  xhttp.open("POST", URL, true);
  xhttp.send();
}

document.addEventListener('DOMContentLoaded', a => {
  button = document.querySelector('button');
  button.addEventListener('click', activateViaPaystack);
});