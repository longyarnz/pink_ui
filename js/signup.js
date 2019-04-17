function validatePassword() {
  const password = document.getElementById('pass');
  const confirm = document.getElementById('confirm');

  if (password.value !== confirm.value) {
    confirm.setCustomValidity("Passwords Don't Match");
  } else {
    confirm.setCustomValidity('');
  }
}

function handleSubmitResponse(request) {
  const { id, message, token } = JSON.parse(request.responseText);

  if (id || message) {
    window.location.assign(`/activate.html?user=${id}`);
    return;
  }
  if (!token) return;

  localStorage.pinkettu = token;
  window.location.assign('/profile.html');
}

function submitForm(e) {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true') return;

  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);
  const URL = `${API}/auth/signup`;
  const [email, username, password, , location, worker, image] = e.target;
  const caption = Date.now().toString().slice(0, 10) + '.' + image.files[0].name;
  try {
    const feedback = sendImageToDatabase(image, caption);

    feedback.then(res => {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          toggleButtonSpinner(button, false);
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
          location: window.location.value,
          worker: worker.value === 'true',
          image: caption
        })
      );
    });
  }
  catch(err) {
    toggleButtonSpinner(button, false);
  }
}

document.addEventListener('DOMContentLoaded', a => {
  localStorage.removeItem('isSubmitting');
  const password = document.getElementById('pass');
  const confirmPassword = document.getElementById('confirm');
  const form = document.getElementsByTagName('form')[0];

  password.addEventListener('change', validatePassword);
  confirmPassword.addEventListener('keyup', validatePassword);
  form.addEventListener('submit', submitForm);
});