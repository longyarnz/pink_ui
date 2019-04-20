function handleSubmitResponse(request, button) {
  const { message } = JSON.parse(request.responseText);
  if (message === 'Invalid User') {
    localStorage.removeItem('pinkettu');
    window.location.assign('/login.html');
    toggleButtonSpinner(button, false);
    return;
  }
  
  toggleButtonSpinner(button, false);
  window.location.assign('/profile.html');
}

function submitForm(e, worker) {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true') return;

  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);

  const URL = `${API}/profile`;

  let caption, feedback, body, files = []; 
  const [name, phone, hour, night, week, location, image, more] = e.target;

  body = {
    username: name.value,
    phone: phone.value,
    location: location.value,
    rates: [parseInt(hour.value), parseInt(night.value), parseInt(week.value)],
    image: [],
    more: []
  }

  function storeImage(image, cache) {
    const rand = Math.floor(Math.random() * 100);
    const sanitizedName = image.name.replace(/\s/i, '.');
    caption = `${rand}.${sanitizedName}`;
    cache.push(caption);
    feedback = sendImagesToDatabase(image, caption);
    files.push(feedback);
  }

  if(image.files.length > 0){
    storeImage(image.files[0], body.image);
  }
  
  if(worker && more.files.length > 0){
    for (let i = 0; i < more.files.length; i++) {
      const file = more.files[i];
      storeImage(file, body.more);
    }
  }
  
  Promise.all(files).then(() => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        handleSubmitResponse(this, button);
      }
    };
    xhttp.open('PUT', URL, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', localStorage.pinkettu);
    xhttp.send(JSON.stringify(body));
  });
}
