function createHookupTable(hookup) {
  const userIsAWorker = localStorage.pinkettu_user_status === 'true';

  const div = document.createElement('div');
  div.classList.add('tab');

  const firstSpan = document.createElement('span');
  firstSpan.textContent = userIsAWorker
    ? `Client: ${hookup.client.username}`
    : `Pink: ${hookup.worker.username}`;

  const secondSpan = document.createElement('span');
  secondSpan.textContent = `Hook-Up Code: ${hookup.randomKey}`;

  const completedSpan = document.createElement('span');
  completedSpan.classList.add('completed');
  completedSpan.textContent = 'completed';

  const pendingSpan = document.createElement('span');
  pendingSpan.classList.add('pending');
  pendingSpan.textContent = 'pending';

  const inputSpan = document.createElement('span');
  inputSpan.innerHTML = `
    <input id="secret-code" type="text" placeholder="Secret Code" maxlength="15" />
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
  console.log(id);
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
        button.textContent = 'VERIFY';
      }
      else if (hookup[0] && !hookup[1]) {
        span.innerHTML = 'PENDING';
        span.classList.add('pending');
      }
    }
  }

  catch (err) {
    console.log(err);
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

          <h1>😊</h1>
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
    console.log(err);
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