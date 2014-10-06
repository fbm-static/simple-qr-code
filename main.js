(function() {
  'use strict';

  var currentWindow = null;

  chrome.commands.onCommand.addListener(function(command) {
    if (command !== 'generate_qr_code') return;

    chrome.tabs.executeScript({
      code: 'window.getSelection().toString();'
    }, function(selection) {
      if (selection[0]) return renderCode(selection[0]);

      chrome.tabs.query({ active: true }, function(tabs) {
        if (tabs.length) renderCode(tabs[0].url);
      });
    });
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

    console.log(text);

    if (currentWindow) {
      chrome.windows.update(currentWindow.id, { focused: true }, sendMessage);
    } else {
      chrome.windows.create(options, sendMessage);
    }

    function sendMessage(newWindow) {
      currentWindow = newWindow;
      setTimeout(function() {
        chrome.runtime.sendMessage(text);
      }, 100);
    }
  }
})();
