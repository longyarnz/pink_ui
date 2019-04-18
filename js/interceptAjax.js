(function (open) {
  XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
    open.call(this, method, url, async, user, pass);
    this.setRequestHeader('Accept', '*');
  };

})(XMLHttpRequest.prototype.open);