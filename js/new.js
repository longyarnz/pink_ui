function validatePassword() {
  const password = document.getElementById('pass');
  const confirm = document.getElementById('confirm');

  if (password.value !== confirm.value) {
    confirm.setCustomValidity("Passwords Don't Match");
  } else {
    confirm.setCustomValidity('');
  }
}

function createNewPassword(e) {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true') return;
  const query = decodeURIComponent(window.location.search);
  const id = query.slice(6);

  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);
  const URL = `${API}/auth/reset/${id}`;
  const [ password ] = form;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      const text = JSON.parse(this.responseText);
      const p = document.querySelector('p');
      p.textContent = text;
      p.style.color = this.status < 400 ? '#5cb85c' : '#d9534f';
      toggleButtonSpinner(button, false);
    }
  };
  xhttp.open('POST', URL, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify({
    password: password.value.toLowerCase()
  }));
};

document.addEventListener('DOMContentLoaded', a => {
  localStorage.removeItem('isSubmitting');
  const form = document.querySelector('form');
  const password = document.getElementById('pass');
  const confirmPassword = document.getElementById('confirm');

  password.addEventListener('change', validatePassword);
  confirmPassword.addEventListener('keyup', validatePassword);
  form.addEventListener('submit', createNewPassword);
});