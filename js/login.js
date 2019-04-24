function handleResponse(request) {
  const { token, text, worker } = JSON.parse(request.responseText);

  if (!token) {
    const p = document.querySelector('p');
    p.textContent = text;
    p.style.color = '#d9534f';
    const button = document.querySelector('button');
    toggleButtonSpinner(button, false);
    return;
  };

  localStorage.removeItem('isSubmitting');
  localStorage.setItem('pinkettu', token);
  localStorage.setItem('pinkettu_user_status', worker);

  if (window.location.search) {
    const query = decodeURIComponent(window.location.search);
    const type = query.slice(1, 5);
    type === 'pink' ? window.location.assign(`/explore.html${query}`)
      : window.location.assign('/profile.html');
  }
  else window.location.assign('/profile.html');
}

function redirectToActivation(request, button) {
  toggleButtonSpinner(button, false);
  // alert(request.responseText);
  const { id, message, email } = JSON.parse(request.responseText);

  if (id && message && email) {
    localStorage.setItem('activate_email', email);
    window.location.assign(`/activate.html?user=${id}`);
    return;
  }

  const p = document.querySelector('#signup-main > div > p');
  const { color, fontWeight } = p.style;
  p.textContent = 'Network Error';
  p.style.color = '#d9534f';
  p.style.fontWeight = '900';
  setTimeout(() => {
    p.textContent = 'Login In To Your Account';
    p.style.color = color;
    p.style.fontWeight = fontWeight;
  }, 5000);
}

function loginUserIn(e) {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true')
    return;
  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);
  const URL = `${API}/auth/login`;
  const [email, password] = form;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status >= 400) {
        redirectToActivation(this, button);
      }
      else {
        handleResponse(this);
      }
    }
  };
  xhttp.open('POST', URL, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify({
    email: email.value.toLowerCase(),
    password: password.value.toLowerCase()
  }));
};

document.addEventListener('DOMContentLoaded', a => {
  localStorage.removeItem('isSubmitting');
  const form = document.querySelector('form');
  form.addEventListener('submit', loginUserIn);
});