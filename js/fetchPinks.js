async function fetchPinks(profileHanlder) {
  const URL = `${API}/profile/pinks`;
  let profiles = await fetch(URL);
  profiles = await profiles.json();
  profileHanlder(profiles);
}

async function fetchIndexPinks(profileHanlder) {
  const URL = `${API}/profile/pinks/limit/6`;
  let profiles = await fetch(URL);
  profiles = await profiles.json();
  profileHanlder(profiles);
}

async function fetchAPink(id, profileHanlder) {
  let profile = await fetch(`${API}/profile/pinks/${id}`);
  profile = await profile.json();
  profileHanlder(profile);
}