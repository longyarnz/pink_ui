function validatePassword() {
  const password = document.getElementById("password");
  const confirm_password = document.getElementById("confirm_password");

  if (password.value !== confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
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
  console.log(request.responseText);
}

function submitForm(e) {
  e.preventDefault();
  const URL = 'https://api.pinkettu.com.ng/auth/signup';
  const [username, email, password, , worker, image] = e.target;
  const caption = Date.now().toString().slice(0, 10) + '.' + image.files[0].name;
  sendImageToDatabase(image, caption);

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      handleSubmitResponse(this);
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

const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm_password');
const form = document.getElementsByTagName('form')[0];

password.addEventListener('change', validatePassword);
confirmPassword.addEventListener('keyup', validatePassword);
form.addEventListener('submit', submitForm);