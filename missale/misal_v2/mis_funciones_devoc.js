/* __MISAL_WEB_SHIM__ - ES5 Compatible Version for Kindle */
(function () {
  try {
    if (typeof window === 'undefined') return;
    if (window.__missalWebShimInstalled) return;
    window.__missalWebShimInstalled = true;

    // Stubs mínimos para o app não quebrar fora do Cordova
    if (!window.plugins) window.plugins = {};
    if (!window.plugins.insomnia) {
      window.plugins.insomnia = {
        keepAwake: function () {},
        allowSleepAgain: function () {}
      };
    }

    if (!navigator.app) navigator.app = {};
    if (typeof navigator.app.exitApp !== 'function') {
      navigator.app.exitApp = function () {
        console.log('[web] exitApp() ignorado');
      };
    }

    if (!window.device) {
      window.device = {
        platform: 'Browser',
        version: '1.0',
        manufacturer: 'Web',
        model: 'Browser'
      };
    }

    
    // Polyfill para Array.prototype.forEach (necessário para alguns navegadores antigos)
    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function(callback, thisArg) {
        if (this == null) throw new TypeError('Array.prototype.forEach called on null or undefined');
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        var T = thisArg;
        for (var k = 0; k < len; k++) {
          if (k in O) callback.call(T, O[k], k, O);
        }
      };
    }

// Polyfill para Promise se não existir
    if (typeof Promise === 'undefined') {
      window.Promise = function(executor) {
        var self = this;
        self._state = 'pending';
        self._value = undefined;
        self._handlers = [];
        
        function resolve(value) {
          if (self._state !== 'pending') return;
          self._state = 'fulfilled';
          self._value = value;
          self._handlers.forEach(function(h) { h.onFulfilled(value); });
        }
        
        function reject(reason) {
          if (self._state !== 'pending') return;
          self._state = 'rejected';
          self._value = reason;
          self._handlers.forEach(function(h) { h.onRejected(reason); });
        }
        
        try {
          executor(resolve, reject);
        } catch (e) {
          reject(e);
        }
      };
      
      Promise.prototype.then = function(onFulfilled, onRejected) {
        var self = this;
        return new Promise(function(resolve, reject) {
          function handle(value) {
            try {
              var result = onFulfilled ? onFulfilled(value) : value;
              resolve(result);
            } catch (e) {
              reject(e);
            }
          }
          
          function handleError(reason) {
            try {
              var result = onRejected ? onRejected(reason) : reason;
              reject(result);
            } catch (e) {
              reject(e);
            }
          }
          
          if (self._state === 'fulfilled') {
            setTimeout(function() { handle(self._value); }, 0);
          } else if (self._state === 'rejected') {
            setTimeout(function() { handleError(self._value); }, 0);
          } else {
            self._handlers.push({ onFulfilled: handle, onRejected: handleError });
          }
        });
      };
      
      Promise.prototype['catch'] = function(onRejected) {
        return this.then(null, onRejected);
      };
      
      Promise.all = function(promises) {
        return new Promise(function(resolve, reject) {
          var results = [];
          var completed = 0;
          var total = promises.length;
          
          if (total === 0) {
            resolve(results);
            return;
          }
          
          for (var i = 0; i < total; i++) {
            (function(index) {
              var p = promises[index];
              if (p && typeof p.then === 'function') {
                p.then(function(value) {
                  results[index] = value;
                  completed++;
                  if (completed === total) resolve(results);
                }, reject);
              } else {
                results[index] = p;
                completed++;
                if (completed === total) resolve(results);
              }
            })(i);
          }
        });
      };
      
      Promise.resolve = function(value) {
        return new Promise(function(resolve) { resolve(value); });
      };
      
      Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) { reject(reason); });
      };
    }

    // Garante deviceready no navegador
    var fired = false;
    document.addEventListener('deviceready', function () { fired = true; }, false);

    function isNativeShell() {
      try {
        var url = (document.URL || '').toLowerCase();
        var proto = (location.protocol || '').toLowerCase();
        if (proto === 'cdvfile:') return true;
        if (proto === 'file:' && url.indexOf('android_asset') !== -1) return true;
        if (proto === 'file:' && url.indexOf('http') !== 0) return true;
      } catch (e) {}
      return false;
    }

    function fireDevicereadyFallback() {
      if (fired) return;
      if (isNativeShell()) return;
      try {
        var ev = document.createEvent('Event');
        ev.initEvent('deviceready', true, true);
        document.dispatchEvent(ev);
      } catch (e) {
        console.warn('Erro ao disparar deviceready:', e);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(fireDevicereadyFallback, 0);
        setTimeout(fireDevicereadyFallback, 800);
      }, false);
    } else {
      setTimeout(fireDevicereadyFallback, 0);
      setTimeout(fireDevicereadyFallback, 800);
    }
  } catch (e) {
    console.warn('missal web shim falhou:', e);
  }
})();

// Variáveis globais
var anterior = "";
var seguinte = "";
var puntero = 500;
var tope = 500;
var botonesactivos = 1;
var pestanasactivas = 0;
var mispestanas = "";
var pag_origen = "";
var miposicion = 0;
var hora_ant = [];
var hora = 0;
var mipreferencia = [];
var estoymac = dime_pref("estoymac", 0);
var esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.indexOf('Macintosh') !== -1 && 'ontouchstart' in document);
var embutidos = "";
var botones = "";
var colores = "";
var miciclo = dime_pref("ciclo", "A");
var tipoanno = dime_pref("tipoanno", "impar");
var idiomas = ["latin", "cast", "engl", "germ", "ital", "port", "fran"];
var contador = 0;
var modocopia = false;
var lect_sant_prior = false;
var annoactual = new Date();
var mianno = dime_pref("mianno", annoactual.getFullYear());
var margenSuperior = 0;
var margenInferior = 0;
var myScroll;
var ajuste = dime_pref("ajuste", 10);
var esperame = false;

var num_pestana = {
  "o": 0,
  "t": 1,
  "s": 2,
  "c": 3,
  "le": 4,
  "pf": 5,
  "pe": 6,
  "i": 7
};

// Inicialização de preferências
mipreferencia['misal_pral'] = dime_pref("misal_pral_defecto", 0);
mipreferencia['segundoidioma'] = dime_pref("segundoidioma_defecto", 1);
mipreferencia['presentaciontexto'] = dime_pref("presentaciontexto_defecto", 2);
mipreferencia['presentacionrespuestas'] = dime_pref("presentacionrespuestas_defecto", 5);
mipreferencia['fondo'] = dime_pref("fondo_defecto", 1);
mipreferencia['tipoletra'] = dime_pref("tipoletra_defecto", 1);
mipreferencia['tamanotexto'] = dime_pref("tamanotexto_defecto", 12);
mipreferencia['tamanorubrica'] = dime_pref("tamanorubrica_defecto", 90);
mipreferencia['tamanomenus'] = dime_pref("tamanomenus_defecto", 10);
mipreferencia['oracionestodos'] = dime_pref("oracionestodos_defecto", 0);
mipreferencia['presentacionpestanas'] = dime_pref("presentacionpestanas_defecto", 0);
mipreferencia['presentacionbotones'] = dime_pref("presentacionbotones_defecto", 0);
mipreferencia['botoneszurdos'] = dime_pref("botoneszurdos_defecto", 0);
mipreferencia['ordinarionormal'] = dime_pref("ordinarionormal_defecto", 0);
mipreferencia['avance'] = dime_pref("avance_defecto", 100);
mipreferencia['margen_superior'] = dime_pref("margen_superior_defecto", 0);
mipreferencia['margen_inferior'] = dime_pref("margen_inferior_defecto", 0);

var mimisal_1 = idiomas[mipreferencia["misal_pral"]];
var mimisal_2 = idiomas[mipreferencia["segundoidioma"]];
var avancepantalla = mipreferencia["avance"];

