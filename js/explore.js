const query = decodeURIComponent(window.location.search);

if (window.location.search !== '') {
  document.addEventListener('DOMContentLoaded', loadUserProfile);
}

else {
  window.location.assign('/pinks.html');
}

async function hookupViaPaystack(button, worker) {
  if (localStorage.isSubmitting === 'true') return;

  toggleButtonSpinner(button, true);
  let URL = `${API}/hookup`;
  const client = localStorage.getItem('pinkettu_user_id');

  try {
    await createHookUp();
  }

  catch (err) {
    const text = button.textContent;
    button.textContent = 'Network Error';
    setTimeout(() => {
      toggleButtonSpinner(button, false);
      button.textContent = text;
    }, 5000);
  }

  async function createHookUp() {
    let hookup = await fetch(URL, {
      method: 'POST',
      headers: {
        'Authorization': localStorage.pinkettu,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ worker })
    });

    hookup = await hookup.json();

    if (hookup.message === 'Invalid User') {
      window.location.assign(`/login.html${query}`);
      localStorage.removeItem('pinkettu');
      localStorage.removeItem('isSubmitting');
    }

    else if (hookup.message) {
      throw '';
    }

    else {
      await initiateTransaction(hookup);
    }
  }
  
  async function verifyPayment(response, button) {
    response.id = worker;
    [...button.children].forEach(child => child.classList.toggle('hide'));
    button.children[0].textContent = 'Verifying...';
    const URL = `${API}/transaction/verify/hookup`;
    try {
      let verify = await fetch(URL, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.pinkettu,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response)
      });
      
      if (verify.status >= 400) throw '';
      
      else {
        window.location.assign('/hookups.html');
      }
    }
    catch (err) {
      console.log(err);
      button[0].textContent = 'Network Error';
      localStorage.removeItem('isSubmitting');
    }
  }
  
  async function initiateTransaction(hookup) {
    const { id } = hookup;
    const URL = `${API}/transaction`;
    const button = document.querySelector('section.container > div > header > div.see-more');
    try {
      let transaction = await fetch(URL, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.pinkettu,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 10000, client, hookup: id, purpose: 'Hook Up'
        })
      });

      if (transaction.status >= 400) {
        throw '';
      }

      else {
        transaction = await transaction.json();
        const paystack = window.PaystackPop.setup({
          key: publicKey,
          email: transaction.user.email,
          amount: 1000000,
          ref: id,
          callback: response => verifyPayment(response, button),
          onClose: () => {
            console.log('Payment Closed');
            toggleButtonSpinner(button, false);
          },
          currency: 'NGN'
        });
        paystack.openIframe();
      }
    }
    catch (err) {
      console.log(err);
      toggleButtonSpinner(button, false);
    }
  }
}

function createPinkProfile(profile, workerId) {
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

  let seeMore = '';

  if (localStorage.getItem('pinkettu_user_status') !== 'true') {
    seeMore = document.createElement('div');
    seeMore.innerHTML = `
      <b>HOOK UP FOR ₦10, 000</b>
      <i class="fa-spin hide">donut_large</i>
    `;
    seeMore.classList.add('see-more');

    seeMore.onclick = () => {
      if (localStorage.getItem('pinkettu')) {
        hookupViaPaystack(seeMore, workerId);
      }

      else {
        window.location.assign(`/login.html${query}`);
        localStorage.removeItem('pinkettu');
      }
    }
  }

  const gallery = document.createElement('div');
  gallery.classList.add('gallery');
  gallery.append(...profile.images.map(src => {
    const img = document.createElement('img');
    img.src = `https://images.pinkettu.com.ng/${src}`;
    return img;
  }));

  thirdSpan.appendChild(i);
  h3.append(firstSpan);
  div.append(thirdSpan, fourthSpan);
  header.append(div, seeMore);

  const parent = document.createElement('div');
  parent.className = 'show-worker-images';
  parent.append(h3, header, gallery);

  const section = document.querySelector('section.container');
  section.replaceChild(parent, section.lastElementChild);
}

function loadUserProfile() {
  let _profile = null;
  const id = query.slice(6);

  if (localStorage.pinkettu_pinks) {
    const profiles = JSON.parse(localStorage.pinkettu_pinks);
    _profile = profiles.find(i => i._id.toString() === id);
  }

  if (_profile === null) {
    fetchAPink(id, ([profile]) => {
      if (profile.username || profile.rank || profile.images) {
        _profile = profile;
      }
    });
  }

  createPinkProfile(_profile, id);
}