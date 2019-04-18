function createHookupTable(hookup) {
  const userIsAWorker = localStorage.pinkettu_user_status === 'true';

  const div = document.createElement('div');
  div.classList.add('tab');

  const firstSpan = document.createElement('span');
  firstSpan.textContent = userIsAWorker
    ? `Client: ${hookup.client.username}`
    : `Pink: ${hookup.worker.username}`;

  const secondSpan = document.createElement('span');
  secondSpan.textContent = `Code: ${hookup.randomKey}`;

  const button = document.createElement('button');
  hookup.completed && button.classList.add('completed');
  button.style.flex = userIsAWorker ? 1 : null;
  button.textContent = hookup.completed ? 'completed' : 'pending';
  button.onclick = !userIsAWorker ? () => completeHookup(hookup._id, button) : null;

  div.append(firstSpan, secondSpan, button);
  return div;
}

async function completeHookup(id, button) {
  button.textContent = 'completing';
  toggleButtonSpinner(button, true);
  try {
    let hookup = await fetch(`${API}/hookup/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': localStorage.pinkettu
      }
    });
    hookup = await hookup.json();
    hookup && toggleButtonSpinner(button, false);

    if(hookup.message === 'Invalid User') {
      window.location.assign('/login.html');
      return;
    }

    if (hookup.message) {
      button.textContent = 'pending';
    }

    if (hookup.completed === 'Hookup is completed') {
      button.textContent = 'completed';
      button.classList.add('completed');
    }
  }
  
  catch (err) {
    console.log(err);
    localStorage.removeItem('isSubmitting');
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
      if (hookups.length === 0) return;

      const tabs = hookups.reverse().map(hookup => createHookupTable(hookup));
      const main = document.createElement('main');
      main.append(...tabs);
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