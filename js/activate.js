const query = decodeURIComponent(window.location.search);
const id = query.slice(6);
let button;

function handlePaymentResponse(response) {
  response.id = id;
  const URL = `${API}/transaction/verify/account`;
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    const p = document.querySelector('#signup-main > div > p');
    if (this.readyState === 4 && this.status < 400) {
      p.style.fontWeight = '900';
      p.textContent = 'Account Activation Completed';
      p.style.color = '#5cb85c';
      localStorage.removeItem('pinkettu');
      window.location.assign('/login.html');
    }
    else if (this.readyState === 4 && this.status >= 400) {
      const text = JSON.parse(this.responseText);
      p.textContent = text;
      p.style.color = '#d9534f';
      toggleButtonSpinner(button, false);
    }
  };

  xhttp.open("POST", URL, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(response));
}

function handleActivationResponse(request, button) {
  const { id, user, status } = JSON.parse(request.responseText);
  localStorage.removeItem('isSubmitting');

  if (status) {
    const p = document.querySelector('#signup-main > div > p');
    p.textContent = status;
    p.style.color = '#5cb85c';
    p.style.fontWeight = '900';
    toggleButtonSpinner(button, false);
  }

  else if (id && user) {
    // handlePaymentResponse({ reference: id, id: user._id });
    const paystack = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: 100000,
      ref: id,
      callback: handlePaymentResponse,
      onClose: () => toggleButtonSpinner(button, false),
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
      if (this.status >= 400) {
        const text = JSON.parse(this.responseText);
        const p = document.querySelector('#signup-main > div > p');
        const { color, fontWeight } = p.style;
        p.textContent = text;
        p.style.color = '#d9534f';
        p.style.fontWeight = '900';
        setTimeout(() => {
          const email = localStorage.getItem('activate_email');
          p.textContent = '';
          p.innerHTML = `Check your mailbox <code>${email}</code> and verify your email before you activate your account.`;
          p.style.color = color;
          p.style.fontWeight = fontWeight;
        }, 5000);
        toggleButtonSpinner(button, false);
      }
      else {
        handleActivationResponse(this, button);
      }
    }
  };

  xhttp.open("POST", URL, true);
  xhttp.send();
}

document.addEventListener('DOMContentLoaded', a => {
  button = document.querySelector('button');
  button.addEventListener('click', activateViaPaystack);
  document.querySelector('code').textContent = localStorage.getItem('activate_email');
});