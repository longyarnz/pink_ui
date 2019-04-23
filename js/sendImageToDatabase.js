async function sendImageToDatabase(file, filename) {
  const form = new FormData();
  form.append('File', file);
  form.append('Filename', filename);
  return fetch('https://images.pinkettu.com.ng/upload.php', {
    method: 'POST',
    body: form
  }).catch(err => alert(err));
}