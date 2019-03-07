const toggleNavMenu = () => {
  const menu = document.querySelector('section.nav-menu');
  menu.classList.toggle('show');
  document.body.classList.toggle('overflow-hidden');
}

const logOut = (e) => {
  e.preventDefault();
  const appIsLive = location.hostname !== '127.0.0.1';
  const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';
  const URL = `${API}/auth/logout`;
  const xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      localStorage.removeItem('pinkettu');
      location.href= '/';
    }
  };
  
  xhttp.open('GET', URL, true);
  xhttp.setRequestHeader("Authorization", localStorage.pinkettu);
  xhttp.send();
}

const lists = [
  {
    href: '/',
    icon: 'home',
    text: 'HOME'
  },
  {
    href: '/pinks.html',
    icon: 'local_florist',
    text: 'PINKS'
  },
  {
    href: '/signup.html',
    icon: 'person_add',
    text: 'SIGN UP'
  },
  {
    href: '/login.html',
    icon: 'exit_to_app',
    text: 'LOG IN'
  },
  {
    href: '/profile.html',
    icon: 'face',
    text: 'PROFILE'
  },
  {
    href: '#',
    icon: 'exit_to_app',
    text: 'LOG OUT',
    style: 'log-out'
  }
];

const title = document.title;

const createListItem = (href, icon, text, style) => {
  if(localStorage.pinkettu && ['SIGN UP', 'LOG IN'].includes(text) || 
    !localStorage.pinkettu && ['PROFILE', 'LOG OUT'].includes(text)) return null;

  const li = document.createElement('li');
  const anchor = document.createElement('a');
  anchor.setAttribute('href', href);
  title.toLowerCase().slice(0, 2) === text.toLowerCase().slice(0, 2) && anchor.classList.add('active');
  const i = document.createElement('i');
  i.classList.add('material-icons');
  i.textContent = icon;
  style && i.classList.add(style);
  const span = document.createElement('span');
  span.textContent = text;
  anchor.append(i, span);
  li.appendChild(anchor);
  return li;
}

const section = document.createElement('section');
section.classList.add('nav-menu');

const nav = document.createElement('nav');

const container = document.createElement('div');
container.classList.add('container');

const logo = document.createElement('div');
logo.setAttribute('id', 'logo-cont');

const brand = document.createElement('a');
brand.setAttribute('href', '/');

const brandImage = document.createElement('img');
brandImage.setAttribute('src', 'images/pinkettu.png');

const close = document.createElement('i');
close.classList.add('material-icons');
close.textContent = 'close';

const ul = document.createElement('ul');

const listItems = lists.map(li => createListItem(...Object.values(li)));
const navItems = lists.map(li => createListItem(...Object.values(li)));

[ listItems, navItems ].forEach(items => {
  const start = items.indexOf(null);
  items.splice(start, 2);
});

ul.append(...listItems);
brand.appendChild(brandImage);
logo.appendChild(brand);
container.append(logo, close);
nav.append(container);
section.append(nav, ul);

document.addEventListener('DOMContentLoaded', a => {
  const script = document.querySelector('script');
  const ul = document.querySelector('ul');
  ul.append(...navItems);
  document.body.insertBefore(section, script);
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => nav.addEventListener('click', toggleNavMenu));

  const logout = document.querySelectorAll('.log-out');
  logout.forEach(element => element.parentElement.addEventListener('click', logOut));
});