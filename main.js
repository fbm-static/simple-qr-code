var currentWindow;

chrome.commands.onCommand.addListener(function(command) {
  if (command !== 'generate_qr_code') return;

  console.log('shit');

  chrome.tabs.executeScript({
    code: 'window.getSelection().toString();'
  }, function(result) {
    if (result && result[0]) {
      renderCode(result[0]);
      return;
    }

    chrome.tabs.query({ active: true }, function(tabs) {
      if (tabs.length) renderCode(tabs[0].url);
    });
  });
});

chrome.contextMenus.create({
  title: 'Generate QR Code',
  id: 'simpleQrCodeG',
  contexts: ['all']
});

chrome.contextMenus.onClicked.addListener(function (req) {
  if (req.menuItemId !== 'simpleQrCodeG') return;
  renderCode(req.selectionText || req.linkUrl || req.pageUrl);
});

chrome.windows.onRemoved.addListener(function (windowId) {
  if (currentWindow && windowId === currentWindow.id) {
    currentWindow = null;
  }
});

function renderCode(text) {
  var options = {
    type: 'popup',
    width: 300,
    height: 380,
    focused: true,
    url: 'render.html'
  };

  console.log('text is %j', text);

  if (currentWindow) {
    chrome.windows.update(currentWindow.id, { focused: true }, sendMessage);
  } else {
    chrome.windows.create(options, sendMessage);
  }

  function sendMessage(newWindow) {
    currentWindow = newWindow;
    chrome.runtime.sendMessage({
      method: 'renderText',
      text: text
    });
  }
}
