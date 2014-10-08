var render = document.getElementById('render');
var text = document.getElementById('text');

chrome.runtime.onMessage.addListener(function(req) {
  if (req.method !== 'renderText') return;
  console.log('the message is', req.text);
  text.innerHTML = req.text;
  text.style.border = '1px solid lightblue';
  render.innerHTML = '';
  new QRCode(render, {
    text: req.text,
    width: 256,
    height: 256
  });
});

