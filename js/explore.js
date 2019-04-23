const query = decodeURIComponent(window.location.search);

if (window.location.search !== '') {
  document.addEventListener('DOMContentLoaded', loadUserProfile);
}

else {
  window.location.assign('/pinks.html');
}

async function hookupViaPaystack(button, worker, cost) {
  if (localStorage.isSubmitting === 'true') return;

  toggleButtonSpinner(button, true);
  let URL = `${API}/hookup`;
  const client = localStorage.getItem('pinkettu_user_id');

  try {
    await createHookUp(cost);
  }

  catch (err) {
    // alert(err);
    const text = button.children[0].textContent;
    button.children[0].textContent = 'Network Error';
    setTimeout(() => {
      toggleButtonSpinner(button, false);
      button.children[0].textContent = text;
    }, 5000);
  }

  async function createHookUp(cost) {
    let hookup = await fetch(URL, {
      method: 'POST',
      headers: {
        'Authorization': localStorage.pinkettu,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ worker, cost })
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
      await initiateTransaction(hookup, cost);
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

      if (verify.status >= 400) {
        const up = await verify.json();
        throw up;
      }

      else {
        window.location.assign('/hookups.html');
      }
    }
    catch (err) {
      // alert(err);
      button.children[0].textContent = 'Network Error';
      localStorage.removeItem('isSubmitting');
    }
  }

  async function initiateTransaction(hookup, cost) {
    const { id } = hookup;
    const URL = `${API}/transaction`;
    const button = document.querySelector(`[data-rate='${cost}']`);
    // alert(cost);
    try {
      let transaction = await fetch(URL, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.pinkettu,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cost, client, hookup: id, purpose: 'Hook Up'
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
          amount: cost * 100,
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
      // alert(err);
      toggleButtonSpinner(button, false);
    }
  }
}

function parseMoney(number) {
  number = number.toString().split('').reverse();
  for (let i = 0; i < number.length; i++)
    if (i % 3 === 0 && i !== 0) number[i] += ', ';
  number = number.reverse().join('');
  return number;
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
  fourthSpan.textContent = profile.location || 'Lagos';

  const code = document.createElement('code');
  code.textContent = profile.emailIsVerified ? 'verified' : 'not verified';
  code.style.color = profile.emailIsVerified ? '#5cb85c' : '#d9534f';

  let seeMore = document.createElement('div');

  const workerStatus = localStorage.getItem('pinkettu_user_status');
  if (workerStatus !== 'true' && profile.worker) {
    seeMore.classList.add('rates-container');
    const charge = ['An Hour', 'A Night', 'The Weekend'];
    const rates = profile.rates || [0, 0, 0];
    rates.forEach((rate, i) => {
      const html = `
        <div class="see-more" data-rate="${rate}">
          <b>Hook Up For ${charge[i]} @ ₦${parseMoney(rate)}</b>
          <i class="fa-spin hide">donut_large</i>
        </div>
      `;
      seeMore.insertAdjacentHTML('beforeend', html);
      seeMore.lastElementChild.onclick = e => {
        if (localStorage.getItem('pinkettu')) {
          const buttons = Array.from(seeMore.children)
            .filter(i => parseInt(i.getAttribute('data-rate')) === rate);
          hookupViaPaystack(buttons[0], workerId, rate);
        }
        else {
          window.location.assign(`/login.html${query}`);
          localStorage.removeItem('pinkettu');
        }
      }
    });
  }
  else seeMore = '';

  const gallery = document.createElement('div');
  gallery.classList.add('gallery');
  gallery.append(...profile.images.map(src => {
    const img = html(`
      <div>
        <img src="https://images.pinkettu.com.ng/${src}">
      </div>
    `);
    return img;
  }));

  thirdSpan.appendChild(i);
  h3.append(firstSpan);
  div.append(thirdSpan, fourthSpan, code);
  header.append(div, seeMore);

  const parent = document.createElement('div');
  parent.className = 'show-worker-images';
  parent.append(h3, header, gallery);

  const section = document.querySelector('section.container');
  section.replaceChild(parent, section.lastElementChild);
}

function loadUserProfile() {
  const userType = query.match(/pink/) ? 'pink'
  : query.match(/client/) ? 'client' : '';
  const id = userType === 'pink' ? query.slice(6) : query.slice(8);

  if (userType === '') {
    window.history.back();
    return;
  }

  fetchAPink(id, userType, profile => {
    if (profile && (profile.username || profile.images)) {
      createPinkProfile(profile, id);
    }
    else window.history.back();
  });
}