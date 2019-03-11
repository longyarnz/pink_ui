const form = document.getElementsByTagName("form")[0];

const appIsLive = location.hostname !== '127.0.0.1';
const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';

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
  location.assign('/profile.html');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if (localStorage.isSubmitting === true) return;
  
  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);
  const URL = `${API}/auth/login`;
  const [email, password] = form;
  const xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      toggleButtonSpinner(button, false);
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
  
  document.addEventListener('DOMContentLoaded', a => {
    localStorage.removeItem('isSubmitting');
  });