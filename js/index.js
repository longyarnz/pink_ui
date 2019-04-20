document.addEventListener('DOMContentLoaded', a => {
  fetchIndexPinks(profiles => {
    if (Array.isArray(profiles) && profiles.length > 0) {
      localStorage.pinkettu_pinks = JSON.stringify(profiles);
      document.querySelectorAll('figure.placeholder-container').forEach(e => e.remove());
      document.querySelector('div.see-more').classList.remove('hide');
      profiles.forEach(
        (i, o) => o < 6 && createPinkTiles(i._id, i.username, i.location, i.images.shift(), i.rank)
      );
    }
  });
});