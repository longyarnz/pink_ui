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
  const [email, username, phone, password, , location, worker, image] = e.target;
  const caption = Date.now().toString().slice(0, 10) + '.' + image.files[0].name;
  console.log(phone.value);

  try {
    // const feedback = sendImageToDatabase(image, caption);
    // feedback.then(() => {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status >= 400) {
            const { id, message } = JSON.parse(this.responseText);

            if (id && message) {
              window.location.assign(`/activate.html?user=${id}`);
              return;
            }

            const p = document.querySelector('#signup-main > div > p');
            const { color, fontWeight } = p.style;
            p.textContent = 'Network Error';
            p.style.color = '#d9534f';
            p.style.fontWeight = '900';
            
            setTimeout(() => {
              p.textContent = 'Create Your Account';
              p.style.color = color;
              p.style.fontWeight = fontWeight;
            }, 5000);

            toggleButtonSpinner(button, false);
          }

          else {
            handleSubmitResponse(this);
          }
        }
      };
      xhttp.open("POST", URL, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(
        JSON.stringify({
          username: username.value.toLowerCase(),
          email: email.value.toLowerCase(),
          phone: phone.value,
          password: password.value,
          location: location.value,
          worker: worker.value === 'true',
          image: caption
        })
      );
    // });
  }
  catch (err) {
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