function validatePassword() {
  const password = document.getElementById('pass');
  const confirm = document.getElementById('confirm');

  if (password.value !== confirm.value) {
    confirm.setCustomValidity("Passwords Don't Match");
  } else {
    confirm.setCustomValidity('');
  }
}

function sendImageToDatabase(file, filename) {
  const form = new FormData();
  form.append('File', file.files[0]);
  form.append('Filename', filename);
  fetch('https://images.pinkettu.com.ng/upload.php', {
    method: 'POST',
    body: form
  }).then(res => console.log(res));
}

function handleSubmitResponse(request) {
  const { token } = JSON.parse(request.responseText);
  if(!token) return;
  
  localStorage.pinkettu = token;
  location.href = '/profile.html';
}

function toggleButtonSpinner(form) {
  const button = form.children.finalSubmit;
  [...button.children].forEach(child => child.classList.toggle('hide'));
}

function submitForm(e) {
  e.preventDefault();
  toggleButtonSpinner(e.target);
  const appIsLive = location.hostname !== '127.0.0.1';
  const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';
  const URL = `${API}/auth/signup`;
  const [username, email, password, , worker, image] = e.target;
  const caption = Date.now().toString().slice(0, 10) + '.' + image.files[0].name;
  sendImageToDatabase(image, caption);

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      handleSubmitResponse(this);
      toggleButtonSpinner(e.target);
    }
  };
  xhttp.open("POST", URL, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(
    JSON.stringify({
      username: username.value,
      email: email.value,
      password: password.value,
      worker: Boolean(worker.value),
      image: caption
    })
  );
}

document.addEventListener('DOMContentLoaded', a => {
  const password = document.getElementById('pass');
  const confirmPassword = document.getElementById('confirm');
  const form = document.getElementsByTagName('form')[0];

  password.addEventListener('change', validatePassword);
  confirmPassword.addEventListener('keyup', validatePassword);
  form.addEventListener('submit', submitForm);
});