function html(string) {
  const element = document.createElement('template');
  element.innerHTML = string;
  return Array.from(element.content.children)[0];
}
