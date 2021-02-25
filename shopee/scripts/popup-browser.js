var PopupBrowser = function () {
  this.pageLoadDelay = 2000;

  // @TODO somehow handle the closed window
};

PopupBrowser.prototype = {
  _initPopupWindow: function (callback, scope) {
    var browser = this;
    if (this.window !== undefined) {
      // check if tab exists
      chrome.tabs.get(this.tab.id, function (tab) {
        if (!tab) {
          alert('Đã có lỗi xảy ra. Vui lòng đóng và mở lại Chrome');
          throw 'Scraping window closed';
        }
      });

      callback.call(scope);
      return;
    }

    chrome.windows.create(
      {
        type: 'popup',
        width: 1042,
        height: 5000,
        focused: true,
        url: 'chrome://newtab'
      },
      function (window) {
        browser.window = window;
        browser.tab = window.tabs[0];

        callback.call(scope);
      }
    );
  },

  loadUrl: function (url, callback) {
    var tab = this.tab;

    var tabLoadListener = function (tabId, changeInfo, tab) {
      if (tabId === this.tab.id) {
        if (changeInfo.status === 'complete') {
          // @TODO check url ? maybe it would be bad because some sites might use redirects

          // remove event listener
          chrome.tabs.onUpdated.removeListener(tabLoadListener);

          // callback tab is loaded after page load delay
          setTimeout(callback, this.pageLoadDelay);
        }
      }
    }.bind(this);
    chrome.tabs.onUpdated.addListener(tabLoadListener);

    chrome.tabs.update(tab.id, { url: url });
  },

  close: function () {
    chrome.windows.remove(this.window.id);
  },

  fetchPage: function (url, callback, scope) {
    var browser = this;

    this._initPopupWindow(function () {
      var tab = browser.tab;

      browser.loadUrl(
        url,
        function () {
          var message = {
            extractPage: true
          };

          chrome.tabs.sendMessage(tab.id, message, function (data) {
            callback.call(scope, data);
          });
        }.bind(this)
      );
    }, this);
  },
  fetchProduct: function (url, callback, scope) {
    var browser = this;

    this._initPopupWindow(function () {
      var tab = browser.tab;

      browser.loadUrl(
        url,
        function () {
          var message = {
            extractProduct: true
          };

          chrome.tabs.sendMessage(tab.id, message, function (data) {
            callback.call(scope, data);
          });
        }.bind(this)
      );
    }, this);
  },
  showDetail: function (products) {
    var browser = this;
    var tab = browser.tab;
    var message = {
      showDetail: true,
      products: products
    };
    chrome.tabs.sendMessage(tab.id, message, function () { });
  }
};
