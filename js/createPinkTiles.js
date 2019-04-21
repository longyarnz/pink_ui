function createPinkTiles(id, name, location, src) {
  const figure = document.createElement('figure');
  const figcaption = document.createElement('figcaption');

  const anchor = document.createElement('a');
  anchor.href = `/explore.html?pink=${id}`;

  const h4 = document.createElement('h4');
  h4.textContent = name;

  const footer = document.createElement('footer');
  const span = document.createElement('span');
  span.textContent = location || 'Lagos Island';

  const img = document.createElement('img');
  img.src = `https://images.pinkettu.com.ng/${src}`;

  const i = document.createElement('i');
  i.classList.add('material-icons');
  i.textContent = 'near_me';

  anchor.appendChild(h4);
  footer.append(i, span);
  figcaption.append(anchor, footer);
  figure.append(figcaption, img);

  figure.addEventListener('click', () => {
    window.location.assign(`/explore.html?pink=${id}`);
  });

  const div = document.querySelector('div.gallery');
  div.appendChild(figure);
}