var midia = getUrlVars()["midia"];
if (typeof midia === "undefined") midia = 1;

// Handler de erros global
function initGlobalErrorHandler() {
  var osInfo = 'SO desconocido';
  var deviceInfo = 'Dispositivo desconocido';

  document.addEventListener('deviceready', function () {
    if (window.device) {
      osInfo = device.platform + ' ' + device.version;
      deviceInfo = device.manufacturer + ' ' + device.model;
    } else {
      osInfo = 'SO no disponible';
      deviceInfo = 'Modelo no disponible';
    }
  }, false);

  window.onerror = function (message, source, lineno, colno, error) {
    var stack = (error && error.stack) ? error.stack : 'No hay stack disponible';
    var fullMessage = [
      '🛑 Error de JavaScript',
      'SO: ' + osInfo,
      'Dispositivo: ' + deviceInfo,
      'Mensaje: ' + message,
      'Archivo: ' + source,
      'Línea: ' + lineno + ', Columna: ' + colno,
      'Stack:\n' + stack
    ].join('\n');

    console.error(fullMessage);
    alert(fullMessage);
    return true;
  };

  console.log('✅ Manejador de errores con info de SO y dispositivo inicializado');
}

initGlobalErrorHandler();

// Funções utilitárias
function dime_pref(key, defecto) {
  var resultado = window.localStorage.getItem(key);
  if (resultado == null) resultado = defecto;
  return resultado;
}

// Função helper para calcular altura da página com segurança
function calcularAlturaPagina() {
  var headerElement = document.getElementById("cabecera");
  var pieElement = document.getElementById("piedepantalla");

  if (headerElement && pieElement) {
    try {
      var headerBottom = headerElement.getBoundingClientRect().bottom;
      var pieTop = pieElement.getBoundingClientRect().top;
      return pieTop - headerBottom;
    } catch (e) {
      console.warn('⚠️ Error calculando altura:', e);
      return window.innerHeight || 600;
    }
  } else {
    console.warn('⚠️ Elementos cabecera o piedepantalla no encontrados');
    return window.innerHeight || 600;
  }
}

function pon_pref(key, value) {
  window.localStorage.setItem(key, value);
}

function getUrlVars() {
  var url = window.location.href.replace(window.location.hash, "");
  var vars = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

function parseURL(url) {
  var a = document.createElement("a");
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(":", ""),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {};
      var seg = a.search.replace(/^\?/, "").split("&");
      var len = seg.length;
      for (var i = 0; i < len; i++) {
        if (!seg[i]) continue;
        var s = seg[i].split("=");
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
    hash: a.hash.replace("#", ""),
    path: a.pathname.replace(/^([^\/])/, "/$1"),
    relative: (a.href.match(/tp:\/\/[^\/]+(.+)/) || [, ""])[1],
    segments: a.pathname.replace(/^\//, "").split("/")
  };
}

function extraerRutaDesdeMisalV2(ruta) {
  if (typeof ruta !== 'string') return '';
  var indice = ruta.indexOf('/misal_v2');
  if (indice !== -1) {
    return ruta.slice(indice + '/misal_v2/'.length);
  }
  return ruta;
}

// Função para esperar Cordova (versão ES5)
function esperarCordova() {
  return new Promise(function(resolve) {
    if (!window.cordova) {
      console.log("[esperarCordova] Cordova no presente → navegador");
      resolve();
      return;
    }

    var devicereadyHandler = function() {
      console.log("[esperarCordova] Cordova listo (deviceready)");
      resolve();
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      document.addEventListener("deviceready", devicereadyHandler, false);
    } else {
      document.addEventListener("deviceready", devicereadyHandler, false);
      document.addEventListener("DOMContentLoaded", function() {
        setTimeout(function() {
          if (!window.cordova.file) {
            console.warn("[esperarCordova] Cordova sin plugins listos. Continuando igual.");
          }
          resolve();
        }, 1500);
      }, false);
    }
  });
}

// Função safeGet (versão ES5)
function safeGet(miurl, targetElement) {
  return new Promise(function(resolve) {
    var isIOS = window.cordova && cordova.platformId === "ios";
    var cleanUrl = miurl.split("#")[0];
    
    var fallback = function() {
      console.log("[safeGet] Fallback al navegador para", cleanUrl);
      $.get(cleanUrl)
        .done(function(data) {
          $(targetElement).html(data);
          resolve(data);
        })
        .fail(function() {
          console.warn("[safeGet] No se encontró (fallback): " + cleanUrl);
          resolve(null);
        });
    };

    if (isIOS && window.cordova && window.cordova.file) {
      var fullUrl = cordova.file.applicationDirectory + "www/misal_v2/" + cleanUrl;
      console.log("[safeGet] Intentando leer desde iOS filesystem:", fullUrl);

      window.resolveLocalFileSystemURL(fullUrl, function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          var watchdog;

          reader.onloadend = function() {
            clearTimeout(watchdog);
            console.log("[safeGet] Archivo leído con éxito (iOS)");
            targetElement.innerHTML = reader.result;
            resolve(reader.result);
          };

          reader.onerror = function() {
            clearTimeout(watchdog);
            console.error("[safeGet] Error leyendo archivo con FileReader");
            resolve(null);
          };

          watchdog = setTimeout(function() {
            console.warn("[safeGet] FileReader timeout, resolviendo fallback");
            resolve(null);
          }, 3000);

          reader.readAsText(file);
        }, function(error) {
          console.error("[safeGet] Error accediendo al archivo (file):", JSON.stringify(error));
          fallback();
        });
      }, function(error) {
        console.warn("[safeGet] No se pudo acceder al archivo (entry):", JSON.stringify(error));
        fallback();
      });
    } else {
      fallback();
    }
  });
}

// Função carga_pagina (versão ES5)
function carga_pagina(origenURL) {
  return esperarCordova().then(function() {
    var misal_1 = mimisal_1;
    var misal_2 = mimisal_2;
    var partes = origenURL.split("/");
    var miPath = partes.slice(0, -1).join("/");

    if (misal_1 == misal_2) {
      if (misal_1 == 'cast') { 
        misal_2 = 'latin'; 
      } else {
        misal_2 = 'cast';
      }
    }
    
    var hash = origenURL.split("#")[1];
    var idiomaUrl1 = origenURL.replace(/estructura/gi, misal_1);
    var idiomaUrl2 = origenURL.replace(/estructura/gi, misal_2);
    var estructuraData = document.createElement("div");
    var idiomaData1 = document.createElement("div");
    var idiomaData2 = document.createElement("div");

    if (miPath !== "m_estructura/indices") {
      var promesas = [
        safeGet(origenURL, estructuraData),
        safeGet(idiomaUrl1, idiomaData1),
        safeGet(idiomaUrl2, idiomaData2)
      ];

      return Promise.all(promesas).then(function() {
        if (hash) {
          var nuevoElemento = $(estructuraData).find("#" + hash).clone();
          nuevoElemento.removeClass("dia");
          $(estructuraData).replaceWith(nuevoElemento);
          estructuraData = nuevoElemento;
        }

        $(estructuraData).find(".padre").each(function() {
          var self = this;
          var classList = $(self).attr("class") || "";
          var match = classList.match(/padre_([\w-]+)/);
          if (!match) return;
          var numero = match[1];

          var hijoIdioma1 = $(idiomaData1).find(".hijo_" + numero);
          if (hijoIdioma1.length > 0) {
            $(self).append(hijoIdioma1);
          }

          var hijoIdioma2 = $(idiomaData2).find(".hijo_" + numero);
          if (mimisal_1 !== mimisal_2 && hijoIdioma2.length > 0) {
            $(self).append(hijoIdioma2);
          }

          $(self).removeClass("padre_" + numero);
          $(self).children().removeClass("hijo hijo_" + numero);
        });

        var estructuraDom = $(estructuraData).get(0);
        if (estructuraDom) {
          var allElements = estructuraDom.getElementsByTagName("*");
          for (var i = 0; i < allElements.length; i++) {
            var el = allElements[i];
            var classes = el.className.split(' ');
            var newClasses = [];
            var hadHijo = false;
            for (var j = 0; j < classes.length; j++) {
              if (classes[j].indexOf("hijo_") === 0) {
                hadHijo = true;
              } else if (classes[j] !== "hijo" || !hadHijo) {
                newClasses.push(classes[j]);
              }
            }
            if (hadHijo) {
              el.className = newClasses.join(' ');
            }
          }
        }

        return $(estructuraData).html();
      });
    } else {
      return safeGet(origenURL, estructuraData).then(function() {
        return $(estructuraData).html();
      });
    }
  });
}

