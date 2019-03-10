if (location.search !== '') {
  document.addEventListener('DOMContentLoaded', loadUserProfile);
}

else {
  location.assign('/pinks');
}

function createPinkProfile(profile) {
  const h3 = document.createElement('h3');
  const firstSpan = document.createElement('span');
  firstSpan.textContent = profile.username;

  const header = document.createElement('header');
  const div = document.createElement('div');

  const thirdSpan = document.createElement('span');
  const i = document.createElement('i');
  i.classList.add('material-icons');
  i.textContent = 'near_me';

  const fourthSpan = document.createElement('span');
  fourthSpan.textContent = profile.location || 'Lagos Mainland';

  const fifthSpan = rankProfile(profile.rank);

  const seeMore = document.createElement('div');
  seeMore.classList.add('see-more');
  seeMore.textContent = 'HOOK UP FOR ₦10, 000';

  const gallery = document.createElement('div');
  gallery.classList.add('gallery');
  gallery.append(...profile.images.map(src => {
    const img = document.createElement('img');
    img.src = `https://images.pinkettu.com.ng/${src}`;
    return img;
  }));

  thirdSpan.appendChild(i);
  h3.append(firstSpan);
  div.append(thirdSpan, fourthSpan, fifthSpan);
  header.append(div, seeMore);

  const parent = document.createElement('div');
  parent.className = 'show-worker-images';
  parent.append(h3, header, gallery);

  const section = document.querySelector('section.container');
  section.replaceChild(parent, section.lastElementChild);
}

function loadUserProfile() {
  let _profile = null;
  const query = decodeURIComponent(location.search);
  const id = query.slice(6);

  if (localStorage.pinkettu_pinks) {
    const profiles = JSON.parse(localStorage.pinkettu_pinks);
    _profile = profiles.find(i => i._id.toString() === id);
  }

  if(_profile === null) {
    fetchAPink(id, ([profile]) => {
      if (profile.username || profile.rank || profile.images) {
        _profile = profile;
      }
    });
  }
  
  createPinkProfile(_profile);
}