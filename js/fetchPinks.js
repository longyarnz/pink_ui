async function fetchPinks(profileHanlder) {
  let profiles = await fetch(`${API}/profile/pinks`);
  profiles = await profiles.json();
  profileHanlder(profiles);
}

async function fetchAPink(id, profileHanlder) {
  let profile = await fetch(`${API}/profile/pinks/${id}`);
  profile = await profile.json();
  profileHanlder(profile);
}