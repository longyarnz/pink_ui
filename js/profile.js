function createAddMoreInput() {
  const form = document.querySelector('form');
  const label = document.querySelector('label[for="profile"]').cloneNode();
  const fileInput = document.querySelector('input[type="file"]').cloneNode();

  label.htmlFor = 'add-more';
  label.textContent = 'Add More Images To Attract Clients';

  fileInput.id = 'add-more';
  fileInput.name = 'more';
  fileInput.multiple = true;
  fileInput.placeholder = 'Select as many as you want';

  form.insertBefore(label, form.children.finalSubmit);
  form.insertBefore(fileInput, form.children.finalSubmit);

}

function createGalleryForWorker() {
  const footer = document.querySelector('footer');
  const section = document.createElement('section');
  section.classList.add('container');

  const div = document.createElement('div');
  div.classList.add('show-worker-images');

  const h3 = document.createElement('h3');
  h3.textContent = `MORE IMAGES OF ${profile.username.toUpperCase()}`;

  const gallery = document.createElement('div');
  gallery.classList.add('gallery');

  const tile = src => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = `https://images.pinkettu.com.ng/${src}`;
    const button = document.createElement('button');
    button.textContent = 'DELETE';
    div.append(img, button);
    return div;
  }

  const tiles = profile.images.slice(1).map(src => tile(src));
  gallery.append(...tiles);
  div.append(h3, gallery);
  section.appendChild(div);
  document.insertBefore(section, footer);
}

async function fetchUserProfile() {
  const appIsLive = location.hostname !== '127.0.0.1';
  const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';
  let profile = await fetch(`${API}/profile`, {
    headers: {
      'Authorization': localStorage.pinkettu
    }
  });
  profile = await profile.json();

  if (profile.message) {
    localStorage.removeItem('pinkettu');
    location.href = '/signup.html';
  }
  else {
    const form = document.querySelector('form');
    const img = document.querySelector('.pic-wrapper img');
    img.src = `https://images.pinkettu.com.ng/${profile.images[0]}`;
    form[0].value = profile.username;
    form[1].value = profile.worker;

    if (profile.worker) createAddMoreInput();

    if (profile.images.length > 1) createGalleryForWorker();
  }
}

if (localStorage.pinkettu) {
  fetchUserProfile();
}
else {
  location.href = '/';
}