// Funções de navegação e UI
function muestraono(miId, siono) {
  $("#" + miId).removeClass("visibleb novisibleb");
  if (siono) {
    $("#" + miId).removeClass("novisibleb").addClass("visibleb");
  } else {
    $("#" + miId).removeClass("visibleb").addClass("novisibleb");
  }
  saveUltimo(mipestana);
  if (typeof myScroll !== 'undefined') myScroll.refresh();
}

function cambia_vista(miId) {
  var d = new Date();
  var hora = d.getTime();
  var diferencia = hora - (hora_ant[miId] || 0);

  if (diferencia < 300) return;
  hora_ant[miId] = 0;

  var mielemento = document.getElementById(miId);
  if (mielemento.style.display == "block") {
    mielemento.style.display = "none";
  } else {
    mielemento.style.display = "block";
  }

  saveUltimo(mipestana);
  if (typeof myScroll !== 'undefined') myScroll.refresh();
  return false;
}

function cambia_vista2(miId) {
  var d = new Date();
  var hora = d.getTime();
  var diferencia = hora - (hora_ant[miId] || 0);

  if (diferencia < 300) return;
  hora_ant[miId] = 0;

  $("#" + miId).toggleClass("visibleb novisibleb");
  saveUltimo(mipestana);
  if (typeof myScroll !== 'undefined') myScroll.refresh();
}

function saveUltimo(pestana) {
  if (pestana == 'o' || puntero != 500) {
    pon_pref("lh" + pestana + puntero, $("#tab_" + pestana).html());
  }
  pon_pref("scroll_" + pestana + puntero, miposicion);
}

function toggle_pestanas(valor) {
  if (mipreferencia["presentacionpestanas"] == 3) {
    if (valor == 1) {
      $('.pestanas').css("visibility", "visible");
      $("#cabecera_back").css("top", 0);
      $('#contenedor, #icono-sticky').css('top', 'calc(' + margenSuperior + ' + 2em)');
      pestanasactivas = 1;
      $("#cabecera_back").css("padding-top", margenSuperior);
      $("#cabecera_back").css("background", "black");
    } else {
      $('.pestanas').css("visibility", "hidden");
      $("#contenedor, #cabecera_back, #icono-sticky").css("top", margenSuperior);
      $("#cabecera_back").css("z-index", "50000");
      pestanasactivas = 0;
      $("#cabecera_back").css("background", "transparent");
    }
  }
}

function arregla_top() {
  var safeAreaTop = 0;
  $('#cabecera').css('padding-top', (parseInt(dime_pref('margen_superior_defecto', 0)) + safeAreaTop) + 'px');
  var padHeader = parseInt($("#cabecera").css("padding-top"));
  $("#contenedor").css("top", $("#cabecera").outerHeight(true) + "px");
  $("#icono-sticky, #icono-gear").css("top", parseInt($("#cabecera").outerHeight(true) + 30) + "px");
}

function getSafeAreaBottom() {
  var testDiv = document.createElement("div");
  testDiv.style.cssText = "position: absolute; bottom: 0; height: env(safe-area-inset-bottom); visibility: hidden;";
  document.body.appendChild(testDiv);
  var safeAreaBottom = testDiv.offsetHeight;
  document.body.removeChild(testDiv);
  return safeAreaBottom || 0;
}

function arregla_bottom() {
  var safeAreaBottom = getSafeAreaBottom();
  $('#piedepantalla').css('padding-bottom', (parseInt(dime_pref('margen_inferior_defecto', 0)) + safeAreaBottom) + 'px');
}

function pon_noche() {
  var valor_noche = dime_pref("valor_noche", "0");
  if (valor_noche == 1) {
    pon_noche2(0);
  } else {
    pon_noche2(1);
  }
}

function pon_noche2(estado) {
  var fondo_libro = "../fondo_libro.png";
  if (estado == 1) {
    if (mipreferencia["fondo"] == 0) {
      $("body").css("background-image", "none").css("background-color", "#ffffff").css("color", "black");
    } else {
      $("body").css("background-image", "url('" + fondo_libro + "')").css("background-color", "transparent").css("color", "black");
    }
    $(".black, a.blnk, a.bllnkd, .enlacepref").css("color", "black");
    $(".h1, h2, h3, h4").css("color", "#B50000");
    $("span.enlace, span.blue, span.enlace_salmodia, span.azul, .blboce").css("color", "darkblue");
    $(".texto_incluido").css("background-color", "whitesmoke");
    $("#top_botones").css("background-color", "seashell");
  } else {
    $("body").css("background-image", "none").css("background-color", "black").css("color", "white");
    $(".black, a.blnk, a.bllnkd, .enlacepref").css("color", "gray");
    $(".h1, h2, h3, h4").css("color", "red");
    $("span.enlace, span.blue, span.enlace_salmodia, span.azul, .blboce").css("color", "lightblue");
    $(".texto_incluido").css("background-color", "DarkSlateGray");
    $("#top_botones").css("background-color", "#7e7a47");
  }
  pon_pref("valor_noche", estado);
}

function ajusta_idiomas(idioma1, idioma2) {
  if (idioma1 == idioma2) {
    $("." + idiomas[idioma2]).attr("style", "float: left; width: 98%; display: block;");
  } else {
    if (mipreferencia["presentaciontexto"] == 1) {
      $("." + idiomas[idioma2]).attr("style", "float: left; width: 47%; display: block;");
      $("." + idiomas[idioma1]).attr("style", "float: right; display: block; width: 47%; margin-right: 1%;");
    } else if (mipreferencia["presentaciontexto"] == 2) {
      $("." + idiomas[idioma2]).attr("style", "float: left; width: 98%; display: block;");
      $("." + idiomas[idioma1]).attr("style", "float: left; display: none; width: 98%;");
      $(".misal_" + idiomas[idioma1]).css("display", "none");
    }
  }

  if (mipreferencia["fondo"] == 1) {
    $(".boton").each(function() {
      $(this).removeClass("boton").addClass("botonBueno");
    });
  }
  
  // Converter ontouchend para onclick em dispositivos não-móveis
  var esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!esDispositivoMovil) {
    var elementos = document.querySelectorAll ? document.querySelectorAll("[ontouchend]") : [];
    for (var i = 0; i < elementos.length; i++) {
      var contenido = elementos[i].getAttribute("ontouchend");
      elementos[i].removeAttribute("ontouchend");
      elementos[i].setAttribute("onclick", contenido);
    }
  }
  
  if (typeof myScroll !== 'undefined') myScroll.refresh();
}

function cambia_tamanoletra(num) {
  $("body").css("font-size", num + "pt");
  var maspeq = num - 1;
  var masgrande = num + 1;
  $("#titulo002").html(mipreferencia["tamanotexto"] + "&nbsp;&#9654;&#xFE0E;&nbsp;<span style='font-size: 120%;'>" + masgrande + "</span>");
  $("#titulo003").html(mipreferencia["tamanotexto"] + "&nbsp;&#9654;&#xFE0E;&nbsp;<span style='font-size: 80%;'>" + maspeq + "</span>");
}

