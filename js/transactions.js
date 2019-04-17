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

  let thirdSpan = '';

  if (!userIsAWorker) {
    thirdSpan = document.createElement('span');
    thirdSpan.id = 'rank';
    thirdSpan.classList.add('rank');
    const fourthSpan = document.createElement('span');
    fourthSpan.textContent = 'Rank Your Pink Xperience';
    const fifthSpan = rankProfile(hookup.rank, rank => console.log(rank));
    thirdSpan.append(fourthSpan, fifthSpan);
  }

  const small = document.createElement('small');
  hookup.completed && small.classList.add('completed');
  small.style.flex = userIsAWorker ? 1 : null;
  small.textContent = hookup.completed ? 'completed' : 'pending';

  div.append(firstSpan, secondSpan, thirdSpan, small);
  return div;
}

async function fetchUserHookups() {
  const appIsLive = window.location.hostname !== '127.0.0.1';
  const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';
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
    if(hookups.length === 0) return;
    
    const tabs = hookups.map(hookup => createHookupTable(hookup));
    const main = document.createElement('main');
    main.append(...tabs);
    document.querySelector('main').replaceWith(main);
  }
}

if (localStorage.pinkettu) {
  fetchUserHookups();
}

else {
  localStorage.removeItem('pinkettu');
  window.location.assign('/login.html');
}