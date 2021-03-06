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
  const {email, username, phone, password, orientation, location, worker, image} = e.target.elements;
  const file = image.files[0];
  const ext = file.name.split('.').pop();
  const alpha = 'JKHIHGFKUEIUFISHDFSHKDKPOWPCMZAXQYWIOZLBKDKSGKFBSDKFKJDFVKABNKJNNSOOJPAOISHDOSA'.toLowerCase();
  const random = i => Math.ceil(Math.random() * i);
  const caption = `${alpha.charAt(random(78))}${alpha.charAt(random(78))}${random(999999)}.${ext}`;

  try {
    const feedback = sendImageToDatabase(file, caption);
    feedback.then(() => {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status >= 400) {
            // alert(this.responseText);
            const { id, message, email } = JSON.parse(this.responseText);

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
          orientation: orientation.value,
          password: password.value.toLowerCase(),
          location: location.value,
          worker: worker.value === 'true',
          image: caption
        })
      );
    });
  }
  catch (err) {
    // alert(JSON.stringify(err));
    toggleButtonSpinner(button, false);
  }
}

document.addEventListener('DOMContentLoaded', a => {
  localStorage.removeItem('isSubmitting');
  const password = document.getElementById('pass');
  const confirmPassword = document.getElementById('confirm');
  const form = document.querySelector('form');

  password.addEventListener('change', validatePassword);
  confirmPassword.addEventListener('keyup', validatePassword);
  form.addEventListener('submit', submitForm);
});