const appIsLive = location.hostname !== '127.0.0.1';
const API = appIsLive ? 'https://api.pinkettu.com.ng' : 'http://127.0.0.1:3001';

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