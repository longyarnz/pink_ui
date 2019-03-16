const appIsLive = location.hostname !== '127.0.0.1';
const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';

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

async function deleteUserImage(src) {
  let deletedImage = await fetch(`${API}/profile/deletedImage/${src}`, {
    method: 'DELETE',
    headers: {
      'Authorization': localStorage.pinkettu
    }
  });
  deletedImage = await deletedImage.json();

  if (deletedImage === true) {
    location.assign('/profile.html');
  }
  else if(deletedImage.id){
    location.assign(`/activate.html?user=${deletedImage.id}`);
  }
}

function createGalleryForWorker(profile) {
  const footer = document.querySelector('footer');
  const section = document.createElement('section');
  section.classList.add('container');

  const div = document.createElement('div');
  div.classList.add('show-worker-images');

  const h3 = document.createElement('h3');
  h3.textContent = `PICTURES OF ${profile.username.toUpperCase()}`;

  const gallery = document.createElement('div');
  gallery.classList.add('gallery');

  const tile = src => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = `https://images.pinkettu.com.ng/${src}`;

    const button = document.createElement('button');
    button.addEventListener('click', () => {
      const i = button.querySelector('i');
      i.textContent = 'donut_large';
      i.classList.toggle('fa-spin');
      i.style.animationDuration = '.45s';
      deleteUserImage(src);
    });

    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.textContent = 'close';

    button.appendChild(i);

    div.append(img, button);
    return div;
  }

  const tiles = profile.images.slice(1).map(src => tile(src));
  gallery.append(...tiles);
  div.append(h3, gallery);
  section.appendChild(div);
  document.body.insertBefore(section, footer);
}

async function fetchUserProfile() {
  let profile = await fetch(`${API}/profile`, {
    headers: {
      'Authorization': localStorage.pinkettu
    }
  });
  profile = await profile.json();

  if(profile.id && profile.message){
    location.assign(`/activate.html?user=${profile.id}`);
  }
  else if (profile.message) {
    localStorage.removeItem('pinkettu');
    localStorage.removeItem('pinkettu_user_status');
    location.assign('/login.html');
  }
  else {
    const form = document.querySelector('form');
    const img = document.querySelector('.pic-wrapper img');
    img.src = `https://images.pinkettu.com.ng/${profile.images[0]}`;
    form[0].value = profile.username;
    form[1].value = profile.location;
    localStorage.setItem('pinkettu_user_status', profile.worker);

    if (profile.worker) createAddMoreInput();

    if (profile.images.length > 1) createGalleryForWorker(profile);

    form.addEventListener('submit', e => submitForm(e, profile.worker));
  }
}

if (localStorage.pinkettu) {
  fetchUserProfile();
}

else {
  location.assign('/login.html');
}