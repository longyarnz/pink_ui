document.addEventListener('DOMContentLoaded', a => {
    fetchPinks(profiles => {
      if (Array.isArray(profiles) && profiles.length > 0) {
        document.querySelectorAll('figure.placeholder-container').forEach(e => e.remove());
        document.querySelector('div.see-more').classList.remove('hide');
        profiles.forEach(
          i => createPinkTiles(i._id, i.username, i.location, i.images.shift(), i.rank)
        );
      }
    });
  });