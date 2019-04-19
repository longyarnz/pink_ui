const form = document.getElementsByTagName('form')[0];

function handleResponse(request) {
  const { token, text } = JSON.parse(request.responseText);

  if (!token) {
    const p = document.querySelector('p');
    p.textContent = text;
    p.style.color = '#d9534f';
    return;
  };

  localStorage.removeItem('isSubmitting');
  localStorage.setItem('pinkettu', token);

  if (window.location.search) {
    const query = decodeURIComponent(window.location.search);
    const type = query.slice(1, 5);
    type === 'pink' ? window.location.assign(`/explore.html${query}`)
      : window.location.assign('/profile.html');
  }
  else window.location.assign('/profile.html');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true') return;

  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);
  const URL = `${API}/auth/login`;
  const [email, password] = form;
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status >= 400) {
        redirectToActivation(button);
      }

      else {
        handleResponse(this);
      }
    }
  };
  xhttp.open('POST', URL, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(
    JSON.stringify({
      email: email.value.toLowerCase(),
      password: password.value.toLowerCase()
    })
  );
});

document.addEventListener('DOMContentLoaded', a => {
  localStorage.removeItem('isSubmitting');
});

function redirectToActivation(button) {
  toggleButtonSpinner(button, false);

  const { id, message } = JSON.parse(request.responseText);

  if(id && message){
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
