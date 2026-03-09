(function () {
  // Resolve base path of this loader so it works from any subfolder.
  // Kindle/old WebKit may not support document.currentScript.
  var scripts = document.getElementsByTagName("script");
  var thisScript = document.currentScript || (scripts && scripts.length ? scripts[scripts.length - 1] : null);
  var src = (thisScript && thisScript.src) ? thisScript.src : "";
  var base = src ? src.slice(0, src.lastIndexOf("/") + 1) : "";

  var proto = (location && location.protocol) ? location.protocol : "";
  var ua = (navigator && navigator.userAgent) ? navigator.userAgent : "";
  var isKindle = /Kindle|Silk/i.test(ua);

  // For Kindle browser, treat file:// as web (no Cordova bridge available).
  var isWeb = proto === "http:" || proto === "https:" || (proto === "file:" && isKindle);

  if (isWeb) {
    // Web (Vercel / localhost): do NOT load Cordova Android bridge.
    // Otherwise browsers will show prompt("gap:...") dialogs.
    document.write('<script src="' + base + 'cordova_web_shim.js"><\/script>');
  } else {
    // Cordova app (file://, cdvfile://): load the real Cordova runtime.
    document.write('<script src="' + base + 'cordova.js"><\/script>');
    document.write('<script src="' + base + 'cordova_plugins.js"><\/script>');
  }
})();
