const form = document.getElementsByTagName("form")[0];

const appIsLive = location.hostname !== '127.0.0.1';
const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';

function toggleButtonSpinner(form) {
  const button = form.children.finalSubmit;
  [...button.children].forEach(child => child.classList.toggle('hide'));
}

function handleResponse(request) {
  const { token } = JSON.parse(request.responseText);
  if (!token) return;

  localStorage.setItem('pinkettu', token);
  location.assign('/profile.html');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const URL = `${API}/auth/login`;
  const [email, password] = form;
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      handleResponse(this);
    }
  };

  xhttp.open("POST", URL, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(
    JSON.stringify({
      email: email.value,
      password: password.value
    })
  );
});