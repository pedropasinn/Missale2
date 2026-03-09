(function () {
  // Minimal Cordova compatibility layer for running the app on the web.
  // Goal: keep legacy code working without Cordova's Android bridge.

  window.cordova = window.cordova || {
    platformId: "browser",
    version: "0.0-web"
  };

  // Basic device info used in some logs/UI
  window.device = window.device || {
    platform: "Web",
    model: "Browser",
    version: (navigator && navigator.userAgent) ? navigator.userAgent : "",
    uuid: "web-" + Math.random().toString(16).slice(2)
  };

  // Plugins commonly referenced by the app
  window.plugins = window.plugins || {};
  window.plugins.insomnia = window.plugins.insomnia || {
    keepAwake: function () {},
    allowSleepAgain: function () {}
  };

  // Navigator APIs used in the legacy code
  navigator.app = navigator.app || { exitApp: function () {} };
  navigator.splashscreen = navigator.splashscreen || { hide: function () {} };

  navigator.globalization = navigator.globalization || {
    getPreferredLanguage: function (success, fail) {
      try {
        if (success) success({ value: (navigator && navigator.language) ? navigator.language : "en" });
      } catch (e) {
        if (fail) fail(e);
      }
    },
    getLocaleName: function (success, fail) {
      try {
        if (success) success({ value: (navigator && navigator.language) ? navigator.language : "en" });
      } catch (e) {
        if (fail) fail(e);
      }
    }
  };

  // --- deviceready emulation ---
  // Many pages register deviceready listeners late (even on window.onload).
  // If we fire too early, those listeners won't run and the app breaks.
  var fired = false;

  function createEvt(name) {
    var evt = null;
    try {
      if (typeof Event === "function") {
        evt = new Event(name);
      }
    } catch (e) {}

    if (!evt) {
      try {
        evt = document.createEvent("Event");
        evt.initEvent(name, true, true);
      } catch (e2) {
        // Last resort: best-effort plain object
        evt = { type: name };
      }
    }
    return evt;
  }

  function fireDeviceReady() {
    if (fired) return;
    fired = true;
    try {
      document.dispatchEvent(createEvt("deviceready"));
    } catch (e) {}
  }

  // If a listener is added after we already fired, call it immediately.
  var _add = document.addEventListener;
  if (_add) {
    document.addEventListener = function (type, listener, options) {
      if (type === "deviceready" && fired) {
        try {
          listener.call(document, createEvt("deviceready"));
        } catch (e) {
          setTimeout(function () {
            throw e;
          }, 0);
        }
        return;
      }
      return _add.call(document, type, listener, options);
    };
  }

  // Fire after full load to mimic Cordova timing and ensure late listeners run.
  function scheduleFire() {
    setTimeout(fireDeviceReady, 0);
  }

  if (document.readyState === "complete") {
    scheduleFire();
  } else if (window.addEventListener) {
    window.addEventListener("load", scheduleFire, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", scheduleFire);
  }
})();