function cambia_fuente() {
  if (mipreferencia["tipoletra"] == 1) {
    $("body").css("font-family", "Times New Roman");
  } else {
    $("body").css("font-family", "Arial");
  }
}

function boton_adelante(pestanaloc) {
  tope = dime_pref("lh" + pestanaloc + "_tope");
  if (puntero < tope) {
    puntero = parseInt(puntero) + 1;
    pon_pref("lh" + pestanaloc + "_ultimo", puntero);
    if (puntero == dime_pref("lh" + pestanaloc + "_tope")) {
      document.getElementById("bot_adelante").style.visibility = "hidden";
    }
    $("#tab_" + pestanaloc).html(dime_pref("lh" + pestanaloc + puntero));
    document.getElementById("bot_atras").style.visibility = "visible";
  }
  reemplazarComentarios();
  ajusta_idiomas(nuevoidioma1, nuevoidioma2);
  if (typeof myScroll !== 'undefined') myScroll.refresh();
  var posicion = dime_pref("scroll_" + pestanaloc + puntero, 1);
  setTimeout(function() { 
    if (typeof myScroll !== 'undefined') myScroll.scrollTo(0, posicion, 0, false); 
  }, 200);
}

function boton_atras(pestanaloc) {
  console.log(pestanaloc + '--' + puntero);
  if (puntero > 500) {
    puntero = parseInt(puntero) - 1;
    pon_pref("lh" + pestanaloc + "_ultimo", puntero);
    if (puntero == 500) {
      document.getElementById("bot_atras").style.visibility = "hidden";
    }
    if (puntero != 500) {
      $("#tab_" + pestanaloc).html(dime_pref("lh" + pestanaloc + puntero));
    } else {
      carga_indice(pestanaloc, 1);
    }
    document.getElementById("bot_adelante").style.visibility = "visible";

    if (document.getElementById("ciclo" + miciclo)) {
      document.getElementById("ciclo" + miciclo).checked = true;
      document.getElementById("anno_" + tipoanno).checked = true;
    }
  }
  reemplazarComentarios();
  ajusta_idiomas(nuevoidioma1, nuevoidioma2);
  if (typeof myScroll !== 'undefined') myScroll.refresh();
  var posicion = dime_pref("scroll_" + pestanaloc + puntero, 1);
  setTimeout(function() { 
    if (typeof myScroll !== 'undefined') myScroll.scrollTo(0, posicion, 0, false); 
  }, 200);
}

function reemplazarComentarios() {
  var traducciones = {
    "cast": { "BREVE": "más breve", "LARGO": "más largo", "O_BIEN": "o bien", "SALMO": "Salmo", "LECT_1": "Primera Lectura", "LECT_2": "Segunda lectura", "ALELUYA": "Aleluya", "EVANGELIO": "Evangelio", "LECCIONARIO": "Leccionario", "INDICE": "ÍNDICE" },
    "engl": { "BREVE": "shorter", "LARGO": "longer", "O_BIEN": "or else", "SALMO": "Psalm", "LECT_1": "First Reading", "LECT_2": "Second Reading", "ALELUYA": "", "EVANGELIO": "Gospel", "LECCIONARIO": "Readings", "INDICE": "INDEX" },
    "ital": { "BREVE": "più breve", "LARGO": "più lungo", "O_BIEN": "oppure", "SALMO": "Salmo", "LECT_1": "Prima Lettura", "LECT_2": "Seconda Lettura", "ALELUYA": "Alleluia", "EVANGELIO": "Vangelo", "LECCIONARIO": "Lezionario", "INDICE": "INDICE" },
    "germ": { "BREVE": "kurzfassung", "LARGO": "länger", "O_BIEN": "oder", "SALMO": "Antwortpsalm", "LECT_1": "Erste Lesung", "LECT_2": "Zweite Lesung", "ALELUYA": "Ruf vor dem Evangelium", "EVANGELIO": "Evangelium", "LECCIONARIO": "Lesungen", "INDICE": "VERZEICHNIS" },
    "port": { "BREVE": "mais breve", "LARGO": "mais longo", "O_BIEN": "ou então", "SALMO": "Salmo", "LECT_1": "Primeira Leitura", "LECT_2": "Segunda Leitura", "ALELUYA": "Aleluia", "EVANGELIO": "Evangelho", "LECCIONARIO": "Lecionário", "INDICE": "INDEX" },
    "fran": { "BREVE": "plus court", "LARGO": "plus long", "O_BIEN": "ou bien", "SALMO": "Psaume", "LECT_1": "Première lecture", "LECT_2": "Deuxième lecture", "ALELUYA": "Alléluia", "EVANGELIO": "Évangile", "LECCIONARIO": "Lectionnaire", "INDICE": "INDEX" },
    "latin": { "BREVE": "brevior", "LARGO": "longior", "O_BIEN": "vel", "SALMO": "Psalmus", "LECT_1": "Lectio I", "LECT_2": "Lectio II", "ALELUYA": "Alleluia", "EVANGELIO": "Evangelium", "LECCIONARIO": "Lectionarium", "INDICE": "INDEX" }
  };

  var palavrasChave = ["BREVE", "LARGO", "O_BIEN", "SALMO", "LECT_1", "LECT_2", "ALELUYA", "EVANGELIO", "LECCIONARIO"];

  $("*").contents().each(function() {
    if (this.nodeType === 8) {
      var textoComentario = this.nodeValue.replace(/^\s+|\s+$/g, '');
      
      var encontrado = false;
      for (var i = 0; i < palavrasChave.length; i++) {
        if (palavrasChave[i] === textoComentario) {
          encontrado = true;
          break;
        }
      }
      
      if (encontrado) {
        var contenedor = $(this).closest(".cast, .engl, .ital, .germ, .port, .fran, .latin");
        var idioma = contenedor.length ? contenedor.attr("class").split(" ")[0] : mimisal_1;
        var textoReemplazo = (traducciones[idioma] && traducciones[idioma][textoComentario]) ? traducciones[idioma][textoComentario] : textoComentario;
        $(this).replaceWith(textoReemplazo);
      }
    }
  });
}

// Adicionar jQuery.fn.outerHTML se não existir
if (typeof $.fn.outerHTML === 'undefined') {
  $.fn.outerHTML = function() {
    return jQuery("<div />").append(this.eq(0).clone()).html();
  };
}

function vete_a(miurl) {
  carga_pagina(miurl).then(function(contenido) {
    saveUltimo(mipestana);
    if (puntero < 510) puntero++;
    pon_pref("lh" + mipestana + "_ultimo", puntero);
    pon_pref("lh" + mipestana + "_tope", puntero);
    $("#tab_" + mipestana).html(contenido);

    console.log(mipestana + "-" + puntero + "-" + nuevoidioma1 + "-" + nuevoidioma2);
    arreglaCarga(mipestana);
    ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    document.getElementById("bot_atras").style.visibility = "visible";
    document.getElementById("bot_adelante").style.visibility = "hidden";
    saveUltimo(mipestana);
  });
}

