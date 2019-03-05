const toggleNavMenu = () => {
  const menu = document.querySelector('section.nav-menu');
  menu.classList.toggle('show');
}

document.addEventListener('DOMContentLoaded', a => {
  const nav = document.querySelector('nav');
  nav.addEventListener('click', toggleNavMenu);
});