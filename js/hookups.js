function createHookupTable(hookup) {
  const userIsAWorker = localStorage.pinkettu_user_status === 'true';

  const div = document.createElement('div');
  div.classList.add('tab');

  const firstSpan = userIsAWorker
    ? html(`
      <div>
        <span>${hookup.client.username}</span>
        <a href="explore.html?client=${hookup.client._id}"><span>view profile</span></a>
      </div>
    `) : html(`
      <div>
        <span>${hookup.worker.username}</span>
        <a href="explore.html?pink=${hookup.worker._id}"><span>view profile</span></a>
      </div>
    `);

  const secondSpan = html(`
    <div>
      <span>Hook-Up Code </span>
      <span>${hookup.randomKey}</span>
    </div>
  `);
  
  const completedSpan = document.createElement('div');
  completedSpan.classList.add('completed');
  completedSpan.textContent = 'completed';

  const pendingSpan = document.createElement('div');
  pendingSpan.classList.add('pending');
  pendingSpan.textContent = 'pending';

  const inputSpan = document.createElement('div');
  const placeholder = userIsAWorker ? `Client's Secret Code` : `Pink's Secret Code`;
  inputSpan.innerHTML = `
    <input id="secret-code" type="text" placeholder="${placeholder}" maxlength="15" />
    <button>VERIFY</button>
  `;

  inputSpan.children[1].onclick = function (e) {
    e.preventDefault();
    completeHookup(hookup._id, e.target);
  }

  let thirdSpan;

  if (hookup.clientHasVerified && hookup.workerHasVerified) {
    thirdSpan = completedSpan;
  }
  else if (userIsAWorker && !hookup.clientHasVerified && hookup.workerHasVerified) {
    thirdSpan = pendingSpan;
  }
  else if (!userIsAWorker && hookup.clientHasVerified && !hookup.workerHasVerified) {
    thirdSpan = pendingSpan;
  }
  else thirdSpan = inputSpan;

  div.append(firstSpan, secondSpan, thirdSpan);
  return div;
}

async function completeHookup(id, button) {
  const code = button.previousElementSibling.value;
  if (button.textContent === 'CHECKING...' || code === '' || !code) return;
  button.textContent = 'CHECKING...';

  try {
    let hookup = await fetch(`${API}/hookup/${id}/${code}`, {
      method: 'PUT',
      headers: {
        'Authorization': localStorage.pinkettu
      }
    });
    hookup = await hookup.json();

    if (hookup.message === 'Invalid User') {
      window.location.assign('/login.html');
      return;
    }

    else if (Array.isArray(hookup)) {
      const span = button.parentElement;

      if (hookup[0] && hookup[1]) {
        span.innerHTML = 'completed';
        span.classList.add('completed');
      }
      else if (!hookup[0]) {
        button.textContent = 'WRONG CODE';
        button.style.backgroundColor = '#d9534f'
        setTimeout(() => {
          button.textContent = 'VERIFY';
          button.style.backgroundColor = ''
        }, 5000);
      }
      else if (hookup[0] && !hookup[1]) {
        span.innerHTML = 'PENDING';
        span.classList.add('pending');
      }
    }
  }

  catch (err) {
    alert(err);
    button.textContent = 'VERIFY';
  }
}

async function fetchUserHookups() {
  try {
    let hookups = await fetch(`${API}/hookup`, {
      headers: {
        'Authorization': localStorage.pinkettu
      }
    });
    hookups = await hookups.json();

    if (hookups.message) {
      localStorage.removeItem('pinkettu');
      localStorage.removeItem('pinkettu_user_status');
      window.location.assign('/login.html');
    }

    else {
      const main = document.createElement('main');

      if (hookups.length === 0) {
        main.innerHTML = `
          <h2>
            You do not have any hook ups yet.
          </h2>

          <h1>0</h1>
        `;
        main.classList.add('empty');
      }
      else {
        const tabs = hookups.reverse().map(hookup => createHookupTable(hookup));
        main.append(...tabs);
      }
      document.querySelector('main').replaceWith(main);
    }
  }

  catch (err) {
    alert(err);
    localStorage.removeItem('isSubmitting');
  }
}

if (localStorage.pinkettu) {
  fetchUserHookups();
}

else {
  localStorage.removeItem('pinkettu');
  window.location.assign('/login.html');
}