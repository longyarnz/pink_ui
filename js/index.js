const handleClick = (e) => {
  console.log([ e.target.parentNode ]);
}

document.addEventListener('DOMContentLoaded', a => {
  const figure = document.querySelector('figure');
  figure.addEventListener('click', handleClick);
});