function carga_indice(pestanaloc, opcion) {
  if (typeof opcion === 'undefined') opcion = 0;
  
  switch (pestanaloc) {
    case "o": return;
    case "t": pag_origen = "m_estructura/indices/m_estructura_indice_tiempos.html"; break;
    case "s": pag_origen = "m_estructura/indices/m_estructura_indice_santos.html"; break;
    case "c": pag_origen = "m_estructura/indices/m_estructura_indice_comunes.html"; break;
    case "le": pag_origen = "m_estructura/indices/m_estructura_indice_lecturas.html"; break;
    case "pf": pag_origen = "m_estructura/indices/m_estructura_indice_prefacios.html"; break;
    case "pe": pag_origen = "m_estructura/indices/m_estructura_indice_pleg_euc.html"; break;
    case "i": pag_origen = "m_estructura/indices/m_estructura_indice_ogmr.html"; break;
  }
  
  carga_pagina(pag_origen).then(function(contenido) {
    $("#tab_" + pestanaloc).html(contenido);
    if (opcion == 0) pon_pref("lh" + pestanaloc + "_tope", 500);
    if (opcion == 0) pon_pref("lh" + pestanaloc + "_ultimo", 500);
    if (mipreferencia["fondo"] == 1) {
      $(".boton").each(function() {
        $(this).removeClass("boton").addClass("botonBueno");
      });
    }
    ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    arreglaCarga(pestanaloc);
    puntero = 500;
    saveUltimo(pestanaloc);
    if (typeof myScroll !== 'undefined') {
      myScroll.refresh();
      myScroll.scrollTo(0, 0, 0, false);
    }
  });
}

// Inicialização quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
  esperarCordova().then(function() {
    console.log("Estoy en 1-1");
    return new Promise(function(resolve) {
      if (document.readyState === "complete") {
        console.log("load ya había ocurrido");
        resolve();
      } else {
        window.addEventListener("load", function() {
          console.log("esperé load");
          setTimeout(resolve, ajuste * 20);
        }, false);
      }
    });
  }).then(function() {
    console.log("Estoy en 1-3");
    $("#tab_o").css("display", "block");
    $("ul.pestanas").addClass("tabnav_o");
  }).then(function() {
    console.log("Estoy en 1-3b");
    return loadedAsync();
  }).then(function() {
    console.log("Estoy en 1-2");
    return inicia_ord();
  }).then(function() {
    console.log("Estoy en 1-4");
    if (esIOS) $("#contenedor").css("bottom", "-1.9em");
    if (mipestana == "o" && mipreferencia["ordinarionormal"] == 0) {
      console.log('Estoy en 5');
      cargado2();
    }
  });
}, false);

function loadedAsync() {
  console.log('Estoy en 3');
  return new Promise(function(resolve, reject) {
    try {
      console.log('Estoy en 4');
      var espera = 1;

      toggle_pestanas(0);

    // Verificar si iScroll está disponible antes de usarlo
    if (typeof iScroll !== 'undefined') {
      myScroll = new iScroll("contenedor", {
        hScrollbar: false,
        vScrollbar: false,
        fixedScrollbar: false,
        hScroll: false,
        bounce: false,
        hideScrollbar: true,
        fadeScrollbar: true,
        momentum: true,
        useTransform: false,
        onBeforeScrollStart: function(e) {
          var target = e.target;
          while (target.nodeType != 1) target = target.parentNode;
          if (target.tagName != "SELECT" && target.tagName != "INPUT" && target.tagName != "TEXTAREA" && target.tagName != "OPTION") {
            e.preventDefault();
          }
        },
        onBeforeScrollMove: function(e) {
        myScroll.refresh();
        if (parseInt(dime_pref('pasarpagina_defecto', 1)) === 1) {
          var paginaAltura = calcularAlturaPagina();

          if (this.distX > 40 && this.absDistX > this.absDistY) {
            myScroll.disable();
            myScroll.scrollTo(0, -(paginaAltura - 10), 300, true);
            this.distX = 0;
            this.moved = true;
            myScroll.enable();
          } else if (this.distX < -40 && this.absDistX > this.absDistY) {
            myScroll.disable();
            myScroll.scrollTo(0, (paginaAltura - 10), 300, true);
            this.distX = 0;
            this.moved = true;
            myScroll.enable();
          }
        }
      },
      onScrollStart: function() {
        $("#menu_diamante, #menu_grabar, #menu_ira").css("display", "none");
        return false;
      },
      onScrollEnd: function() {
        miposicion = myScroll.y;
        pon_pref("scroll_" + mipestana + puntero, miposicion);
        return false;
      }
    });
    } else {
      console.warn('⚠️ iScroll no está disponible - scrolling nativo será usado');
    }

    console.log('Estoy en 6');
    document.addEventListener("deviceready", onDeviceReady2, false);

    var paginaAltura = calcularAlturaPagina();

    if (avancepantalla == 100) {
      avancepantalla = (avancepantalla * paginaAltura) / 100 - 10;
    } else {
      avancepantalla = (avancepantalla * paginaAltura) / 100;
    }

    if (mipreferencia["fondo"] == 1) {
      $(".boton").each(function() {
        $(this).removeClass("boton").addClass("botonBueno");
      });
    }

    setTimeout(function() {
      esperame = false;
      console.log('Estoy en 7');

      // Solo usar myScroll si está definido
      if (typeof myScroll !== 'undefined' && myScroll) {
        myScroll.refresh();

        if (typeof parcial2 === "undefined") {
          myScroll.scrollTo(0, -miposicion, 0, true);
        } else {
          if (parcial2 == "rito_comunion") {
            muestraono("botonmas5", false);
            muestraono("liturgia_eucaristica_3", true);
            myScroll.scrollToElement(document.getElementById("rito_comunion"), 0);
          } else if (parcial2 == "lit_euchar") {
            muestraono("botonmas3", false);
            muestraono("liturgia_eucaristica_1", true);
            myScroll.scrollToElement(document.getElementById("lit_euchar"), 0);
          } else {
            myScroll.scrollTo(0, -miposicion, 0, true);
          }
        }
      }

      $("#mis_intenciones").html(dime_pref("misintenciones", "---"));

      setTimeout(function() {
        console.log('Estoy en 8');
        arregla_top();
        arregla_bottom();
      }, 100);

      resolve();
    }, espera);

    } catch (error) {
      console.error('❌ Error en loadedAsync:', error);
      // Mesmo com erro, resolver a promise para não bloquear a aplicação
      resolve();
    }
  });
}

function inicia_ord() {
  console.log('Estoy en 2');
  return carga_pagina("m_estructura/ordinario/m_estructura_ordinario.html").then(function(contenido) {
    $("#tab_o").html(contenido);
    arreglaCarga("o");
    pon_pref("lho_tope", 500);
    pon_pref("lho_ultimo", 500);
    pon_pref("lho500", $("#tab_o").html());
    $("#tab_1").css("display", "block");
    $("ul.pestanas").addClass("tabnav_o");
    $("#bot_adelante").css("visibility", "hidden");
    $("#bot_atras").css("visibility", "hidden");
  });
}

function onDeviceReady2() {
  document.addEventListener("backbutton", backKeyDown, true);
  if (window.cordova) navigator.splashscreen.hide();
  if (esIOS) {
    $("#exitBtn").css('display', "none");
  } else {
    document.addEventListener("volumeupbutton", retrasa_pantalla, false);
    document.addEventListener("volumedownbutton", avanza_pantalla, false);
  }
}

function backKeyDown() {
  if (confirm("Exit?")) navigator.app.exitApp();
}

function retrasa_pantalla() {
  var paginaAltura = calcularAlturaPagina();
  $("#contenedor").animate({ scrollTop: "-=" + (paginaAltura - 10) }, 200);
}

function avanza_pantalla() {
  var paginaAltura = calcularAlturaPagina();
  $("#contenedor").animate({ scrollTop: "+=" + (paginaAltura - 10) }, 200);
}

function botonPantAbajo() {
  myScroll.scrollTo(0, avancepantalla, 200, true);
  return false;
}

function botonPantArriba() {
  myScroll.scrollTo(0, -avancepantalla, 200, true);
}

