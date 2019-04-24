function createResetLink(e) {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true') return;
  const button = e.target.children.finalSubmit;
  toggleButtonSpinner(button, true);
  const URL = `${API}/auth/reset`;
  const [email] = form;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      const text = JSON.parse(this.responseText);
      const p = document.querySelector('p');
      p.textContent = text;
      p.style.color = this.status < 400 ? '#5cb85c' : '#d9534f';
      toggleButtonSpinner(button, false);
    }
  };
  xhttp.open('POST', URL, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify({
    email: email.value.toLowerCase()
  }));
};

document.addEventListener('DOMContentLoaded', a => {
  localStorage.removeItem('isSubmitting');
  const form = document.querySelector('form');
  form.addEventListener('submit', createResetLink);
});