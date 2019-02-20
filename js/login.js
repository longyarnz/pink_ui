const form = document.getElementsByTagName("form")[0];
function handleResponse(request) {
  console.log(request.responseText);
}
form.addEventListener("submit", e => {
  e.preventDefault();
  const [email, password] = form;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      handleResponse(this);
    }
  };
  xhttp.open("POST", "", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(
    JSON.stringify({
      email: email.value,
      password: password.value
    })
  );
});