// Placeholder para arreglaCarga - função grande que precisa ser convertida
function arreglaCarga(pestana) {
  var tareas = [];
  $('#icono-sticky').removeClass('visibleb').addClass('novisibleb')
  $('#bot_grabar').css('visibility', '')
  if (mipreferencia["ordinarionormal"] == 1) {
    if (pestana == "o") {
      $(".div-botones , .incrustado")
        .removeClass("visibleb")
        .addClass("novisibleb")
      $(".txt_ord , .noincrustado")
        .removeClass("novisibleb")
        .addClass("visibleb")
    }
  } else {
    switch (pestana) {
      case "o":
        if (dime_pref('ver_bot_int_defecto', 1)==0) $('#icono-sticky').remove();
        $('#icono-sticky').removeClass('novisibleb').addClass('visibleb')
        $('#bot_grabar').css('visibility', 'hidden')
        esperame = true
        var ab = 0
        var pestanaspos = ["tmp", "snt", "com", "pf", "pe"]
        var partespos = [
          "titulo",
          "ant_ent",
          "gloria",
          "colecta",
          "credo",
          "antes_or_fieles",
          "or_ofrend",
          "ant_com",
          "post_com",
          "or_pueblo",
          "prefacio",
          "pleg",
        ]
        // quité gloria y credo
        // var partespos= ['titulo','ant_ent','colecta','antes_or_fieles','or_ofrend','ant_com','post_com','or_pueblo','prefacio','pleg']
        var index
        for (index = 0; index < partespos.length; ++index) {
          var encontre_alguno = false
          var index0
          for (index0 = 0; index0 < pestanaspos.length; ++index0) {
            pestana8 = pestanaspos[index0]

            parte8 = partespos[index]

            valor = dime_pref("x_" + pestana8 + "_" + parte8, "nada")

            if (parte8 != "titulo") valor = valor.replace("h2", "h4")
            $("#x_" + pestana8 + "_" + parte8)
              .html(valor)
              .removeClass("visibleb")
              .addClass("novisibleb")

            if ($("#x_" + pestana8 + "_" + parte8).length ) if (
              valor != "nada" &&
              valor.length > 1 &&
              $("#x_" + pestana8 + "_" + parte8).html().length > 90
            ) {
              encontre_alguno = true
              $("#x_" + pestana8 + "_" + parte8 + " .cursores").remove()
              $("#bot_global .bot_" + pestana8).addClass("activo")
              $("#bot_" + parte8)
                .parent()
                .removeClass("novisibleb")
                .addClass("visibleb")
              $("#bot_" + parte8 + " .bot_" + pestana8).addClass("activo")
              if (parte8 == "prefacio") {
                $("#x_ord_prefacio")
                  .removeClass("visibleb")
                  .addClass("novisibleb")
                $("#x_" + pestana8 + "_prefacio a").each(function () {
                  midirec = "m_estructura/prefacios/"
                  sitio = parseURL(this.href)
                  cadena = midirec + sitio.file + "#" + sitio.hash
                  if (this.href.indexOf('javascript') !== 0) {
                    this.href = "javascript: carga_prefacio('" + cadena + "');"
                  }
                })
              }

              if (parte8 == "or_pueblo")
                $("#x_" + pestana8 + "_or_pueblo a").each(function () {
                  midirec = "m_estructura/ordinario/m_estructura_"
                  sitio2 = parseURL(this.href)
                  cadena =
                    midirec + sitio2.file + "#bend" + sitio2.params["parcial"]
                  if (this.href.indexOf('javascript') !== 0) {
                    this.href =
                      "javascript: carga_bendicion('" +
                      cadena +
                      "','#x_" +
                      pestana8 +
                      "_or_pueblo','#bend" +
                      sitio2.params["parcial"] +
                      "');"
                  }
                })
            }
          }
        }

        //cambio enlaces-pensando en los comunes
        $("#x_snt_titulo a").each(function () {
          sitio = parseURL(this.href)
          //alert(this.href)
          if (this.href.indexOf("parcial=") > 0) {
            cadena =  extraerRutaDesdeMisalV2(sitio.path) + "#parcial_" + sitio.params["parcial"]
            //alert(cadena)
              
          } else cadena = extraerRutaDesdeMisalV2(sitio.path) + "#" + sitio.hash
          if (this.href.indexOf('javascript') !== 0) {
            this.href =
              "javascript: ejecutarCargaYRecarga('" +
              cadena +
              "','x_" +
              parte8 +
              "','x_res_lct_" +
              parte8 +
              "'); "
          }
        })
        // hasta aquí
        var coletilla = ""
        if (mipreferencia["fondo"] == 1) coletilla = "Bueno"
        var pestanaspos = ["tmp_lct", "snt_lct", "otr_lct"]
        var partespos = [
          "prim_lect",
          "salmo",
          "seg_lect",
          "aleluya",
          "evangelio",
        ]
        var index
        for (index = 0; index < partespos.length; ++index) {
          parte8 = partespos[index]
          var index0
          var encontre_alguno = false
          for (index0 = 0; index0 < pestanaspos.length; ++index0) {
            pestana8 = pestanaspos[index0]
            valor = dime_pref("x_" + pestana8 + "_" + parte8, "nada")
            //console.log('x_'+pestana8+'_'+parte8+'.....'+valor+'--')
            //if (pestana8+'_'+parte8=='snt_lct_prim_lect') alert('x_'+pestana8+'_'+parte8+'.....'+valor+'--')
            if (valor == "nada") {
              $("#x_" + pestana8 + "_" + parte8).html("")
            } else $("#x_" + pestana8 + "_" + parte8).html(valor)

            $("#x_" + pestana8 + "_" + parte8)
              .removeClass("visibleb")
              .addClass("novisibleb")

            if ($("#x_" + pestana8 + "_" + parte8).length) if (
              valor != "nada" &&
              valor.length > 0 &&
              $("#x_" + pestana8 + "_" + parte8).html().length > 90
            ) {
              encontre_alguno = true
              if (parte8 == "evangelio") {
                $("#dialogo_evang")
                  .clone()
                  .removeAttr("id")
                  .prependTo("#x_" + pestana8 + "_" + parte8)
                $('.dialogo_evang:not("#dialogo_evang")')
                  .removeClass("novisibleb")
                  .addClass("visibleb")
              }
              $("#bot_global .bot_" + pestana8).addClass("activo")
              $("#bot_" + parte8)
                .parent()
                .removeClass("novisibleb")
                .addClass("visibleb")
              $(".cursores , .respuesta").remove()
              $("#bot_" + parte8 + " .bot_" + pestana8).addClass("activo")
              $("#x_" + pestana8 + "_" + parte8 + " a").each(function () {
                midirec = "m_estructura/lecturas/m_estructura_"
                sitio = parseURL(this.href)
                //alert(this.href)
                if (this.href.indexOf("parcial=") > 0) {
                  cadena = extraerRutaDesdeMisalV2(sitio.path) + "#parcial_" + sitio.params["parcial"]
                  //alert(cadena)
                } else cadena = extraerRutaDesdeMisalV2(sitio.path) + "#" + sitio.hash
                if (this.href.indexOf('javascript') !== 0) {
                  this.href =
                    "javascript: carga_lectura('" +
                    cadena +
                    "','x_" +
                    parte8 +
                    "','x_res_lct_" +
                    parte8 +
                    "');"
                }
              })
              if (pestana8 == "otr_lct")
                $("#x_" + pestana8 + "_" + parte8).prepend(
                  "<div class=solodos><span class=boton" +
                    coletilla +
                    " ontouchend='setTimeout( function() { pon_pref(\"x_" +
                    pestana8 +
                    "_" +
                    parte8 +
                    '","nada"); arreglaLectura("' +
                    parte8 +
                    "\"); } , 10);'>X</span></div>"
                )
            }
            
            //alert('#x_'+pestana8+'_'+parte8+':'+$('#x_'+pestana8+'_'+parte8).html())
          }
          if (!encontre_alguno) {
            $(".txt_ord.txt_" + parte8)
              .removeClass("txt_ord")
              .removeClass("novisibleb")
              .addClass("visibleb")
          }
        }
        // Una vez cargado lo normal, vemos días especiales
        //Domingo de Ramos
        if ($("#x_tmp_titulo #soy_mierc_ceniza").length > 0) {
          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_cuaresma.html#x_antes_or_fieles"
            ).then(function(contenido) {
              $("#despues_homilia").html(contenido)
              $("#acto_penitencial , #himno_gloria")
                .removeClass("visibleb")
                .addClass("novisibleb")
              $(".bot_snt , .bot_com").removeClass("activo")
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
        }
        if ($("#x_tmp_titulo #soy_dom_ramos").length > 0) {
          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_semanasta.html#entrada_dom_ramos"
            ).then(function(contenido) {
              $("#todo_hasta_colecta").html(contenido)
              carga_pagina(
                "m_estructura/ordinario/m_estructura_ordinario.html#antes_ant_ent"
              ).then(function(contenido2) {
                $("#iniciales_ramos_1").html(contenido2)
                ajusta_idiomas(nuevoidioma1, nuevoidioma2)
              })
              carga_pagina(
                "m_estructura/ordinario/m_estructura_ordinario.html#desp_ant_ent"
              ).then(function(contenido2) {
                $("#iniciales_ramos_2").html(contenido2)
                ajusta_idiomas(nuevoidioma1, nuevoidioma2)
              })
              $("#entrada_ramos")
                .addClass("texto_incluido")
                .removeClass("novisibleb")
                .addClass("visibleb")
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_semanasta.html#antes_pasion"
            ).then(function(contenido) {
              $("#antes_evangelio").html(contenido)
              $(".bot_snt , .bot_com").removeClass("activo")
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
        }
        if ($("#x_tmp_titulo #soy_misa_crismal").length > 0) {

          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_semanasta2.html#despues_homilia"
            ).then(function(contenido) {
              $("#despues_homilia").html(contenido)
              $(".bot_snt , .bot_com").removeClass("activo")
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
        }
        if ($("#x_tmp_titulo #soy_misa_jueves_sto").length > 0) {
          $("#bloque_credo_orfieles").remove()
          $("#rub_homilia").remove()
          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_semanasta3.html#despues_homilia"
            ).then(function(contenido) {
              $("#despues_homilia").html(contenido)
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_semanasta3.html#todo_desp_or_post_com"
            ).then(function(contenido) {
              $("#todo_desp_or_post_com").html(contenido)
              $(".bot_snt , .bot_com").removeClass("activo")
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
        }

        if ($("#x_tmp_titulo #soy_misa_viernes_sto").length > 0) {
          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_semanasta4.html#todo_viernes_sto"
            ).then(function(contenido) {
              $("#todo").html(contenido)
              $("#lectura_isaias").html(dime_pref("x_tmp_lct_prim_lect", ""))
              $("#lectura_hebreos").html(dime_pref("x_tmp_lct_seg_lect", ""))
              $("#lectura_juan").html(dime_pref("x_tmp_lct_evangelio", ""))
              $(".noincrustado").removeClass("visibleb").addClass("novisibleb")
              $(".bot_snt , .bot_com").removeClass("activo")
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
        }
        if ($("#x_tmp_titulo #soy_vigilia_pascual").length > 0) {
          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_semanasta5.html#todo_hasta_ofertorio"
            ).then(function(contenido) {
              $("#todo_hasta_ofertorio").html(contenido)
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
          tareas.push(
            carga_pagina(
              "m_estructura/tiempos/m_estructura_tiempos_semanasta5.html#despedida_final"
            ).then(function(contenido) {
              $("#despedida_final").html(contenido)
              $("#bendic_sacd").remove()
              $(".bot_snt , .bot_com").removeClass("activo")
              ajusta_idiomas(nuevoidioma1, nuevoidioma2)
            })
          );
        }
        if ($("#x_tmp_titulo .soy_octava_pascua").length > 0) {
          $(".octava_pascua").removeClass("novisibleb").addClass("visibleb")
        } else
          $(".octava_pascua").removeClass("visibleb").addClass("novisibleb")

        if ($("#x_tmp_titulo .soy_pentecostes").length > 0) {
          $(".pentecostes").removeClass("novisibleb").addClass("visibleb")
        }
        if ($("#luna_cast").length > 0) {
          $("#luna_cast").html(miluna(mianno, "cast"))
        }
        if ($("#luna_latin").length > 0) {
          $("#luna_latin").html(miluna(mianno, "latin"))
        }
        if ($("#luna_ital").length > 0) {
          $("#luna_ital").html(miluna(mianno, "ital"))
        }
        $(".meter_aqui, .santus148")
          .removeClass("visibleb")
          .addClass("novisibleb")

        break
      case "t":
        var partespos = [
          "titulo",
          "ant_ent",
          "acto_penit",
          "gloria",
          "colecta",
          "credo",
          "antes_or_fieles",
          "or_ofrend",
          "prefacio",
          "ant_com",
          "post_com",
          "or_pueblo",
        ]
        var index
        for (index = 0; index < partespos.length; ++index) {
          parte8 = partespos[index]
          if ($(".x_" + parte8 + ":visible").length) {
            pon_pref(
              "x_tmp_" + parte8,
              $(".x_" + parte8 + ":visible").outerHTML()
            )
          } else pon_pref("x_tmp_" + parte8, "nada")

          if (parte8 == "prefacio") {
            $(".x_prefacio a").each(function () {
              midirec = "m_estructura/prefacios/"
              sitio = parseURL(this.href)
              cadena = midirec + sitio.file + "#" + sitio.hash
              if (this.href.indexOf('javascript') !== 0) {
                this.href =
                  "javascript: cambia_a_pest('pf'); vete_a('" + cadena + "');"
              }
            })
          }

          if (parte8 == "or_pueblo")
            $(".x_or_pueblo a").each(function () {
              midirec = "m_estructura/ordinario/m_estructura_"
              sitio2 = parseURL(this.href)
              cadena =
                midirec + sitio2.file + "#bend" + sitio2.params["parcial"]
              if (this.href.indexOf('javascript') !== 0) {
                this.href =
                  "javascript: carga_bendicion('" +
                  cadena +
                  "','.x_or_pueblo','#bend" +
                  sitio2.params["parcial"] +
                  "');"
              }
            })
        }

        if ($("#luna_cast").length > 0) {
          $("#luna_cast").html(miluna(mianno, "cast"))
        }
        if ($("#luna_latin").length > 0) {
          $("#luna_latin").html(miluna(mianno, "latin"))
        }
        if ($("#luna_ital").length > 0) {
          $("#luna_ital").html(miluna(mianno, "ital"))
        }

        ajusta_idiomas(nuevoidioma1, nuevoidioma2)
        break

      case "s":
        var partespos = [
          "titulo",
          "ant_ent",
          "acto_penit",
          "gloria",
          "colecta",
          "credo",
          "antes_or_fieles",
          "or_ofrend",
          "prefacio",
          "ant_com",
          "post_com",
          "or_pueblo",
        ]
        var index
        for (index = 0; index < partespos.length; ++index) {
          parte8 = partespos[index]
          if ($(".x_" + parte8 + ":visible").length) {
            pon_pref(
              "x_snt_" + parte8,
              $(".x_" + parte8 + ":visible").outerHTML()
            )
          } else pon_pref("x_snt_" + parte8, "nada")

          if (parte8 == "prefacio") {
            $(".x_prefacio a").each(function () {
              midirec = "m_estructura/prefacios/"
              sitio = parseURL(this.href)
              cadena = midirec + sitio.file + "#" + sitio.hash
              if (this.href.indexOf('javascript') !== 0) {
                this.href =
                  "javascript: cambia_a_pest('pf'); vete_a('" + cadena + "');"
              }
            })
          }
        if (parte8 == "titulo") {
          $(".x_titulo a").each(function () {
            sitio = parseURL(this.href)
            //alert(this.href)
            if (this.href.indexOf("parcial=") > 0) {
              cadena = sitio.path + "#parcial_" + sitio.params["parcial"]
              //alert(cadena)
            } else cadena = sitio.path + "#" + sitio.hash
            if (this.href.indexOf('javascript') !== 0) {
              this.href =
                "javascript: cambia_a_pest('c'); vete_a('" +
                cadena +
                "');"
            }
          })
          }
         if (parte8 == "or_pueblo")
          $(".x_or_pueblo a").each(function () {
            midirec = "m_estructura/ordinario/m_estructura_"
            sitio2 = parseURL(this.href)
            cadena =
              midirec + sitio2.file + "#bend" + sitio2.params["parcial"]
            if (this.href.indexOf('javascript') !== 0) {
              this.href =
                "javascript: carga_bendicion('" +
                cadena +
                "','.x_or_pueblo','#bend" +
                sitio2.params["parcial"] +
                "');"
            }
          })
        }
        url = window.location.pathname
        var id_santo = $(".dia:visible").attr("id")
        var milecturasanto2 =
          url.replace("santos/santos_", "lecturas/lecturas_santos_") +
          " #" +
          id_santo
        var partespos4 = [
          "prim_lect",
          "salmo",
          "seg_lect",
          "aleluya",
          "evangelio",
        ]
        var $midiv = $("<div>")
          .attr("id", "mibuffer4")
          .removeClass("visibleb")
          .addClass("novisibleb")
        $("#scroller").append($midiv)
        $("#mibuffer4").load(milecturasanto2, function () {
          $("#mibuffer4 .ciclo" + miciclo)
            .siblings()
            .remove()
          var index4
          for (index4 = 0; index4 < partespos4.length; ++index4) {
            if ($("#mibuffer4 .x_" + partespos4[index4]).length) {
              var midiv4 = $("#mibuffer4 .x_" + partespos4[index4]).outerHTML()
              //
              pon_pref("x_snt_lct_" + partespos4[index4], midiv4)
            } else pon_pref("x_snt_lct_" + partespos4[index4], "nada")
          }
        }) //load lectura de santos

        break
      case "c":
        var partespos = [
          "titulo",
          "ant_ent",
          "acto_penit",
          "gloria",
          "colecta",
          "credo",
          "antes_or_fieles",
          "or_ofrend",
          "prefacio",
          "ant_com",
          "post_com",
          "or_pueblo",
        ]
        var index
        for (index = 0; index < partespos.length; ++index) {
          parte8 = partespos[index]
          if ($(".x_" + parte8 + ":visible").length) {
            pon_pref(
              "x_com_" + parte8,
              $(".x_" + parte8 + ":visible").outerHTML()
            )
          } else pon_pref("x_com_" + parte8, "nada")

          if (parte8 == "prefacio") {
            $(".x_prefacio a").each(function () {
              midirec = "m_estructura/prefacios/"
              sitio = parseURL(this.href)
              cadena = midirec + sitio.file + "#" + sitio.hash
              if (this.href.indexOf('javascript') !== 0) {
                this.href =
                  "javascript: cambia_a_pest('pf'); vete_a('" + cadena + "');"
              }
            })
          }
        }
        break
      case "le":
        if (document.getElementById("ciclo" + miciclo)) {
          document.getElementById("ciclo" + miciclo).checked = true
          document.getElementById("anno_" + tipoanno).checked = true
        }
        $(".cicloA, .cicloB, .cicloC").css("display", "none")
        $(".ciclo" + miciclo).css("display", "block")
        $(".annoprimo, .annosecundo").css("display", "none")
        if (tipoanno == "impar") {
          $(".annoprimo").css("display", "block")
        } else if (tipoanno == "par") $(".annosecundo").css("display", "block")
      
          if ($(".soysanto").length || $(".soytiempo").length) {
        
              if ($(".soysanto").length) {
                pestana8 = "_snt_lct_";
              } else
                pestana8 = "_tmp_lct_";
          var partespos = [
            "prim_lect",
            "salmo",
            "seg_lect",
            "aleluya",
            "evangelio",
          ]
          var index
          for (index = 0; index < partespos.length; ++index) {
            parte8 = partespos[index]
            if ($(".x_" + parte8 + ":visible").length) {
              pon_pref(
                "x" + pestana8 + parte8,
                $(".x_" + parte8 + ":visible").outerHTML()
              )
            } else pon_pref("x" + pestana8 + parte8, "nada")
          }
            
            $("a").each(function () {
              if (this.href.indexOf('javascript') !== 0 && this.href.length > 0) {
              this.href =
                "javascript: vete_a('" + extraerRutaDesdeMisalV2(this.href) + "');"
            }
          })
        }
        break
      case "pf":
        if ($(".dia:visible").length) {
          pon_pref("x_pf_prefacio", $(".dia:visible").outerHTML())
        } else pon_pref("x_pf_prefacio", "nada")
        $(".octava_pascua").addClass("visibleb")

        Promise.all([
          carga_pagina(
            "m_estructura/prefacios/m_estructura_prefacios.html#introduccion2"
          ).then(function(contenido) {
            $(".meter_aqui").html(contenido)
          }),
          carga_pagina(
            "m_estructura/prefacios/m_estructura_prefacios.html#santus148"
          ).then(function(contenido) {
            $(".santus148").html(contenido)
          }),
        ]).then(function() {
          ajusta_idiomas(nuevoidioma1, nuevoidioma2)

          texto = $("#tab_pf").html()
          pon_pref("x_pf", texto)
          pon_pref("x_pf_prefacio", texto)
        })

        //  carga_pagina("m_estructura/prefacios/m_estructura_prefacios.html#introduccion").then(function(contenido2) {
        //    $(".meter_aqui").html(contenido2)
        //    ajusta_idiomas(nuevoidioma1, nuevoidioma2)
        //  });
        break
      case "pe":
        url = window.location.pathname
        filename = url.substring(url.lastIndexOf("/") + 1)
        $(".alternativa").addClass("visibleb")
        if ($("#contenido_pf").length) {
          pon_pref("x_pe_prefacio", $("#contenido_pf").html())
        } else pon_pref("x_pe_prefacio", "nada")
        if ($("#contenido_pe").length) {
          pon_pref("x_pe_pleg", $("#contenido_pe").html())
        } else pon_pref("x_pe_pleg", "nada")
        break
    }
    //esta traca final busca algun enlace suelto
    $('a[href]').each(function () {
      var href = $(this).attr('href');
      // Verifica que no comience con "javascript:"
      if (href.indexOf('javascript:') !== 0&&(href.indexOf('devocionario') !== 0)) {
          $(this).removeAttr('href');
          $(this).attr('onclick', "vete_a('" + href + "')");
      }
  });



  }
  pon_noche2(dime_pref("valor_noche", "1"))
  if (mipreferencia["fondo"] == 1) {
    $(" .boton ").each(function () {
      $(this).removeClass("boton").addClass("botonBueno")
    })
  }

  // Verificar si es un dispositivo móvil
  var esDispositivoMovil =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  if (!esDispositivoMovil) {
    var elementos = document.querySelectorAll("[ontouchend]");
    for (var i = 0; i < elementos.length; i++) {
      var elemento = elementos[i];
      var contenido = elemento.getAttribute("ontouchend");
      elemento.removeAttribute("ontouchend");
      elemento.setAttribute("onclick", contenido);
    }
  }
  // lo anterior es para depuracion en navegador

  Promise.all(tareas).then(function() {
  reemplazarComentarios()
    myScroll.refresh();
  });
  
}

function cargado2() {
  // Stub - precisa implementação completa
  console.log("cargado2 chamado");
}

// Variáveis adicionais necessárias
var nuevoidioma1 = mipreferencia["segundoidioma"];
var nuevoidioma2 = mipreferencia["misal_pral"];
var mipestana = "o";

console.log("Missal ES5 carregado com sucesso");
