function handleSubmitResponse(request) {
  const { message } = JSON.parse(request.responseText);
  if (message === 'Invalid User') {
    location.assign('/login.html');
    return;
  }

  localStorage.removeItem('isSubmitting');
  location.assign('/profile.html');
}

function submitForm(e, worker) {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true') return;

  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);

  const appIsLive = window.location.hostname !== '127.0.0.1';
  const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';
  const URL = `${API}/profile`;

  let caption, feedback, body, files = []; 
  const [name, location, image, more] = e.target;

  body = {
    username: name.value,
    location: location.value,
    image: [],
    more: []
  }

  function storeImage(image, cache) {
    const rand = Math.floor(Math.random() * 100000);
    const sanitizedName = name.value.replace(/\s/i, '.');
    const ext = image.name.split('.').reverse()[0];
    caption = `${rand}.${sanitizedName}.${ext}`;
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
        handleSubmitResponse(this);
        toggleButtonSpinner(button, false);
      }
    };
    xhttp.open('PUT', URL, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', localStorage.pinkettu);
    xhttp.send(JSON.stringify(body));
  });
}
