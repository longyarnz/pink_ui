function rankProfile(rank, onClick) {
  const node = (icon, rank) => {
    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.textContent = icon;
    i.onclick = onClick ? () => onClick(rank) : null;
    return i;
  };
  let stars = Array(rank).fill(0).map((_, x) => node('star', x));
  const remainder = rank < 5 ? Array(5 - rank).fill(0).map((_, x) => node('star_border', x)) : [];
  stars = [...stars, ...remainder];
  const ratings = document.createElement('span');
  ratings.append(...stars);
  return ratings;
}
