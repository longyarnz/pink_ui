function rankProfile(rank) {
  const node = icon => {
    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.textContent = icon;
    return i;
  };
  let stars = Array(rank).fill(0).map(_ => node('star'));
  const remainder = rank < 5 ? Array(5 - rank).fill(0).map(_ => node('star_border')) : [];
  stars = [...stars, ...remainder];
  const ratings = document.createElement('span');
  ratings.append(...stars);
  return ratings;
}
