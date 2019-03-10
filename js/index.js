document.addEventListener('DOMContentLoaded', a => {
  fetchPinks(profiles => {
    if (Array.isArray(profiles) && profiles.length > 0) {
      localStorage.pinkettu_pinks = JSON.stringify(profiles);
      document.querySelectorAll('figure.placeholder').forEach(e => e.remove());
      profiles.forEach(
        i => createPinkTiles(i._id, i.username, i.location, i.images.shift(), i.rank)
      );
    }
  });
});