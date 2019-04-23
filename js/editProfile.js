function handleSubmitResponse(request, button) {
  const { message } = JSON.parse(request.responseText);
  if (message === 'Invalid User') {
    localStorage.removeItem('pinkettu');
    window.location.assign('/login.html');
    toggleButtonSpinner(button, false);
    return;
  }

  else {
    toggleButtonSpinner(button, false);
    window.location.assign('/profile.html');
  }
}

function submitForm(e, worker) {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true') return;

  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);

  const URL = `${API}/profile`;

  let caption, feedback, body, files = [];
  const { username, phone, hour, night, week, location, image, more } = e.target.elements;

  const rates = hour && night && week
    ? [parseInt(hour.value), parseInt(night.value), parseInt(week.value)]
    : [];

  body = {
    username: username.value,
    phone: phone.value,
    location: location.value,
    rates,
    image: [],
    more: []
  }

  function storeImage(image, cache) {
    const ext = image.name.split('.').pop();
    const alpha = 'JKHIHGFKUEIUFISHDFSHKDKPOWPCMZAXQYWIOZLBKDKSGKFBSDKFKJDFVKABNKJNNSOOJPAOISHDOSA'.toLowerCase();
    const random = i => Math.ceil(Math.random() * i);
    const caption = `${alpha.charAt(random(78))}${alpha.charAt(random(78))}${random(999999)}.${ext}`;
    cache.push(caption);
    feedback = sendImageToDatabase(image, caption);
    files.push(feedback);
  }

  if (image.files.length > 0) {
    storeImage(image.files[0], body.image);
  }

  if (worker && more.files.length > 0) {
    for (let i = 0; i < more.files.length; i++) {
      const file = more.files[i];
      storeImage(file, body.more);
    }
  }

  Promise.all(files).then(() => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 400) {
          const span = button.children[0];
          span.textContent = 'Network Error';
          button.style.backgroundColor = '#d9534f';
          toggleButtonSpinner(button, false);
          setTimeout(() => {
            span.textContent = 'Edit Profile';
            button.style.backgroundColor = '#f69';
          }, 5000);
        }
        else handleSubmitResponse(this, button);
      }
    };
    xhttp.open('PUT', URL, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', localStorage.pinkettu);
    xhttp.send(JSON.stringify(body));
  });
}
