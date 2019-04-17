function toggleButtonSpinner(button, isSubmitting) {
  [...button.children].forEach(child => child.classList.toggle('hide'));
  localStorage.setItem('isSubmitting', isSubmitting);
}

localStorage.removeItem('isSubmitting');