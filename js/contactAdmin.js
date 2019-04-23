async function contactAdmin(e) {
  e.preventDefault();
  if (localStorage.isSubmitting === 'true') return;

  const form = e.target;
  const button = form[3];
  toggleButtonSpinner(button, true);
  const [email, purpose, text] = form;
  const URL = `${API}/mail`;
  try {
    let mail = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        purpose: purpose.value,
        text: text.value
      })
    });

    const { status } = mail;
    mail = await mail.json();

    if (status >= 400) {
      throw mail;
    }

    else {
      toggleButtonSpinner(button, false);
      button.children[0].textContent = 'Thank You';
      button.style.backgroundColor = '#5cb85c';
      setTimeout(() => {
        button.children[0].textContent = 'Contact Admin';
        button.style.backgroundColor = '';
      }, 5000);
    }
  }
  catch (err) {
    // alert(err);
    toggleButtonSpinner(button, false);
    button.children[0].textContent = 'Network Error';
    button.style.backgroundColor = '#d9534f';
    setTimeout(() => {
      button.children[0].textContent = 'Contact Admin';
      button.style.backgroundColor = '';
    }, 5000);
  }
}