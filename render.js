var render = document.getElementById('render');
var text = document.getElementById('text');

chrome.runtime.onMessage.addListener(function(message) {
  console.log(message);
  text.innerHTML = message;
  text.style.border = '1px solid lightblue';
  render.innerHTML = '';
  new QRCode(render, {
    text: message,
    width: 256,
    height: 256
  });
});

