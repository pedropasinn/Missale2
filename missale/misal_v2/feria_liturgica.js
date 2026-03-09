// 1. Declarar variáveis globais que faltam
var esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
            (navigator.userAgent.indexOf('Macintosh') !== -1 && 'ontouchstart' in document);

// 2. Polyfill para String.prototype.endsWith (não existe em navegadores antigos)
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

// 3. Polyfill para String.prototype.includes
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}

// 4. Polyfill para Array.prototype.includes
if (!Array.prototype.includes) {
    Array.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start < 0) {
            start = Math.max(0, this.length + start);
        }
        for (var i = start; i < this.length; i++) {
            if (this[i] === search || (search !== search && this[i] !== this[i])) {
                return true;
            }
        }
        return false;
    };
}

// 5. Polyfill para NodeList.prototype.forEach
if (typeof NodeList !== 'undefined' && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// 6. Polyfill para Array.prototype.find
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

// 7. Polyfill para Object.keys (caso não exista)
if (!Object.keys) {
    Object.keys = function(obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    };
}

// 8. Polyfill básico para Promise (versão simplificada)
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
            for (var i = 0; i < self._handlers.length; i++) {
                self._handlers[i].onFulfilled(value);
            }
        }
        
        function reject(reason) {
            if (self._state !== 'pending') return;
            self._state = 'rejected';
            self._value = reason;
            for (var i = 0; i < self._handlers.length; i++) {
                self._handlers[i].onRejected(reason);
            }
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
                    if (result && typeof result.then === 'function') {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (e) {
                    reject(e);
                }
            }
            
            function handleError(reason) {
                try {
                    if (onRejected) {
                        var result = onRejected(reason);
                        resolve(result);
                    } else {
                        reject(reason);
                    }
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
    
    Promise.resolve = function(value) {
        return new Promise(function(resolve) { resolve(value); });
    };
    
    Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) { reject(reason); });
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
}

console.log("✅ Polyfills para Kindle carregados com sucesso");

// =============================================================================
// FIM DOS POLYFILLS - O código original começa abaixo
// =============================================================================

function calcularUsoLocalStorage() {
  var total = 0;
  for (var i = 0; i < localStorage.length; i++) {
    var clave = localStorage.key(i);
    var valor = localStorage.getItem(clave);
    total += ((clave.length + valor.length) * 2); // cada carácter ≈ 2 bytes
  }
  return total;
}

function limpiarLocalStorageInteligente() {
  var claves_a_preservar = [];
  var i, clave;

  for (i = 0; i < localStorage.length; i++) {
    clave = localStorage.key(i);
    if (clave.endsWith('_defecto') || clave === 'misintenciones') {
      claves_a_preservar.push(clave);
    }
  }

  var datos_preservados = {};
  for (i = 0; i < claves_a_preservar.length; i++) {
    clave = claves_a_preservar[i];
    datos_preservados[clave] = localStorage.getItem(clave);
  }

  localStorage.clear();

  for (var key in datos_preservados) {
    if (datos_preservados.hasOwnProperty(key)) {
      localStorage.setItem(key, datos_preservados[key]);
    }
  }
}

function pon_pref(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Registro antes de limpiar
    var uso_antes = calcularUsoLocalStorage();

    // Limpieza
    limpiarLocalStorageInteligente();

    var uso_despues = calcularUsoLocalStorage();

    // Intentar de nuevo
    try {
      localStorage.setItem(key, value);
    } catch (e2) {
      // Mostrar alerta al usuario
      alert(
        "⚠️ No se pudo guardar " + key + "'\n" +
        "Uso antes de limpiar: " + uso_antes + " bytes\n" +
        "Uso después de limpiar: " + uso_despues + " bytes\n\n" +
        "Haz una captura de esta pantalla y envíala al desarrollador para su análisis. Gracias."
      );
    }
  }
}

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
  });

  // Captura de errores JS - usando window.onerror para mayor compatibilidad
  window.onerror = function(message, source, lineno, colno, error) {
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

  // Captura de errores en promesas (solo si el navegador lo soporta)
  if (window.addEventListener && 'onunhandledrejection' in window) {
    window.addEventListener('unhandledrejection', function (event) {
      var reason = event.reason || {};
      var message = reason.message || reason.toString() || 'Error desconocido';
      var stack = reason.stack || 'No hay stack disponible';

      var fullMessage = [
        '🚨 Error en promesa no manejada',
        'SO: ' + osInfo,
        'Dispositivo: ' + deviceInfo,
        'Mensaje: ' + message,
        'Stack:\n' + stack
      ].join('\n');

      console.error(fullMessage);
      // Solo alertar si es un error crítico, no para dependencias faltantes comunes
      if (message.indexOf('iScroll') === -1) {
        alert(fullMessage);
      }
    });
  }

  console.log('✅ Manejador de errores con info de SO y dispositivo inicializado');
}


initGlobalErrorHandler();

function ejecutarCodigo(el) {
    var codigo = el.getAttribute("data-url");
    var funcion = new Function(codigo);
    funcion(); // Ejecuta el código almacenado en data-url
}
      function DiferenciaFechas(CadenaFecha1, CadenaFecha2) {
        //Obtiene los datos del formulario
        //CadenaFecha1 = formulario.fecha1.value
        //CadenaFecha2 = formulario.fecha2.value

        //Obtiene dia, mes y año
        var fecha1 = new fecha(CadenaFecha1)
        var fecha2 = new fecha(CadenaFecha2)

        //Obtiene objetos Date
        var miFecha1 = new Date(
          fecha1.anio,
          fecha1.mes - 1,
          fecha1.dia,
          10,
          0,
          0,
          0
        )
        var miFecha2 = new Date(
          fecha2.anio,
          fecha2.mes - 1,
          fecha2.dia,
          10,
          0,
          0,
          0
        )

        /*   Fórmula antigua. Parece que da problemas con DST (cambio hora)
                  //Resta fechas y redondea
                  var diferencia = miFecha1.getTime() - miFecha2.getTime()
                  var dias2 = Math.ceil(diferencia / (1000 * 60 * 60 * 24))

                 //    console.log(CadenaFecha1+'-'+CadenaFecha2+'='+dias)
               console.log('dias2= '+dias2);
              */

        date1 = Date.UTC(
          miFecha1.getFullYear(),
          miFecha1.getMonth(),
          miFecha1.getDate()
        )
        date2 = Date.UTC(
          miFecha2.getFullYear(),
          miFecha2.getMonth(),
          miFecha2.getDate()
        )
        var ms = date1 - date2
        dias = Math.ceil(ms / (1000 * 60 * 60 * 24))

        //console.log('dias= '+dias);

        //console.log( CadenaFecha1 + ' - '+CadenaFecha2+' diferencia= '+ eval(diferencia-ms))
        return dias

        /*
              return dias2;
              */
      }
      function fecha(cadena) {
        //Separador para la introduccion de las fechas
        var separador = "."

        //Separa por dia, mes y año
        if (cadena.indexOf(separador) != -1) {
          var posi1 = 0
          var posi2 = cadena.indexOf(separador, posi1 + 1)
          var posi3 = cadena.indexOf(separador, posi2 + 1)
          this.dia = cadena.substring(posi1, posi2)
          this.mes = cadena.substring(posi2 + 1, posi3)
          this.anio = cadena.substring(posi3 + 1, cadena.length)
        } else {
          this.dia = 0
          this.mes = 0
          this.anio = 0
        }
      }
      function suma_dias_a_fecha(cadena_fecha, dias) {
        var fecha1 = new fecha(cadena_fecha)

        var fecha_final = new Date(fecha1.anio, fecha1.mes - 1, fecha1.dia)

        fecha_final = new Date(
          fecha_final.getFullYear(),
          fecha_final.getMonth(),
          fecha_final.getDate() + dias
        )

        mes_final = fecha_final.getMonth() + 1
        dia_final = fecha_final.getDate()
        if (mes_final < 10) mes_final = "0" + mes_final
        if (dia_final < 10) dia_final = "0" + dia_final

        //console.log('form. nueva: suma '+dias+' a '+cadena_fecha+' da '+dia_final+"."+mes_final+"."+fecha_final.getFullYear())

        /*
              fecha_final = new Date( fecha1.anio, fecha1.mes-1, fecha1.dia );
              fecha_final.setDate(fecha_final.getDate()+dias);
                      mes_final=fecha_final.getMonth()+1;
                  dia_final=fecha_final.getDate();
                  if (mes_final<10) mes_final='0'+mes_final;
                  if (dia_final<10) dia_final='0'+dia_final;
              console.log('form. antigua: suma '+dias+' a '+cadena_fecha+' da '+dia_final+"."+mes_final+"."+fecha_final.getFullYear())
              */

        return dia_final + "." + mes_final + "." + fecha_final.getFullYear()
      }

      function domingo_pascua(inYear) {
        //   var easter DATE;

        var k = Math.floor(inYear / 100)
        var a = inYear % 19
        var b = inYear % 4
        var c = inYear % 7
        var q = Math.floor(k / 4)
        var p = Math.floor((13 + 8 * k) / 25)
        var m = (15 - p + k - q) % 30
        var d = (19 * a + m) % 30
        var n = (4 + k - q) % 7
        var e = (2 * b + 4 * c + 6 * d + n) % 7
        var easter = 0
        if (d + e <= 9) {
          easter = (22 + d + e) + ".03." + inYear
        } else if (d == 29 && e == 6) {
          easter = "19.04." + inYear
        } else if (d == 28 && e == 6 && a > 10) {
          easter = "18.04." + inYear
        } else {
          easter = "0" + (d + e - 9)
          easter = easter.substring(easter.length - 2) + ".04." + inYear
        }

        return easter
      }

      function bautismo(inYear) {
        var reyes = new Date(inYear, "00", "06")

        var resultado = suma_dias_a_fecha("06.01." + inYear, 7 - reyes.getDay())

        return resultado
      }
      function prim_adviento(inYear) {
        var navidad = new Date(inYear, "11", "25")
        var semanas = 3
        if (navidad.getDay() == 0) semanas = 4

        var resultado = suma_dias_a_fecha(
          "25.12." + inYear,
          -(semanas * 7 + navidad.getDay())
        )

        return resultado
      }

      function escribe_dia_actual(dia_relativo, orden_logico, parametro) {
        var resultado = ""

        if (orden_logico) {
          semana_actual = 1 + Math.floor((dia_relativo - parametro) / 7)
          dia_actual = (dia_relativo - parametro) % 7
        } else {
          semana_actual = parametro - Math.floor(-dia_relativo / 7)
          dia_actual = 7 - (-dia_relativo % 7)
        }

        var misemana = "0" + semana_actual
        misemana = misemana.substring(misemana.length - 2)
        midia = dia_actual
        switch (dia_actual) {
          case 0:
          case 7:
            if (!orden_logico) {
              ++semana_actual
              misemana = "0" + semana_actual
              misemana = misemana.substring(misemana.length - 2)
            }

            resultado =
              "<br>" +
              traduce(" semana") +
              semana_latin[semana_actual] +
              "<br>" +
              traduce("Domingo")
            midia = 0
            break
          case 1:
            resultado =
              "<br>" +
              traduce(" semana") +
              semana_latin[semana_actual] +
              "<br>" +
              traduce("Lunes")
            break
          case 2:
            resultado =
              "<br>" +
              traduce(" semana") +
              semana_latin[semana_actual] +
              "<br>" +
              traduce("Martes")
            break
          case 3:
            resultado =
              "<br>" +
              traduce(" semana") +
              semana_latin[semana_actual] +
              "<br>" +
              traduce("Miércoles")
            break
          case 4:
            resultado =
              "<br>" +
              traduce(" semana") +
              semana_latin[semana_actual] +
              "<br>" +
              traduce("Jueves")
            break
          case 5:
            resultado =
              "<br>" +
              traduce(" semana") +
              semana_latin[semana_actual] +
              "<br>" +
              traduce("Viernes")
            break
          case 6:
            resultado =
              "<br>" +
              traduce(" semana") +
              semana_latin[semana_actual] +
              "<br>" +
              traduce("Sábado")
            break
        }

        switch (
          mienlace_lecturas["dia"].substring(
            mienlace_lecturas["dia"].length - 2
          )
        ) {
          case "to":
            mienlace_misa["dia"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_ordinario.html#OT" +
              misemana
            mienlace_lecturas["dia"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_to_" +
              misemana +
              ".html#O" +
              misemana +
              midia +
              "I"
            if (midia == 0) {
              es_domingo_to = true
            } else es_domingo_to = false
            break
          case "_q":
            mienlace_misa["dia"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_cuaresma.html#Q" +
              misemana +
              midia
            mienlace_lecturas["dia"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_q" +
              misemana +
              ".html#Q" +
              misemana +
              midia +
              "D"
            break
          case "_p":
            mienlace_misa["dia"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_pascua.html#P" +
              misemana +
              midia
            mienlace_lecturas["dia"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p" +
              misemana +
              ".html#P" +
              misemana +
              midia +
              "D"
            break
          case "dv":
            mienlace_misa["dia"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A" +
              misemana +
              midia
            mienlace_lecturas["dia"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_adv_" +
              misemana +
              ".html#A" +
              misemana +
              midia

            break
          case "av":
            mienlace_misa["dia"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A17" +
              midia
            mienlace_lecturas["dia"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_" +
              misemana +
              ".html#A" +
              misemana +
              midia
            break
        }
        return resultado
      }
      // -------------------------------- aqui empieza la funcion -------------------------------------

      function dia_liturgico(CadenaFecha) {
        var resultado = ""
        var mifecha0 = new fecha(CadenaFecha)
        var miFecha = new Date(mifecha0.anio, mifecha0.mes - 1, mifecha0.dia)
        var miFechaLatin =
          parseInt(mifecha0.dia) +
          "." +
          semana_latin[mifecha0.mes] +
          "." +
          mifecha0.anio
        var mianio = CadenaFecha.substring(CadenaFecha.length - 4)
        var fbautismo = bautismo(mifecha0.anio)
        var fpascua = domingo_pascua(mifecha0.anio)
        var fdom1adv = prim_adviento(mifecha0.anio)
        var framos = suma_dias_a_fecha(fpascua, -7)
        var fceniza = suma_dias_a_fecha(fpascua, -46)
        var fascension = suma_dias_a_fecha(fpascua, 40)
        var fpentecostes = suma_dias_a_fecha(fpascua, 49)
        var ftrinidad = suma_dias_a_fecha(fpascua, 56)
        var fcorpus = suma_dias_a_fecha(fpascua, 63)

        pon_pref("mianno", miFecha.getFullYear())
        mitexto = ""
        santosdia = ""
        m = mifecha0.mes
        d = mifecha0.dia
        if (m < 10) m = "0" + m
        if (d < 10) d = "0" + d
        CadenaFecha = d + "." + m + "." + mifecha0.anio

        if (DiferenciaFechas(CadenaFecha, fdom1adv) >= 0) {
          aniociclo = Number(mifecha0.anio) + 1
        } else aniociclo = mifecha0.anio
        miciclo = ciclos[(aniociclo - 1969) % 3]
        mitipoanio = tiposanio[aniociclo % 2]
        tipoanio2 = tiposanio2[aniociclo % 2]
        mitipoanio3 = tiposanio3[aniociclo % 2]

        if (CadenaFecha == "01.01." + mianio) {
          resultado = traduce("Tiempo de Navidad")
          resultado +=
            "<br>Sanctæ Dei Genetricis Maríæ<br><span class=red>(Sollemnitas)</span>"
          mienlace_misa["dia"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A141"
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A141"
        } else if (DiferenciaFechas(CadenaFecha, fbautismo) < 0) {
          resultado = traduce("Tiempo de Navidad")
          mitiempo = "2"

          if (miFecha.getDay() == 0) {
            if (d == "06") {
              mitexto += "<br>Epiphania<br><span class=red>(Sollemnitas)</span>"
              mienlace_texto["dia"] = "Epiphania"
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A170"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A170"
              mienlace_texto["alternativa2"] = "Epiphania (Vigilia)"
              mienlace_misa["alternativa2"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A170b"
              mienlace_lecturas["alternativa2"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A170"
            } else {
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A160"
              mienlace_texto["dia"] = "Dominica II post Nativitatem"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A160"
              mitexto +=
                traduce(" semana") +
                "II" +
                "<br>" +
                traduce("Domingo") +
                "<br><span class=red>In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente:</span><br>In Epiphania Domini<br>"
              mienlace_texto["alternativa"] = "Epiphania"
              mienlace_misa["alternativa"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A170"
              mienlace_lecturas["alternativa"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A170"
              mienlace_texto["alternativa2"] = "Epiphania (Vigilia)"
              mienlace_misa["alternativa2"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A170b"
              mienlace_lecturas["alternativa2"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A170"
            }
          } else {
            switch (d) {
              case "02":
                mitexto += "2 ianuarii<br>"
                mienlace_texto["dia"] = "2 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A172"
                break
              case "03":
                mitexto += "3 ianuarii<br>"
                mienlace_texto["dia"] = "3 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A173"
                break
              case "04":
                mitexto += "4 ianuarii<br>"
                mienlace_texto["dia"] = "4 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A174"
                break
              case "05":
                mitexto += "5 ianuarii<br>"
                mienlace_texto["dia"] = "5 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A175"
                break
              case "06":
                mitexto += "6 ianuarii<br>"
                mitexto +=
                  "<br>Epiphania<br><span class=red>(Sollemnitas)</span><br>"
                mienlace_texto["dia"] = "Epiphania"
                mienlace_misa["dia"] =
                  "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A170"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A170"
                mienlace_texto["alternativa2"] = "Epiphania (Vigilia)"
                mienlace_misa["alternativa2"] =
                  "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A170b"
                mienlace_lecturas["alternativa2"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A170"
                mienlace_texto["alternativa"] = "6 ianuarii"
                //mienlace_misa['alternativa'] = "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A160"
                mitexto +=
                  "<br><span class=red>(In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente: </span>Die 6 ianuarii"
                mienlace_lecturas["alternativa"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A176"
                break
              case "07":
                mitexto += "7 ianuarii<br>"
                mienlace_texto["dia"] = "7 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A177b"
                break
              case "08":
                mitexto += "8 ianuarii<br>"
                mienlace_texto["dia"] = "8 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A178"
                break
              case "09":
                mitexto += "9 ianuarii<br>"
                mienlace_texto["dia"] = "9 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A179"
                break
              case "10":
                mitexto += "10 ianuarii<br>"
                mienlace_texto["dia"] = "10 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A1710"
                break
              case "11":
                mitexto += "11 ianuarii<br>"
                mienlace_texto["dia"] = "11 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A1711"
                break
              case "12":
                mitexto += "12 ianuarii<br>"
                mienlace_texto["dia"] = "12 ianuarii"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A1712"
                break
            }
            switch (miFecha.getDay()) {
              case 1:
                if (d != "06") {
                  mienlace_misa["dia"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A171"
                } else
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A171"
                if (d > "02" && d != "07") {
                  mitexto +=
                    traduce(" semana") +
                    "II" +
                    "<br><span class=red>In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente:</span><br>Feria II<br>"
                  mienlace_texto["alternativa"] = "Feria II"
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A171"
                  mienlace_lecturas["alternativa"] =
                    "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A177b"
                }
                break
              case 2:
                if (d != "06") {
                  mienlace_misa["dia"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A172"
                } else
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A172"
                if (d > "03" && d != "08") {
                  mitexto +=
                    traduce(" semana") +
                    "II" +
                    "<br><span class=red>In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente:</span><br>Feria III<br>"
                  mienlace_texto["alternativa"] = "Feria III"
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A172"
                  mienlace_lecturas["alternativa"] =
                    "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A178"
                }
                break
              case 3:
                if (d != "06") {
                  mienlace_misa["dia"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A173"
                } else
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A173"
                if (d > "04" && d != "09") {
                  mitexto +=
                    traduce(" semana") +
                    "II" +
                    "<br><span class=red>In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente:</span><br>Feria IV<br>"
                  mienlace_texto["alternativa"] = "Feria IV"
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A173"
                  mienlace_lecturas["alternativa"] =
                    "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A179"
                }
                break
              case 4:
                if (d != "06") {
                  mienlace_misa["dia"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A174"
                } else
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A174"
                if (d > "05" && d != "10") {
                  mitexto +=
                    traduce(" semana") +
                    "II" +
                    "<br><span class=red>In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente:</span><br>Feria IV<br>"
                  mienlace_texto["alternativa"] = "Feria V"
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A174"
                  mienlace_lecturas["alternativa"] =
                    "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A1710"
                }
                break
              case 5:
                if (d != "06") {
                  mienlace_misa["dia"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A175"
                } else
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A175"
                if (d > "06" && d != "11") {
                  mitexto +=
                    traduce(" semana") +
                    "II" +
                    "<br><span class=red>In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente:</span><br>Feria VI<br>"
                  mienlace_texto["alternativa"] = "Feria VI"
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A175"
                  mienlace_lecturas["alternativa"] =
                    "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A1711"
                }
                break
              case 6:
                if (d != "06") {
                  mienlace_misa["dia"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A176"
                } else
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A176"
                if (d == "07") {
                  mitexto +=
                    traduce(" semana") +
                    "II" +
                    "<br><span class=red>In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente:</span><br>Sabbato<br>"
                  mienlace_texto["alternativa"] = "Sabbato"
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A176"
                  mienlace_lecturas["alternativa"] =
                    "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A177a"
                } else if (d > "06" && d != "12") {
                  mitexto +=
                    traduce(" semana") +
                    "II" +
                    "<br><span class=red>In regionibus ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente:</span><br>Sabbato<br>"
                  mienlace_texto["alternativa"] = "Sabbato"
                  mienlace_misa["alternativa"] =
                    "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A176"
                  mienlace_lecturas["alternativa"] =
                    "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A1712"
                }
                break
            }
          }
          resultado += "<br>" + mitexto
          santosdia += santos(CadenaFecha, 1)
        } else if (CadenaFecha == fbautismo) {
          resultado = traduce("Bautismo del Señor")
          mienlace_texto["dia"] = traduce("Bautismo del Señor")
          mienlace_misa["dia"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A810"
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A810"

          if (d == "07" || d == "08") {
            resultado +=
              "<br><span class=red>In regionibus ubi Epiphania celebratur dominica diebus 7 vel&nbsp;8 ianuarii occurrente:</span><br>Epiphania<br>"
            mienlace_texto["alternativa"] = "Epiphania"
            mienlace_misa["alternativa"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A170"
            mienlace_lecturas["alternativa"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A170"
            mienlace_texto["alternativa2"] = "Epiphania (Vigilia)"
            mienlace_misa["alternativa2"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A170b"
            mienlace_lecturas["alternativa2"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_02.html#A170"
          }
        } else if (DiferenciaFechas(CadenaFecha, fceniza) < 0) {
          resultado = ""
          var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fbautismo)

          resultado += traduce("Tiempo Ordinario")
          mitiempo = "3"
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_to"
          resultado += escribe_dia_actual(dia_del_tiempo, true, 0)
          if (dia_del_tiempo == 1) {
            if (d == "08" || d == "09") {
              mienlace_texto["dia"] = "Feria II"
              resultado +=
                "<br><span class=red>In regionibus ubi Epiphania celebratur dominica diebus 7 vel&nbsp;8 ianuarii occurrente:</span><br>In Baptismate Domini<br>"
              mienlace_texto["alternativa"] = traduce("Bautismo del Señor")
              mienlace_misa["alternativa"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A810"
              mienlace_lecturas["alternativa"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_03.html#A810"
            }
          }

          santosdia += santos(CadenaFecha, 3)
        } else if (CadenaFecha == fceniza) {
          resultado =
            traduce("Tiempo de Cuaresma") +
            "<br>" +
            traduce("Miércoles de ceniza")
          santosdia += santos(CadenaFecha, 2)
          mienlace_misa["dia"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_cuaresma.html#Q003"
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_q00.html#Q003D"
        } else if (DiferenciaFechas(CadenaFecha, framos) < 0) {
          resultado = traduce("Tiempo de Cuaresma")
          var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fceniza)
          switch (dia_del_tiempo) {
            case 1:
              resultado += "<br>" + traduce("Jueves después de ceniza")
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_cuaresma.html#Q004"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_q00.html#Q004D"
              break
            case 2:
              resultado += "<br>" + traduce("Viernes después de ceniza")
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_cuaresma.html#Q005"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_q00.html#Q005D"
              break
            case 3:
              resultado += "<br>" + traduce("Sábado después de ceniza")
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_cuaresma.html#Q006"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_q00.html#Q006D"
              break
            default:
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_q"
              resultado += escribe_dia_actual(dia_del_tiempo, true, 4)
          }
          santosdia += santos(CadenaFecha, 2)
        } else if (CadenaFecha == framos) {
          resultado = traduce("Domingo de Ramos")
          santosdia += santos(CadenaFecha, 2)
          mienlace_misa["dia"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_semanasta.html#SS00"
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_s00.html#S000D"
        } else if (DiferenciaFechas(CadenaFecha, fpascua) < 0) {
          resultado = traduce("Semana Santa")
          mienlace_misa["dia"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_semanasta.html#SS0" +
            DiferenciaFechas(CadenaFecha, framos)
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_s01.html#S00" +
            DiferenciaFechas(CadenaFecha, framos) +
            "D"
          switch (DiferenciaFechas(CadenaFecha, framos)) {
            case 1:
              resultado += "<br>" + traduce("Lunes Santo")
              break
            case 2:
              resultado += "<br>" + traduce("Martes Santo")
              break
            case 3:
              resultado += "<br>" + traduce("Miércoles Santo")
              break
            case 4:
              resultado += "<br>" + traduce("Jueves Santo")
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_semanasta3.html#SS04"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_s01.html#S004D"
              mienlace_texto["dia"] = "Ad Missam vespertinam"
              mienlace_texto["alternativa"] = "Ad Missam chrismatis"
              mienlace_misa["alternativa"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_semanasta2.html#SS04A"
              mienlace_lecturas["alternativa"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_s01.html#S004DA"
              break
            case 5:
              resultado += "<br>" + traduce("Viernes Santo")
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_semanasta4.html#SS05"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_s02.html#S005D"
              break
            case 6:
              resultado += "<br>" + traduce("Sábado Santo")
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_semanasta5.html#SS06"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_s03.html#S006D"
              mienlace_texto["dia"] = "Vigilia Paschalis"

              break
          }
          santosdia += santos(CadenaFecha, 2)
        } else if (CadenaFecha == fpascua) {
          resultado = traduce("Pascua de Resurrección")
          santosdia += santos(CadenaFecha, 2)
          mienlace_misa["dia"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_pascua.html#P010"
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p01.html#P010D"
          mienlace_texto["dia"] = "Ad Missam in Die"
        } else if (DiferenciaFechas(CadenaFecha, fpentecostes) < 0) {
          resultado = traduce("Tiempo de Pascua")
          var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fpascua)
          if (dia_del_tiempo == 39) {
            resultado +=
              "<br>" +
              traduce(
                "Ascénsión del Señor<br>(si no se traslada al domingo siguiente)"
              )
          } else if (dia_del_tiempo == 42)
            resultado +=
              "<br>Ascénsión del Señor<br>(si ha sido trasladada del jueves anterior)"

          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p"
          mienlace_texto["dia"] = "Feria currente"
          resultado += escribe_dia_actual(dia_del_tiempo, true, 0)

          if (
            dia_del_tiempo == 13 &&
            (mimisal_1 == "cast" || mimisal_2 == "cast")
          ) {
            resultado_santos += "<br>Argentina: Nuestra Señora del Valle<br>"
            mienlace_texto["alternativa0"] =
              "Argentina: Nuestra Señora del Valle"
            mienlace_santo["alternativa0"] =
              "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0544"
          } else if (dia_del_tiempo == 39) {
            mienlace_texto["dia"] = "Feria V"
            mienlace_texto["alternativa2"] =
              "IN ASCENSIONE DOMINI. Ad Missam in Die"
            mienlace_misa["alternativa2"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_pascua.html#P064B"
            mienlace_lecturas["alternativa2"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p06.html#P064F"
            mienlace_texto["alternativa"] =
              "IN ASCENSIONE DOMINI. Ad Missam in Vigilia"
            mienlace_misa["alternativa"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_pascua.html#P064A"
            mienlace_lecturas["alternativa"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p06.html#P064F"
          } else if (dia_del_tiempo == 42) {
            mienlace_texto["dia"] = "Dominica"
            mienlace_texto["alternativa2"] =
              "IN ASCENSIONE DOMINI. Ad Missam in Die"
            mienlace_misa["alternativa2"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_pascua.html#P064B"
            mienlace_lecturas["alternativa2"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p06.html#P064F"
            mienlace_texto["alternativa"] =
              "IN ASCENSIONE DOMINI. Ad Missam in Vigilia"
            mienlace_misa["alternativa"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_pascua.html#P064A"
            mienlace_lecturas["alternativa"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p06.html#P064F"
          }

          santosdia += santos(CadenaFecha, 2)
        } else if (CadenaFecha == fpentecostes) {
          resultado = traduce("Tiempo de Pascua<br>Pentecostés")
          santosdia += santos(CadenaFecha, 1)
          mienlace_texto["dia"] = "Ad Missam in Die"
          mienlace_misa["dia"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_pascua.html#P080"
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p08.html#P080D"
          mienlace_texto["alternativa"] = "Ad Missam in Vigilia"
          mienlace_misa["alternativa"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_pascua.html#P080A"
          mienlace_lecturas["alternativa"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_p08.html#P080E"
        } else if (DiferenciaFechas(CadenaFecha, fdom1adv) < 0) {
          resultado = traduce("Tiempo Ordinario")
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_to"

          switch (DiferenciaFechas(CadenaFecha, fpentecostes)) {
            case 1:
              var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fdom1adv)
              resultado += escribe_dia_actual(dia_del_tiempo, false, 34)
              santos_aux = "B.M.V. Ecclesiæ Matris<br>"
              mienlace_santo["otro88"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0535"
              mienlace_texto["otro88"] = "B.M.V. Ecclesiæ Matris"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Pfingstmontag"
                mienlace_santo["otro8"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0534"
                mienlace_texto["otro8"] = "In deutscher Sprache: Pfingstmontag"
              }
              break
            case 4:
              var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fdom1adv)
              resultado += escribe_dia_actual(dia_del_tiempo, false, 34)
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>España: Jesucristo Sumo y Eterno Sacerdote (Fiesta)"
                mienlace_santo["alternativa0"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0533"
                mienlace_texto["alternativa0"] =
                  "España: Jesucristo Sumo y Eterno Sacerdote"
              }
              break
            case 7:
              resultado += "<br>" + traduce("Santísima Trinidad")
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_ordinario.html#OT51"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_to_50.html#O510I"
              break
            case 11:
              resultado +=
                "<br>" +
                traduce(
                  "Corpus Christi<br>(si no se traslada al domingo siguiente)"
                )
              var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fdom1adv)
              resultado += escribe_dia_actual(dia_del_tiempo, false, 34)
              mienlace_texto["dia"] = "Feria V"
              mienlace_texto["alternativa"] =
                "Sanctissimi Corporis et Sanguinis Christi"
              mienlace_misa["alternativa"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_ordinario.html#OT52"
              mienlace_lecturas["alternativa"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_to_50.html#O520I"

              break
            case 14:
              var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fdom1adv)
              resultado += escribe_dia_actual(dia_del_tiempo, false, 34)
              mienlace_texto["dia"] = "Dominica"
              resultado +=
                "<br>" +
                traduce(
                  "Corpus Christi<br>(si ha sido trasladada del jueves anterior)"
                )
              mienlace_texto["alternativa"] =
                "Sanctissimi Corporis et Sanguinis Christi"
              mienlace_misa["alternativa"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_ordinario.html#OT52"
              mienlace_lecturas["alternativa"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_to_50.html#O520I"
              break
            case 19:
              resultado += "<br>" + traduce("Sagrado Corazón de Jesús")
              mienlace_texto["dia"] = "Sacratissimi Cordis Iesu"
              mienlace_misa["dia"] =
                "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_ordinario.html#OT53"
              mienlace_lecturas["dia"] =
                "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_to_50.html#O530I"
              break
            case 20:
              resultado_santos +=
                "<br>" + traduce("Inmaculado Corazón de María") + "<br>"
              mienlace_santo["alternativa0"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0532"
              mienlace_texto["alternativa0"] = traduce(
                "Inmaculado Corazón de María"
              )
            default:
              if (DiferenciaFechas(CadenaFecha, fdom1adv) == -7) {
                resultado += "<br>" + traduce("Jesucristo Rey del Universo")
                mienlace_texto["dia"] =
                  "Domini nostri Iesu Christi universorum Regis"
                mienlace_misa["dia"] =
                  "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_ordinario.html#OT54"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_to_50.html#O540I"
              } else {
                var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fdom1adv)
                resultado += escribe_dia_actual(dia_del_tiempo, false, 34)
              }
          }
          santosdia += santos(CadenaFecha, 3)
        } else if (DiferenciaFechas(CadenaFecha, "25.12." + mianio) < 0) {
          resultado = traduce("Tiempo de Adviento")

          if (
            DiferenciaFechas(CadenaFecha, "16.12." + mianio) > 0 &&
            miFecha.getDay() != 0
          ) {
            resultado += "<br>Die " + d + " decembris"
            mienlace_misa["dia"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A1" +
              d
            mienlace_lecturas["dia"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_adv_04.html#A1" +
              d
            santosdia += santos(CadenaFecha, 1)
          } else {
            mienlace_lecturas["dia"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_adv"
            var dia_del_tiempo = DiferenciaFechas(CadenaFecha, fdom1adv)
            resultado += escribe_dia_actual(dia_del_tiempo, true, 0)
            santosdia += santos(CadenaFecha, 1)
          }
        } else if (CadenaFecha == "25.12." + mianio) {
          resultado = traduce("Natividad")
          mienlace_texto["dia"] = "Ad Missam in Die"
          mienlace_misa["dia"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A125"
          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_01.html#A125"
          mienlace_texto["alternativa"] = "Ad Missam in Vigilia"
          mienlace_misa["alternativa"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A1251"
          mienlace_lecturas["alternativa"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_01.html#A1251"
          mienlace_texto["alternativa2"] = "Ad Missam in nocte"
          mienlace_misa["alternativa2"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A1252"
          mienlace_lecturas["alternativa2"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_01.html#A1252"
          mienlace_texto["alternativa3"] = "Ad Missam in aurora"
          mienlace_misa["alternativa3"] =
            "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A1253"
          mienlace_lecturas["alternativa3"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_01.html#A1253"
        } else if (DiferenciaFechas(CadenaFecha, "31.12." + mianio) <= 0) {
          resultado = traduce("Tiempo de Navidad")

          mienlace_lecturas["dia"] =
            "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav"

          var navidad = new Date(mianio, "11", "25")
          if (
            (navidad.getDay() == 0 && CadenaFecha.substring(0, 2) == "30") ||
            miFecha.getDay() == 0
          ) {
            resultado += "<br>" + traduce("La Sagrada Familia")
            mienlace_misa["dia"] =
              "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A140"
            mienlace_lecturas["dia"] =
              "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_01.html#A140"
          } else {
            switch (CadenaFecha.substring(0, 2)) {
              case "26":
                resultado += "<br>Infra Octavam Nativitatis"
                mienlace_misa["dia"] = "../misal_v2/indice_tiempos.html"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_santos_dic.html#1226"
                break
              case "27":
                resultado += "<br>Infra Octavam Nativitatis"
                mienlace_misa["dia"] = "../misal_v2/indice_tiempos.html"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_santos_dic.html#1227"
                break
              case "28":
                resultado += "<br>Infra Octavam Nativitatis"
                mienlace_misa["dia"] = "../misal_v2/indice_tiempos.html"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_santos_dic.html#1228"
                break
              case "29":
                resultado += "<br>" + traduce("Día V de la Octava de Navidad")
                mienlace_misa["dia"] =
                  "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A129"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_01.html#A129"
                break
              case "30":
                resultado += "<br>" + traduce("Día VI de la Octava de Navidad")
                mienlace_misa["dia"] =
                  "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A130"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_01.html#A130"
                break
              case "31":
                resultado += "<br>" + traduce("Día VII de la Octava de Navidad")
                mienlace_misa["dia"] =
                  "../misal_v2/m_estructura/tiempos/m_estructura_tiempos_advnav.html#A131"
                mienlace_lecturas["dia"] =
                  "../misal_v2/m_estructura/lecturas/m_estructura_lecturas_nav_01.html#A131"
                break
            }
          }
          santosdia += santos(CadenaFecha, 1)
        }
        if (
          (mimisal_1 == "engl" || mimisal_2 == "engl") &&
          m == 11 &&
          d > 21 &&
          d < 29 &&
          miFecha.getDay() == 4
        ) {
          santosdia += "<br>United States: Thanksgiving Day"
          mienlace_texto["otro_888"] = "United States: Thanksgiving Day"
          mienlace_santo["otro_888"] =
            "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1130Z"
        }
        
        
        resultado = "<div style='width: 100%;'>" + resultado + "</div>"
        santosdia =
          "<div style='width: 100%; line-height: 120%;'>" + santosdia + "</div>"
        return (
          '<div id="rotulo" class="red" >'+miFechaLatin+'</div><div style="width: 100%; line-height: 120%;"><br><span class=red>Ciclo <b>' +
          miciclo +
          "</b> , <b>" +
          mitipoanio +
          "</b></span><br></div>" +
          resultado +
          santosdia
        )
      }

      function traduce(text_orig) {
        if (lengua == "latin") {
          switch (text_orig) {
            case "San Esteban":
              return "S. Stephani, Protomartyris"
              break
            case "San Juan Evangelista":
              return "S. Ioannis, Apostoli et Evangelistæ"
              break
            case "Santos Inocentes":
              return "SS. Innocentium, Martyrum"
              break
            case "Día V de la Octava de Navidad":
              return "De Die V infra Octavam Nativitatis"
              break
            case "Día VI de la Octava de Navidad":
              return "De Die VI infra Octavam Nativitatis"
              break
            case "Día VII de la Octava de Navidad":
              return "De Die VII infra Octavam Nativitatis"
              break
            case " semana":
              return " Hebdomada "
              break
            case "Domingo":
              return "Dominica "
              break
            case "Lunes":
              return "Feria secunda "
              break
            case "Martes":
              return "Feria tertia "
              break
            case "Miércoles":
              return "Feria quarta "
              break
            case "Jueves":
              return "Feria quinta "
              break
            case "Viernes":
              return "Feria sexta "
              break
            case "Sábado":
              return "Sabbato "
              break
            case "Santa María Madre de Dios":
              return "Sanctæ Dei Genetricis Maríæ"
              break
            case "Epifanía":
              return "In Epiphania Domini"
              break
            case "(si se traslada al domingo siguiente: ":
              return "(ubi celebratur dominica a die 2 ad diem 8 ianuarii occurrente:<br>"
              break
            case "(donde se traslada a este domingo: Epifanía del Señor)":
              return "(ubi sollemnitas Epiphaniæ Domini celebratur hæc dominica)"
              break
            case "Bautismo del Señor":
              return "In Baptismate Domini"
              break
            case "(si el domingo anterior se celebró la Epifanía: Bautismo del Señor)":
              return "(ubi sollemnitas Epiphaniæ Domini celebratur dominica a die 2 ad diem 8 ianuarii occurrente)"
              break
            case "Miércoles de ceniza":
              return "Feria IV Cinerum"
              break
            case "Tiempo de Cuaresma":
              return "Tempus Quadragesimæ"
              break
            case "Jueves después de ceniza":
              return "Feria V post Cineres"
              break
            case "Viernes después de ceniza":
              return "Feria VI post Cineres"
              break
            case "Sábado después de ceniza":
              return "Sabbato post Cineres"
              break
            case "Domingo de Ramos":
              return "Dominica de Passione Domini"
              break
            case "Semana Santa":
              return "Hebdomada Sancta"
              break
            case "Lunes Santo":
              return "Feria secunda"
              break
            case "Martes Santo":
              return "Feria tertia"
              break
            case "Miércoles Santo":
              return "Feria quarta"
              break
            case "Jueves Santo":
              return "Feria V in Cena Domini"
              break
            case "Viernes Santo":
              return "Feria VI in Passioni Domini"
              break
            case "Sábado Santo":
              return "Sabbato Sancto"
              break
            case "Pascua de Resurrección":
              return "Dominica Resurrectionis"
              break
            case "Tiempo de Pascua":
              return "Tempus Paschale"
              break
            case "Ascénsión del Señor<br>(si no se traslada al domingo siguiente)":
              return "In Ascensione Domini<br>(ubi ad dominicam sequentem non transfertur)"
              break
            case "Ascénsión del Señor<br>(si ha sido trasladada del jueves anterior)":
              return "In Ascensione Domini<br>(ubi ad dominicam transfertur)"
              break
            case "Tiempo de Pascua<br>Pentecostés":
              return "Tempus Paschale<br>Pentecostes"
              break
            case "Tiempo Ordinario":
              return "Tempus Per Annum"
              break
            case "Jesucristo Sumo y Eterno Sacerdote":
              return "D.N.I.C. Summi et &AElig;terni Sacerdotis"
              break
            case "Santísima Trinidad":
              return "Sanctissimæ Trinitatis"
              break
            case "Corpus Christi<br>(si no se traslada al domingo siguiente)":
              return "Sanctissimi Corporis et Sanguinis Christi<br>(ubi ad dominicam sequentem non transfertur)"
              break
            case "Corpus Christi<br>(si ha sido trasladada del jueves anterior)":
              return "Sanctissimi Corporis et Sanguinis Christi<br>(ubi ad dominicam transfertur)"
              break
            case "Sagrado Corazón de Jesús":
              return "Sacratissimi Cordis Iesu"
              break
            case "Inmaculado Corazón de María":
              return "Immaculati Cordis Beatæ Maríæ Virginis"
              break
            case "Jesucristo Rey del Universo":
              return "D.N.I.C. Universorum Regis"
              break
            case "Tiempo de Adviento":
              return "Tempus Adventus"
              break
            case "Natividad":
              return "In Nativitate Domini"
              break
            case "Tiempo de Navidad":
              return "Tempus Nativitatis"
              break
            case "La Sagrada Familia":
              return "Sanctæ Familiæ Iesu, Maríæ et Ioseph"
              break
          }
        } else if (lengua == "griego") {
          switch (text_orig) {
            case "San Esteban":
              return ""
              break
            case "San Juan Evangelista":
              return ""
              break
            case "Santos Inocentes":
              return ""
              break
            case "Día V de la Octava de Navidad":
              return ""
              break
            case "Día VI de la Octava de Navidad":
              return ""
              break
            case "Día VII de la Octava de Navidad":
              return ""
              break
            case "":
              return ""
              break
            case " semana":
              return ""
              break
            case "Domingo":
              return ""
              break
            case "Lunes":
              return ""
              break
            case "Martes":
              return ""
              break
            case "Miércoles":
              return ""
              break
            case "Jueves":
              return ""
              break
            case "Viernes":
              return ""
              break
            case "Sábado":
              return ""
              break
            case "Santa María Madre de Dios":
              return ""
              break
            case "Epifanía":
              return ""
              break
            case "(si se traslada al domingo siguiente: ":
              return ""
              break
            case "(donde se traslada a este domingo: Epifanía del Señor)":
              return ""
              break
            case "Bautismo del Señor":
              return ""
              break
            case "(si el domingo anterior se celebró la Epifanía: Bautismo del Señor)":
              return ""
              break
            case "Miércoles de ceniza":
              return ""
              break
            case "Tiempo de Cuaresma":
              return ""
              break
            case "Jueves después de ceniza":
              return ""
              break
            case "Viernes después de ceniza":
              return ""
              break
            case "Sábado después de ceniza":
              return ""
              break
            case "Domingo de Ramos":
              return ""
              break
            case "Semana Santa":
              return ""
              break
            case "Lunes Santo":
              return ""
              break
            case "Martes Santo":
              return ""
              break
            case "Miércoles Santo":
              return ""
              break
            case "Jueves Santo":
              return ""
              break
            case "Viernes Santo":
              return ""
              break
            case "Sábado Santo":
              return ""
              break
            case "Pascua de Resurrección":
              return ""
              break
            case "Tiempo de Pascua":
              return ""
              break
            case "Ascénsión del Señor<br>(si no se traslada al domingo siguiente)":
              return ""
              break
            case "Ascénsión del Señor<br>(si ha sido trasladada del jueves anterior)":
              return ""
              break
            case "Tiempo de Pascua<br>Pentecostés":
              return ""
              break
            case "Tiempo Ordinario":
              return ""
              break
            case "Jesucristo Sumo y Eterno Sacerdote":
              return ""
              break
            case "Santísima Trinidad":
              return ""
              break
            case "Corpus Christi<br>(si no se traslada al domingo siguiente)":
              return ""
              break
            case "Corpus Christi<br>(si ha sido trasladada del jueves anterior)":
              return ""
              break
            case "Sagrado Corazón de Jesús":
              return ""
              break
            case "Inmaculado Corazón de María":
              return ""
              break
            case "Jesucristo Rey del Universo":
              return ""
              break
            case "Tiempo de Adviento":
              return ""
              break
            case "Natividad":
              return ""
              break
            case "Tiempo de Navidad":
              return ""
              break
            case "La Sagrada Familia":
              return ""
              break
          }
        } else return text_orig
      }

      function santos(CadenaFecha, tiempo) {
        var resultado = santos_aux
        var mesydia = CadenaFecha.substring(0, 5)
        var solodia = CadenaFecha.substring(0, 2)
        if (tiempo == 1) {
          switch (mesydia) {
            case "30.11":
              resultado +=
                "S. Andreæ, Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Andreæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1130"
              break
            case "01.12":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "Africa: Blessed Clementine Anuarite, Virgin and Martyr"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#1201"
                mienlace_texto["principal"] =
                  "Africa: Blessed Clementine Anuarite"
              }
              break
            case "02.12":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Luzius, Bischof, Märtyrer"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1202"
                mienlace_texto["principal"] = "In deutscher Sprache: Hl. Luzius"
              }
              break
            case "03.12":
              resultado +=
                "S. Francisci Xavier, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Francisci Xavier"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1203"
              break
            case "04.12":
              resultado +=
                "S. Ioannis Damasceni, Presbyteri et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Ioannis Damasceni"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1204"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Hl. Barbara, Märtyrin"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1204Z"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Barbara, Märtyrin"
              }
              break
            case "05.12":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Anno, Bischof"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1205"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Anno, Bischof"
              }
              break
            case "06.12":
              resultado += "S. Nicolai, Episcopi"
              mienlace_texto["principal"] = "S. Nicolai"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1206"
              break

            case "07.12":
              resultado +=
                "S. Ambrosii, Episcopi et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Ambrosii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1207"
              break

            case "08.12":
              resultado +=
                "In Conceptione Immaculata Beatæ Maríæ Virginis<br><span class=red>(Sollemnitas)</span>"
              mienlace_texto["principal"] =
                "In Conceptione Immaculata Beatæ Maríæ Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1208"
              break

            case "09.12":
              resultado += "S. Ioannis Didaci Cuauhtlatoatzin"
              mienlace_texto["principal"] = "S. Ioannis Didaci Cuauhtlatoatzin"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1209"
              break
            case "10.12":
              resultado += "Beatæ Maríæ Virginis De Loreto"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1210"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis De Loreto"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: Santa Eulalia de Mérida"
                mienlace_texto["otro"] = "España: Santa Eulalia de Mérida"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1210Z"
              }
              break

            case "11.12":
              resultado += "S. Damasi I, Papæ"
              mienlace_texto["principal"] = "S. Damasi I"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1211"
              break

            case "12.12":
              resultado += "Beatæ Maríæ Virginis De Guadalupe"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1212"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis De Guadalupe"

              break

            case "13.12":
              resultado +=
                "S. Luciæ, Virginis et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Luciæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1213"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Odilia, Äbtissin"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1213Z"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Odilia, Äbtissin"
              }
              break

            case "14.12":
              resultado +=
                "S. Ioannis A Cruce, Presbyteri et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Ioannis A Cruce"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1214"
              break

            case "21.12":
              resultado +=
                "S. Petri Canisii, Presbyteri et Ecclesiæ Doctoris<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Petri Canisii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1221"
              break

            case "23.12":
              resultado +=
                "S. Ioannis De Kety, Presbyteri<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Ioannis De Kety"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1223"
              break

            case "26.12":
              resultado +=
                "S. Stephani, Protomartyris<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Stephani"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1226"
              break

            case "27.12":
              resultado +=
                "S. Ioannis, Apostoli et Evangelistæ<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Ioannis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1227"
              break

            case "28.12":
              resultado +=
                "Ss. Innocentium, Martyrum<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "Ss. Innocentium"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1228"
              break

            case "29.12":
              resultado +=
                "S. Thomæ Becket, Episcopi et Martyris<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Thomæ Becket"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1229"
              break

            case "31.12":
              resultado +=
                "S. Silvestri I, Papæ<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Silvestri I"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_dic.html#1231"
              break

            case "02.01":
              resultado +=
                "Ss. Basilii Magni et Gregorii Nazianzeni, Episcoporum et Ecclesiæ Doctorum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] =
                "Ss. Basilii Magni et Gregorii Nazianzeni"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0102"
              break

            case "03.01":
              resultado += "Sanctissimi Nominis Iesu"
              mienlace_texto["principal"] = "Sanctissimi Nominis Iesu"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0103"
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "<br>En France : Sainte Geneviève, vierge"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0103"
                mienlace_texto["otro"] =
                  "En France : Sainte Geneviève"
              }
              break
            case "04.01":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "United States: Saint Elizabeth Ann Seton <span class=red>(M)</span>"
                mienlace_texto["principal"] =
                  "United States: Saint Elizabeth Ann Seton"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0104"
              }
              break
            case "05.01":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "United States: Saint John Neumann, Bishop <span class=red>(M)</span>"
                mienlace_texto["principal"] =
                  "United States: Saint John Neumann"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0105"
              }
              break
            case "06.01":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "United States: Saint André Bessette, Religious <span class=red>(M)</span>"
                mienlace_texto["principal"] =
                  "United States: Saint André Bessette"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0106"
              }
              break
            case "07.01":
              resultado += "S. Raimundi de Penyafort, presbyteri"
              mienlace_texto["principal"] = "S. Raimundi de Penyafort"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0107"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Hl. Valentin, Bischof"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0107Z"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Valentin, Bischof"
              }
              break
            case "08.01":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Severin, Mönch in Norikum"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Severin"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0108"
              }
              break

            default:
              resultado = ""
          }
        } else if (tiempo == 2) {
          switch (mesydia) {
            case "05.02":
              resultado +=
                "S. Agathæ, Virginis et Martyris<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Agathæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0205"
              break
            case "06.02":
              resultado +=
                "Ss. Pauli Miki et Sociorum, Martyrum<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "Ss. Pauli Miki et Sociorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0206"
              break
            case "08.02":
              resultado +=
                "S. Hieronymi Emiliani<br><span class=red>vel</span><br>S. Iosephinæ Bakhita, Virginis<Br><br><span class=red>(Pro Commemoratione)</span>"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0208"
              mienlace_texto["principal"] = "S. Hieronymi Emiliani"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0208Z"
              mienlace_texto["otro"] = "S. Iosephinæ Bakhita"
              break
            case "10.02":
              resultado +=
                "S. Scholasticæ, Virginis<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Scholasticæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0210"
              break
            case "11.02":
              resultado +=
                "Beatæ Maríæ Virginis De Lourdes<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis De Lourdes"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0211"
              break
            case "14.02":
              resultado +=
                "Ss. Cyrilli, Monachi, et Methodii, Episcopi<br><span class=red>(Festum)</span><br>Opus Dei: Beatæ Maríæ Virginis, Matris Pulchræ Dilectionis <span class=red>(F)</span>"
              mienlace_texto["principal"] = "Ss. Cyrilli, Monachi, et Methodii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0214"
              mienlace_texto["otro"] =
                "Opus Dei: Beatæ Maríæ Virginis, Matris Pulchræ Dilectionis"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#0214"
              break
            case "17.02":
              resultado +=
                "Ss. Septem Fundatorum Ordinis Servorum B. M. V.<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] =
                "Ss. Septem Fundatorum Ordinis Servorum B. M. V."
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0217"
              break
              case "18.02":
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Sainte Bernadette Soubirous"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0218"
                mienlace_texto["principal"] =
                  "En France : Sainte Bernadette Soubirous"
              }
            case "21.02":
              resultado +=
                "S. Petri Damiani Episcopi et Ecclesiæ Doctoris<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Petri Damiani"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0221"
              break
            case "22.02":
              resultado +=
                "Cathedræ S. Petri Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "Cathedræ S. Petri Apostoli"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0222"
              break
            case "23.02":
              resultado +=
                "S. Polycarpi, Episcopi et Martyris<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Polycarpi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0223"
              break
            case "24.02":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Matthias, Apostel<br><span class=red>(Fest)</span>"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Matthias"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0514"
              }
              break
            case "25.02":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Walburga, Äbtissin"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Walburga"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0225"
              }
              break
            case "26.02":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "Africa: Saint Alexander of Alexandria, Bishop"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0226"
                mienlace_texto["principal"] =
                  "Africa: Saint Alexander of Alexandria"
              }
              break
            case "27.02":
              resultado +=
                "S. Gregorii Narecensis, abbatis et Ecclesiæ Doctoris"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0227"
              mienlace_texto["principal"] = "S. Gregorii Narecensis"

              break
            case "03.03":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "United States: Saint Katharine Drexel, Virgin"
                mienlace_texto["principal"] =
                  "United States: Saint Katharine Drexel"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0303"
              }
              break
            case "04.03":
              resultado +=
                "S. Casimiri<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Casimiri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0304"
              break
            case "06.03":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Fridolin von Säckingen, Mönch, Glaubensbote"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Fridolin von Säckingen"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0306"
              }
              break

            case "07.03":
              resultado +=
                "Ss. Perpetuæ et Felicitatis, Martyrum<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "Ss. Perpetuæ et Felicitatis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0307"
              break
            case "08.03":
              resultado +=
                "S. Ioannis A Deo, Religiosi<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Ioannis A Deo"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0308"
              break
            case "09.03":
              resultado +=
                "S. Franciscæ Romanæ, Religiosæ<br><span class=red>(Pro Commemoratione)</span><br>Hl. Bruno von Querfurt, Bischof, Glaubensbote, Märtyrer"
              mienlace_texto["principal"] = "S. Franciscæ Romanæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0309"
              mienlace_texto["otro"] = "Hl. Bruno von Querfurt"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0309Z"
              break
            case "14.03":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Mathilde, Königin"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Mathilde"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0314"
              }
              break
            case "15.03":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Klemens Maria Hofbauer, Ordenspriester"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Klemens Maria Hofbauer"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0315"
              }
              break
            case "17.03":
              resultado +=
                "S. Patricii, Episcopi<br><span class=red>(Pro Commemoratione; in Nigeria: Feast)</span>"
              mienlace_texto["principal"] = "S. Patricii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0317"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0317"
                mienlace_texto["otro"] = "In Nigeria: S. Patricii (Feast)"
              }
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Gertrud von Nivelles, Äbtissin"
                mienlace_texto["otro2"] =
                  "In deutscher Sprache: Hl. Gertrud von Nivelles"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0317Z"
              }
              break
            case "18.03":
              resultado +=
                "S. Cyrilli Hierosolymitani, Episcopi et Ecclesiæ Doctoris<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Cyrilli Hierosolymitani"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0318"
              break
            case "19.03":
              resultado +=
                "S. Ioseph, Sponsi Beatæ Maríæ Virginis<br><span class=red>(Sollemnitas)</span>"
              mienlace_texto["principal"] = "S. Ioseph"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0319"
              break
            case "23.03":
              resultado +=
                "S. Turibii De Mogrovejo, Episcopi<br><span class=red>(Pro Commemoratione)</span>"
              mienlace_texto["principal"] = "S. Turibii De Mogrovejo"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0323"
              break
            case "25.03":
              resultado +=
                "In Annuntiatione Domini<br><span class=red>(Sollemnitas)</span>"
              mienlace_texto["principal"] = "In Annuntiatione Domini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0325"
              break
            case "26.03":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Liudger, Bischof"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Liudger, Bischof"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0326"
              }
              break
            case "02.04":
              resultado += "S. Francisci De Paola, Eremitæ"
              mienlace_texto["principal"] = "S. Francisci De Paola"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0402"
              break
            case "04.04":
              resultado += "S. Isidori, Episcopi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Isidori"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0404"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Africa: Saint Benedict, Religious"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0404"
                mienlace_texto["otro"] = "Africa: Saint Benedict"
              }
              break
            case "05.04":
              resultado += "S. Vincentii Ferrer, Presbyteri"
              mienlace_texto["principal"] = "S. Vincentii Ferrer"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0405"
              break
            case "07.04":
              resultado +=
                "S. Ioannis Baptistæ De La Salle, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Ioannis Baptistæ De La Salle"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0407"
              break
            case "11.04":
              resultado +=
                "S. Stanislai, Episcopi et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Stanislai"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0411"
              break
            case "12.04":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "Africa: Saint Zeno of Verona, Bishop"
                mienlace_texto["principal"] = "Saint Zeno of Verona"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0412"
              }
              break
            case "13.04":
              resultado += "S. Martini I, Papæ et Martyris"
              mienlace_texto["principal"] = "S. Martini I"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0413"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: San Hermenegildo"
                mienlace_texto["otro"] = "España: San Hermenegildo"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0413Z"
              }
              break
            case "19.04":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Leo IX., Papst"
                mienlace_texto["principal"] = "In deutscher Sprache: Hl. Leo IX"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0419"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "Uruguay: Nuestra Señora, la Virgen del Verdún"
                mienlace_texto["principal"] =
                  "Uruguay: Nuestra Señora, la Virgen del Verdún'"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0419"
              }
              break
            case "20.04":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "Africa: Saint Marcellinus, Bishop"
                mienlace_texto["principal"] = "Saint Marcellinus"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0420"
              }
              break
            case "21.04":
              resultado += "S. Anselmi, Episcopi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Anselmi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0421"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Konrad von Parzham, Ordensbruder"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Konrad von Parzham"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0421Z"
              }
              break
            case "23.04":
              resultado +=
                "S. Georgii, Martyris<br><span class=red>vel</span><br>S. Adalberti, Episcopi et Martyris"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0423"
              mienlace_texto["principal"] = "S. Georgii"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0423Z"
              mienlace_texto["otro"] = "S. Adalberti"
              break
            case "24.04":
              resultado += "S. Fidelis De Sigmaringen, Presbyteri et Martyris"
              mienlace_texto["principal"] = "S. Fidelis De Sigmaringen"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0424"
              break
            case "25.04":
              resultado +=
                "S. Marci, Evangelistæ<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Marci"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0425"
              break
            case "26.04":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Isidoro <span class=red>(F)</span>"
                mienlace_texto["principal"] = "España: San Isidoro"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0426"
              }
              break
            case "27.04":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Petrus Kanisius, Ordenspriester, Kirchenlehrer"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Petrus Kanisius"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0427"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>Argentina: Santo Toribio de Mogrovejo, obispo"
                mienlace_texto["principal"] =
                  "Argentina: Santo Toribio de Mogrovejo"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0427"
              }
              break
            case "28.04":
              resultado +=
                "S. Petri Chanel, Presbyteri et Martyris<br><span class=red>vel</span><br>S. Ludovici Maríæ Grignion De Montfort, Presbyteri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0428"
              mienlace_texto["principal"] = "S. Petri Chanel"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0428Z"
              mienlace_texto["otro"] = "S. Ludovici Maríæ"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Africa: Saint Pius V, Pope"
                mienlace_texto["otro2"] = "Africa: Saint Pius V"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0430"
              }
              break
            case "29.04":
              resultado +=
                "S. Catharinæ Senensis, Virginis et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Catharinæ Senensis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0429"
              break
            case "30.04":
              resultado += "S. Pii V, Papæ"
              mienlace_texto["principal"] = "S. Pii V"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_abr.html#0430"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Africa: Our Lady, Mother of Africa (Feast)"
                mienlace_texto["otro"] = "Africa: Our Lady, Mother of Africa"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0430"
              }
              break
            case "01.05":
              resultado += "S. Ioseph Opificis"
              mienlace_texto["principal"] = "S. Ioseph Opificis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0501"
              break
            case "02.05":
              resultado +=
                "S. Athanasii, Episcopi et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span><br>Opus Dei: In Dedicatione Ecclesiæ Prælatitiæ <span class=red>(F/S)</span>"
              mienlace_texto["principal"] = "S. Athanasii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0502"
              mienlace_texto["otro"] =
                "Opus Dei: In Dedicatione Ecclesiæ Prælatitiæ"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#0502"
              break
            case "03.05":
              resultado +=
                "Ss. Philippi et Iacobi, Apostolorum<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "Ss. Philippi et Iacobi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0503"
              break
            case "04.05":
              resultado += "Opus Dei: S. Athanasii <span class=red>(M)</span>"
              mienlace_texto["principal"] = "Opus Dei: S. Athanasii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0502"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Florian, Märtyrer, Hll. Märtyrer von Lorch"
                mienlace_texto["otro"] = "In deutscher Sprache: Hl. Florian"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0504"
              }
              break
            case "05.05":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Godehard, Bischof"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Godehard"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0505"
              }
              break
            case "08.05":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "Argentina: Nuestra Señora de Luján"
                mienlace_texto["principal"] =
                  "Argentina: Nuestra Señora de Luján"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0508"
              }
              break
              case "09.05":
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Sainte Louise de Marillac"
                mienlace_santo["principal"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0509"
                mienlace_texto["principal"] = "En France : Sainte Louise de Marillac"
              }
              break
            case "10.05":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "United States: Saint Damien de Veuster, Priest"
                mienlace_texto["principal"] =
                  "United States: Saint Damien de Veuster"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0510Z"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>España: San Juan de Ávila <span class=red>(M)</span>"
                mienlace_texto["otro"] = "España: San Juan de Ávila"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0510"
              }
              break
            case "11.05":
              resultado +=
                "Opus Dei: Ss. Nerei et Achillei, Martyrum<br><span class=red>vel</span><br>S. Pancratii, Martyris"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0512"
              mienlace_texto["principal"] = "Opus Dei: Ss. Nerei et Achillei"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0512Z"
              mienlace_texto["otro"] = "Opus Dei: S. Pancratii"
              break
            case "12.05":
              resultado +=
                "Ss. Nerei et Achillei, Martyrum<br><span class=red>vel</span><br>S. Pancratii, Martyris<br>Opus Dei: B. Alvari del Portillo <span class=red>(M)</span>"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0512"
              mienlace_texto["principal"] = "Ss. Nerei et Achillei"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0512Z"
              mienlace_texto["otro"] = "S. Pancratii"
              mienlace_santo["otro2"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#0512Y"
              mienlace_texto["otro2"] = "Opus Dei: B. Alvari del Portillo"
              break
            case "13.05":
              resultado += "Beatæ Maríæ Virginis De Fatima"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis De Fatima"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0513"
              break
            case "14.05":
              resultado +=
                "S. Matthiæ, Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Matthiæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0514"
              break

            case "15.05":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Isidro <span class=red>(M)</span>"
                mienlace_texto["principal"] = "España: San Isidro"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0515"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>United States: Saint Isidore"
                mienlace_texto["otro"] = "United States: Saint Isidore"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0515Z"
              }
              break
            case "16.05":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Johannes Nepomuk, Priester, Märtyrer"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Johannes Nepomuk"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0516"
              }
              break
            case "17.05":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Pascual Bailón"
                mienlace_texto["principal"] = "España: San Pascual Bailón"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0517"
              }
              break

            case "18.05":
              resultado +=
                "S. Ioannis I, Papæ et Martyris<br>Opus Dei: B. Guadalupe Ortiz de Landázuri"
              mienlace_texto["principal"] = "S. Ioannis I"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0518"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#0518Z"
              mienlace_texto["otro"] = "Opus Dei: B. Guadalupe"
              break
              case "19.05":
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Saint Yves, prêtre"
                mienlace_santo["principal"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0519"
                mienlace_texto["principal"] = "En France : Saint Yves"
              }
              break
            case "20.05":
              resultado += "S. Bernardini Senensis, Presbyteri"
              mienlace_texto["principal"] = "S. Bernardini Senensis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0520"
              break
            case "21.05":
              resultado +=
                "Ss. Christophori Magallanes, Presbyteri, et Sociorum, Martyrum"
              mienlace_texto["principal"] =
                "Ss. Christophori Magallanes et Sociorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0521"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Hermann Josef, Ordenspriester, Mystiker"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Hermann Josef"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0521Z"
              }
              break
            case "22.05":
              resultado += "S. Ritæ De Cascia, Religiosæ"
              mienlace_texto["principal"] = "S. Ritæ De Cascia"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0522Z"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: Santa Joaquina Vedruna"
                mienlace_texto["otro"] = "España: Santa Joaquina Vedruna"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0522"
              }
              break
            case "24.05":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "Africa: The Blessed Virgin Mary, Help of Christians (Memorial)"
                mienlace_texto["principal"] =
                  "Africa: The Blessed Virgin Mary, Help of Christians"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0524"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "Uruguay,...: Santa María auxilio de los cristianos"
                mienlace_texto["principal"] =
                  "Uruguay,...: Santa María auxilio de los cristianos"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0524"
              }
              break
            case "25.05":
              resultado +=
                "S. Bedæ Venerabilis, Presbyteri et Ecclesiæ Doctoris<br><span class=red>vel</span><br>S. Gregorii VII, Papæ<br><span class=red>vel</span><br>S. Maríæ Magdalenæ De' Pazzi, Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0525"
              mienlace_texto["principal"] = "S. Bedæ"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0525Z"
              mienlace_texto["otro"] = "S. Gregorii VII"
              mienlace_santo["otro2"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0525Y"
              mienlace_texto["otro2"] = "S. Maríæ Magdalenæ De' Pazzi"
              break
            case "26.05":
              resultado +=
                "S. Philippi Neri, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Philippi Neri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0526"
              break
            case "27.05":
              resultado += "S. Augustini Cantuariensis, Episcopi"
              mienlace_texto["principal"] = "S. Augustini Cantuariensis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0527"
              break
            case "29.05":
              resultado += "S. Pauli VI, Papæ"
              mienlace_texto["principal"] = "S. Pauli VI"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0529"
              break
            case "30.05":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Fernando"
                mienlace_texto["principal"] = "España: San Fernando"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0530"
              }
              
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "<br>En France : Sainte Jeanne d’Arc, vierge"
                mienlace_santo["principal"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0530"
                mienlace_texto["principal"] = "En France : Sainte Jeanne d’Arc"
              }
              break
            case "31.05":
              resultado +=
                "In Visitatione Beatæ Maríæ Virginis<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] =
                "In Visitatione Beatæ Maríæ Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0531"
              break
            case "01.06":
              resultado +=
                "S. Iustini, Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Iustini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0601"
              break
            case "02.06":
              resultado += "Ss. Marcellini et Petri, Martyrum"
              mienlace_texto["principal"] = "Ss. Marcellini et Petri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0602"
                
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "<br>En France : Saints Pothin et leurs compagnons, martyrs"
                mienlace_santo["otro"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0602"
                mienlace_texto["otro"] = "En France : Saints Pothin et compagnons"
              }
              break
            case "03.06":
              resultado +=
                "Ss. Caroli Lwanga et Sociorum, Martyrum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Caroli Lwanga et Sociorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0603"
              break
              case "04.06":
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Sainte Clotilde"
                mienlace_santo["principal"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0604"
                mienlace_texto["principal"] = "En France : Sainte Clotilde"
              }
              break
            case "05.06":
              resultado +=
                "S. Bonifatii, Episcopi et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Bonifatii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0605"
              break
            case "06.06":
              resultado += "S. Norberti, Episcopi"
              mienlace_texto["principal"] = "S. Norberti"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0606"
              break
            case "09.06":
              resultado += "S. Ephræm, Diaconi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Ephræm"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0609"
              break
            case "11.06":
              mienlace_texto["principal"] = "S. Barnabæ"
              resultado +=
                "S. Barnabæ, Apostoli<br><span class=red>(Memoria)</span>"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0611"
              break
            case "12.06":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "Africa: Saint Onophrius, Hermit"
                mienlace_texto["principal"] = "Africa: Saint Onophrius"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0612"
              }
              break
            case "13.06":
              resultado +=
                "S. Antonii De Padova, Presbyteri et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Antonii De Padova"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0136"
              break
            case "15.06":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "España: Santa María Micaela del Santísimo Sacramento"
                mienlace_texto["principal"] =
                  "España: Santa María Micaela del Santísimo Sacramento"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0615"
              }
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Vitus (Veit), Märtyrer"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Vitus (Veit)"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0615Z"
              }
              break
            case "16.06":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Benno, Bischof"
                mienlace_texto["principal"] = "In deutscher Sprache: Hl. Benno"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0616"
              }
              break
            default:
              resultado = ""
          }
        } else {
          switch (mesydia) {
            case "09.01":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Eulogio de Córdoba"
                mienlace_texto["principal"] = "España: San Eulogio de Córdoba"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0109"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Africa: Saint Adrian of Canterbury, Abbot"
                mienlace_texto["otro"] = "Africa: Saint Adrian of Canterbury"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0109"
              }
              break
            case "10.01":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: Beata Ana de los Ángeles Monteagudo"
                mienlace_texto["principal"] =
                  "España: Beata Ana de los Ángeles Monteagudo"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0110"
              }
              break
            case "13.01":
              resultado += "S. Hilarii, Episcopi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Hilarii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0113"
              break
              case "15.01":
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Saint Remi, évêque"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0115"
                mienlace_texto["principal"] =
                  "En France : Saint Remi"
              }
              break
            case "17.01":
              resultado +=
                "S. Antonii, Abbatis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Antonii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0117"
              break
            case "19.01":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "Nigeria: Saint Fabian, Pope and Martyr<br><span class=red>or</span><br>Nigeria: Saint Sebastian, Martyr"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0120"
                mienlace_texto["principal"] = "Saint Fabian"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0120Z"
                mienlace_texto["otro"] = "Saint Sebastian"
              }
              break
            case "20.01":
              resultado +=
                "S. Fabiani, Papæ et Martyris<br><span class=red>vel</span><br>S. Sebastiani, Martyris"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0120"
              mienlace_texto["principal"] = "S. Fabiani"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0120Z"
              mienlace_texto["otro"] = "S. Sebastiani"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>España: San Fructuoso y santos Augurio y Eulogio"
                mienlace_texto["otro2"] =
                  "España: San Fructuoso y santos Augurio y Eulogio"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0120Y"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "<br>Nigeria: Blessed Cyprian Michael Tansi, Priest (Feast)"
                mienlace_texto["otro3"] =
                  "Nigeria: Blessed Cyprian Michael Tansi"
                mienlace_santo["otro3"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0120"
              }
              break
            case "21.01":
              resultado +=
                "S. Agnetis, Virginis et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Agnetis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0121"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Meinrad, Mönch, Einsiedler, Märtyrer"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0121Z"
                mienlace_texto["otro"] = "In deutscher Sprache: Hl. Meinrad"
              }
              break
            case "22.01":
              resultado += "S. Vincentii, Diaconi et Martyris"
              mienlace_texto["principal"] = "S. Vincentii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0122"

              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "<br>United States: Day of Prayer for the Legal Protection of Unborn Children"
                mienlace_texto["otro"] =
                  "United States: Day of Prayer for the Legal Protection of Unborn Children"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0122Z"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>Chile y Argentina: Beata Laura Vicuña, Virgen"
                mienlace_texto["otro2"] = "Chile y Argentina: B. Laura Vicuña"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0122Y"
              }
              break

            case "23.01":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "United States: Saint Vincent, deacon and martyr"
                mienlace_texto["principal"] = "United States: Saint Vincent"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0122"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: San Ildefonso"
                mienlace_texto["otro"] = "España: San Ildefonso"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0123"
              }
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Sel. Heinrich Seuse, Ordenspriester, Mystiker"
                mienlace_texto["otro2"] =
                  "In deutscher Sprache: Sel. Heinrich Seuse"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0123Z"
              }
              break
            case "24.01":
              resultado +=
                "S. Francisci De Sales, Episcopi et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Francisci De Sales"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0124"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0124"
                mienlace_texto["otro"] = "<br>Argentina: María, Reina de la Paz"
              }
              break
            case "25.01":
              resultado +=
                "In Conversione S. Pauli, Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "In Conversione S. Pauli"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0125"
              break
            case "26.01":
              resultado +=
                "Ss. Timothei et Titi, Episcoporum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Timothei et Titi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0126"
              break
            case "27.01":
              resultado += "S. Angelæ Merici, Virginis"
              mienlace_texto["principal"] = "S. Angelæ Merici"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0127"
              break
            case "28.01":
              resultado +=
                "S. Thomæ De Aquino, Presbyteri et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Thomæ De Aquino"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0128"
              break
            case "31.01":
              resultado +=
                "S. Ioannis Bosco, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Ioannis Bosco"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0131"
              break
            case "02.02":
              resultado +=
                "In Præsentatione Domini<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "In Præsentatione Domini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0202"
              break
            case "03.02":
              resultado +=
                "S. Blasii, Episcopi et Martyris<br><span class=red>vel</span><br>S. Ansgarii, Episcopi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0203"
              mienlace_texto["principal"] = "S. Blasii"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0203Z"
              mienlace_texto["otro"] = "S. Ansgarii"
              break
            case "04.02":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Rabanus Maurus, Bischof"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Rabanus Maurus"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0204"
              }
              break
            case "05.02":
              resultado +=
                "S. Agathæ, Virginis et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Agathæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0205"
              break
            case "06.02":
              resultado +=
                "Ss. Pauli Miki et Sociorum, Martyrum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Pauli Miki et Sociorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0206"
              break
            case "08.02":
              resultado +=
                "S. Hieronymi Emiliani<br><span class=red>vel</span><br>S. Iosephinæ Bakhita, Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0208"
              mienlace_texto["principal"] = "S. Hieronymi Emiliani"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0208Z"
              mienlace_texto["otro"] = "S. Iosephinæ Bakhita"

              break
            case "10.02":
              resultado +=
                "S. Scholasticæ, Virginis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Scholasticæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0210"
              break
            case "11.02":
              resultado += "Beatæ Maríæ Virginis De Lourdes"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis De Lourdes"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0211"
              break
            case "14.02":
              resultado +=
                "Ss. Cyrilli, Monachi, et Methodii, Episcopi<br><span class=red>(Memoria)</span><br>Opus Dei: Beatæ Maríæ Virginis, Matris Pulchræ Dilectionis <span class=red>(F)</span>"
              mienlace_texto["principal"] = "Ss. Cyrilli et Methodii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0214"
              mienlace_texto["otro"] =
                "Opus Dei: Beatæ Maríæ Virginis, Matris Pulchræ Dilectionis"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#0214"
              break
            case "17.02":
              resultado += "Ss. Septem Fundatorum Ordinis Servorum B. M. V."
              mienlace_texto["principal"] =
                "Ss. Septem Fundatorum Ordinis Servorum B. M. V."
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0217"
              break
              case "18.02":
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Sainte Bernadette Soubirous"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0218"
                mienlace_texto["principal"] =
                  "En France : Sainte Bernadette Soubirous"
              }
                break
            case "21.02":
              resultado += "S. Petri Damiani, Episcopi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Petri Damiani"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0221"
              break
            case "22.02":
              resultado +=
                "Cathedræ S. Petri Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "Cathedræ S. Petri Apostoli "
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0222"
              break
            case "23.02":
              resultado +=
                "S. Polycarpi, Episcopi et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Polycarpi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0223"
              break
            case "24.02":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Matthias, Apostel<br><span class=red>(Fest)</span>"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Matthias"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0514"
              }
              break
            case "25.02":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Walburga, Äbtissin"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Walburga"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0225"
              }
              break
            case "26.02":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "Africa: Saint Alexander of Alexandria, Bishop"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0226"
                mienlace_texto["principal"] =
                  "Africa: Saint Alexander of Alexandria"
              }
              break
            case "27.02":
              resultado +=
                "S. Gregorii Narecensis, abbatis et Ecclesiæ Doctoris"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_feb.html#0227"
              mienlace_texto["principal"] = "S. Gregorii Narecensis"

              break
            case "03.03":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "United States: Saint Katharine Drexel, Virgin"
                mienlace_texto["principal"] =
                  "United States: Saint Katharine Drexel"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0303"
              }
              break
            case "04.03":
              resultado += "S. Casimiri"
              mienlace_texto["principal"] = "S. Casimiri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0304"
              break
            case "06.03":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Fridolin von Säckingen, Mönch, Glaubensbote"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Fridolin von Säckingen"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0306"
              }
              break

            case "07.03":
              resultado +=
                "Ss. Perpetuæ et Felicitatis, Martyrum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Perpetuæ et Felicitatis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0307"
              break
            case "08.03":
              resultado += "S. Ioannis A Deo, Religiosi"
              mienlace_texto["principal"] = "S. Ioannis A Deo"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0308"
              break
            case "09.03":
              resultado +=
                "S. Franciscæ Romanæ, Religiosæ<br>Hl. Bruno von Querfurt, Bischof, Glaubensbote, Märtyrer"
              mienlace_texto["principal"] = "S. Franciscæ Romanæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0309"
              mienlace_texto["otro"] = "Hl. Bruno von Querfurt"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_mar.html#0309Z"
              break
            case "10.05":
              resultado +=
                "S. Ioannis De Avila, presbyteri et Ecclesiæ doctoris"
              mienlace_texto["principal"] = "S. Ioannis de Avila"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0510"

              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "<br>United States: Saint Damien de Veuster, Priest"
                mienlace_texto["principal"] =
                  "United States: Saint Damien de Veuster"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0510Z"
              }

              break
            case "12.05":
              resultado +=
                "Ss. Nerei et Achillei, Martyrum<br><span class=red>vel</span><br>S. Pancratii, Martyris"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0512"
              mienlace_texto["principal"] = "Ss. Nerei et Achillei"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0512Z"
              mienlace_texto["otro"] = "S. Pancratii"
              mienlace_santo["otro2"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0512Y"
              mienlace_texto["otro2"] = "Opus Dei: B. Alvari del Portillo"
              break
            case "13.05":
              resultado += "Beatæ Maríæ Virginis De Fatima"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis De Fatima"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0513"
              break
            case "14.05":
              resultado +=
                "S. Matthiæ, Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Matthiæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0514"
              break
            case "15.05":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Isidro <span class=red>(M)</span>"
                mienlace_texto["principal"] = "España: San Isidro"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0515"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>United States: Saint Isidore"
                mienlace_texto["otro"] = "United States: Saint Isidore"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ene.html#0515Z"
              }
              break
            case "16.05":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Johannes Nepomuk, Priester, Märtyrer"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Johannes Nepomuk"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0516"
              }
              break
            case "17.05":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Pascual Bailón"
                mienlace_texto["principal"] = "España: San Pascual Bailón"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0517"
              }
              break

            case "18.05":
              resultado +=
                "S. Ioannis I, Papæ et Martyris<br>Opus Dei: B. Guadalupe Ortiz de Landázuri"
              mienlace_texto["principal"] = "S. Ioannis I"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0518"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#0518Z"
              mienlace_texto["otro"] = "Opus Dei: B. Guadalupe"
              break
              case "19.05":
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Saint Yves, prêtre"
                mienlace_santo["principal"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0519"
                mienlace_texto["principal"] = "En France : Saint Yves"
              }
              break
            case "20.05":
              resultado += "S. Bernardini Senensis, Presbyteri"
              mienlace_texto["principal"] = "S. Bernardini Senensis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0520"
              break
            case "21.05":
              resultado +=
                "Ss. Christophori Magallanes, Presbyteri, et Sociorum, Martyrum"
              mienlace_texto["principal"] =
                "Ss. Christophori Magallanes et Sociorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0521"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Hermann Josef, Ordenspriester, Mystiker"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Hermann Josef"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0521Z"
              }
              break
            case "22.05":
              resultado += "S. Ritæ De Cascia, Religiosæ"
              mienlace_texto["principal"] = "S. Ritæ De Cascia"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0522Z"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: Santa Joaquina Vedruna"
                mienlace_texto["otro"] = "España: Santa Joaquina Vedruna"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0522"
              }
              break
            case "24.05":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "Africa: The Blessed Virgin Mary, Help of Christians (Memorial)"
                mienlace_texto["principal"] =
                  "Africa: The Blessed Virgin Mary, Help of Christians"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0524"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>Uruguay,...: Santa María auxilio de los cristianos"
                mienlace_texto["otro"] =
                  "Uruguay,...: Santa María auxilio de los cristianos"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0524"
              }
              break
            case "25.05":
              resultado +=
                "S. Bedæ Venerabilis, Presbyteri et Ecclesiæ Doctoris<br><span class=red>vel</span><br>S. Gregorii VII, Papæ<br><span class=red>vel</span><br>S. Maríæ Magdalenæ De' Pazzi, Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0525"
              mienlace_texto["principal"] = "S. Bedæ"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0525Z"
              mienlace_texto["otro"] = "S. Gregorii VII"
              mienlace_santo["otro2"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0525Y"
              mienlace_texto["otro2"] = "S. Maríæ Magdalenæ De' Pazzi"
              break
            case "26.05":
              resultado +=
                "S. Philippi Neri, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Philippi Neri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0526"
              break
            case "27.05":
              resultado += "S. Augustini Cantuariensis, Episcopi"
              mienlace_texto["principal"] = "S. Augustini Cantuariensis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0527"
              break
            case "29.05":
              resultado += "S. Pauli VI, Papæ"
              mienlace_texto["principal"] = "S. Pauli VI"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0529"
              break
            case "30.05":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Fernando"
                mienlace_texto["principal"] = "España: San Fernando"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0530"
              }
              
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Sainte Jeanne d’Arc, vierge"
                mienlace_santo["principal"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0530"
                mienlace_texto["principal"] = "En France : Sainte Jeanne d’Arc"
              }
              break
            case "31.05":
              resultado +=
                "In Visitatione Beatæ Maríæ Virginis<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] =
                "In Visitatione Beatæ Maríæ Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0531"
              break
            case "01.06":
              resultado +=
                "S. Iustini, Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Iustini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0601"
              break
            case "02.06":
              resultado += "Ss. Marcellini et Petri, Martyrum"
              mienlace_texto["principal"] = "Ss. Marcellini et Petri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0602"
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "<br>En France : Saints Pothin et leurs compagnons, martyrs"
                mienlace_santo["otro"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0602"
                mienlace_texto["otro"] = "En France : Saints Pothin et compagnons"
              }
              break
            case "03.06":
              resultado +=
                "Ss. Caroli Lwanga et Sociorum, Martyrum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Caroli Lwanga et Sociorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0603"
              break
              case "04.06":
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Sainte Clotilde"
                mienlace_santo["principal"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0604"
                mienlace_texto["principal"] = "En France : Sainte Clotilde"
              }
              break
            case "05.06":
              resultado +=
                "S. Bonifatii, Episcopi et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Bonifatii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0605"
              break
            case "06.06":
              resultado += "S. Norberti, Episcopi"
              mienlace_texto["principal"] = "S. Norberti"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0606"
              break
            case "09.06":
              resultado += "S. Ephræm, Diaconi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Ephræm"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0609"
              if (mimisal_1 == "port" || mimisal_2 == "port") {
                resultado += "<br>Brasil: São José de Anchieta, presbítero"
                mienlace_texto["otro"] = "Brasil: São José de Anchieta"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_brasil.html#0609Z"
              }
              break
            case "11.06":
              resultado +=
                "S. Barnabæ, Apostoli<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Barnabæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0611"
              break
            case "12.06":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "Africa: Saint Onophrius, Hermit"
                mienlace_texto["principal"] = "Africa: Saint Onophrius"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0612"
              }
              break
            case "13.06":
              resultado +=
                "S. Antonii De Padova, Presbyteri et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Antonii De Padova"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0613"
              break
            case "15.06":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "España: Santa María Micaela del Santísimo Sacramento"
                mienlace_texto["principal"] =
                  "España: Santa María Micaela del Santísimo Sacramento"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0615"
              }
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Vitus (Veit), Märtyrer"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Vitus (Veit)"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0615Z"
              }
              break
            case "16.06":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Benno, Bischof"
                mienlace_texto["principal"] = "In deutscher Sprache: Hl. Benno"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0616"
              }
              break
            case "19.06":
              resultado += "S. Romualdi, Abbatis"
              mienlace_texto["principal"] = "S. Romualdi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0619"
              break
            case "21.06":
              resultado +=
                "S. Aloisii Gonzaga, Religiosi<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Aloisii Gonzaga"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0621"
              break
            case "22.06":
              resultado +=
                "Ss. Ioannis Fisher, Episcopi, et Thomæ More, Martyrum<br><span class=red>vel</span><br>S. Paulini Nolani, Episcopi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0622Z"
              mienlace_texto["principal"] = "Ss. Ioannis Fisher"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0622"
              mienlace_texto["otro"] = "S. Paulini Nolani"
              break
            case "24.06":
              resultado +=
                "In Nativitate S. Ioannis Baptistæ<br><span class=red>(Sollemnitas)</span>"
              mienlace_texto["principal"] = "In Nativitate S. Ioannis Baptistæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0624"
              mienlace_texto["otro"] =
                "In Nativitate S. Ioannis Baptistæ. Ad Missam in Vigilia"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0624V"
              break
            case "26.06":
              resultado +=
                "S. Iosephmariæ Escrivá De Balaguer, Presbyteri et Fundatoris<br><span class=red>(Opus Dei: Sollemnitas)</span>"
              mienlace_texto["principal"] = "S. Iosephmariæ Escrivá De Balaguer"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0626"
              mienlace_texto["otro"] =
                "Opus Dei: S. Iosephmariæ Escrivá de Balaguer"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#0626"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: San Pelayo"
                mienlace_texto["otro2"] = "España: San Pelayo"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0626Z"
              }
              break
            case "27.06":
              resultado +=
                "S. Cyrilli Alexandrini, Episcopi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Cyrilli Alexandrini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0627"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Hl. Hemma von Gurk"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Hemma von Gurk"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0627Z"
              }
              break
            case "28.06":
              resultado +=
                "S. Irenæi, Episcopi et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Irenæi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0628"
              break
            case "29.06":
              resultado +=
                "Ss. Petri et Pauli, Apostolorum<br><span class=red>(Sollemnitas)</span>"
              mienlace_texto["principal"] = "Ss. Petri et Pauli"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0629"
              mienlace_texto["otro"] = "Ss. Petri et Pauli.Ad Missam in Vigilia"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0629V"
              break
            case "30.06":
              resultado += "Ss. Protomartyrum Sanctæ Romanæ Ecclesiæ"
              mienlace_texto["principal"] = "Ss. Protomartyrum Sanctæ Romanæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jun.html#0630"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Otto, Bischof, Glaubensbote"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Otto, Bischof"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_may.html#0630Z"
              }
              break
            case "01.07":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "United States: Saint Junípero Serra, Priest"
                mienlace_texto["principal"] =
                  "United States: Saint Junípero Serra"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0701"
              }
              break
            case "03.07":
              resultado +=
                "S. Thomæ, Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Thomæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0703"
              break
            case "04.07":
              resultado += "S. Elisabeth Lusitaniæ"
              mienlace_texto["principal"] = "S. Elisabeth Lusitaniæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0704"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>United States: Independence Day"
                mienlace_texto["otro"] = "United States: Independence Day"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0704Z"
              }
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Hl. Ulrich, Bischof"
                mienlace_texto["otro2"] = "In deutscher Sprache: Hl. Ulrich"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0704Y"
              }
              break
            case "05.07":
              resultado += "S. Antonii Maríæ Zaccaria, Presbyteri"
              mienlace_texto["principal"] = "S. Antonii Maríæ Zaccaria"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0705"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>United States: Saint Elizabeth of Portugal"
                mienlace_texto["otro"] =
                  "United States: Saint Elizabeth of Portugal"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0704"
              }
              break
            case "06.07":
              resultado += "S. Maríæ Goretti, Virginis et Martyris"
              mienlace_texto["principal"] = "S. Maríæ Goretti"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0706"
              break
            case "07.07":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Willibald, Bischof, Glaubensbote"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Willibald"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0707"
              }
              break
            case "08.07":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Kilian, Bischof, und Gefährten, Glaubensboten, Märtyrer"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Kilian und Gefährten"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0708"
              }
              break
            case "09.07":
              resultado +=
                "Ss. Augustini Zhao Rong, Presbyteri, et Sociorum, Martyrum"
              mienlace_texto["principal"] = "Ss. Augustini Zhao Rong"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0709"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>Argentina: Nuestra Señora de Itatí"
                mienlace_texto["otro"] = "Argentina: Nuestra Señora de Itatí"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0709"
              }
              break
            case "10.07":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Knud von Dänemark, Märtyrer, Hl. Erich von Schweden, Märtyrer, Hl. Olaf von Norwegen"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Knud von Dänemark, Hl. Erich von Schweden, Hl. Olaf von Norwegen"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0710"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>Argentina: Ss. Augustini Zhao Rong, Presbyteri, et Sociorum, Martyrum"
                mienlace_texto["otro"] = "Argentina: Ss. Augustini Zhao Rong..."
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0709"
              }
              break
            case "11.07":
              resultado +=
                "S. Benedicti, Abbatis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Benedicti"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0711"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>Bolivia: S. Camilo De Lelis, Presbítero"
                mienlace_texto["otro"] = "Bolivia: S. Camilo De Lelis"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0714"
              }
              break
            case "13.07":
              resultado += "S. Henrici"
              mienlace_texto["principal"] = "S. Henrici"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0713"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>Chile: Santa Teresa de Jesús de los Andes, virgen <span class=red>(F)</span>"
                mienlace_texto["otro"] =
                  "Chile: Santa Teresa de Jesús de los Andes"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0713Z"
              }
              break
            case "14.07":
              resultado += "S. Camilli De Lellis, Presbyteri"
              mienlace_texto["principal"] = "S. Camilli De Lellis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0714"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "<br>United States: Blessed Kateri Tekakwitha, Virgin"
                mienlace_texto["otro"] =
                  "United States: Blessed Kateri Tekakwitha"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0714Z"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>Bolivia: San Francisco Solano, Presbítero"
                mienlace_texto["otro2"] = "Bolivia: San Francisco Solano"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0724"
              }

              break
            case "15.07":
              resultado +=
                "S. Bonaventuræ, Episcopi et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Bonaventuræ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0715"
              break
            case "16.07":
              resultado += "Beatæ Maríæ Virginis De Monte Carmelo"
              mienlace_texto["principal"] =
                "Beatæ Maríæ Virginis De Monte Carmelo"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0716"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br><span class=red>Chile: Solemnidad</span>"
                mienlace_texto["otro"] = "Chile: Nuestra Señora del Carmen"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0716Z"
              }
              break
            case "17.07":
              if (mimisal_1 == "port" || mimisal_2 == "port") {
                resultado +=
                  "Brasil: Bem-aventurado Inácio de Azevedo, presbítero, e seus companheiros, mártires"
                mienlace_texto["principal"] =
                  "Brasil: B. Inácio de Azevedo, e seus companheiros"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_brasil.html#0717"
              }
            case "18.07":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "United States: Saint Camillus de Lellis, priest"
                mienlace_texto["principal"] =
                  "United States: Saint Camillus de Lellis"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0714"
              }
              break
            case "20.07":
              resultado += "S. Apollinaris, Episcopi et Martyris"
              mienlace_texto["principal"] = "S. Apollinaris"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0720"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Margareta, Jungfrau, Märtyrin"
                mienlace_texto["otro"] = "In deutscher Sprache: Hl. Margareta"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0720Z"
              }
              break
            case "21.07":
              resultado +=
                "S. Laurentii De Brindisi, Presbyteri et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Laurentii De Brindisi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0721"
              break
            case "22.07":
              resultado +=
                "S. Maríæ Magdalenæ<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Maríæ Magdalenæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0722"
              break
            case "23.07":
              resultado += "S. Birgittæ, Religiosæ"
              mienlace_texto["principal"] = "S. Birgittæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0723"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>Argentina: S. Charbel Makhlüf, Presbítero"
                mienlace_texto["otro"] = "Argentina: S. Charbel Makhlüf"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0724"
              }
              break
            case "24.07":
              resultado += "S. Sarbelii Makhlüf, Presbyteri"
              mienlace_texto["principal"] = "S. Sarbelii Makhlüf"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0724"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>Argentina: San Francisco Solano, Presbítero"
                mienlace_texto["otro2"] = "Argentina: San Francisco Solano"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0724"
              }
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hl. Christophorus, Märtyrer"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Christophorus"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0724Z"
              }
              break
            case "25.07":
              resultado += "S. Iacobi, Apostoli<br><span class=red>(Festum)"
              mienlace_texto["principal"] = "S. Iacobi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0725"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: Solemnidad</span>"
                mienlace_texto["otro"] = "España: Santiago Apóstol"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0725Z"
              }
              break
            case "26.07":
              resultado +=
                "Ss. Ioachim et Annæ, Parentum Beatæ Maríæ Virginis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Ioachim et Annæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0726"
              break
            case "28.07":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "Africa: Saint Victor I, Pope and Martyr"
                mienlace_texto["principal"] = "Africa: Saint Victor I"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0728"
              }
              break
            case "29.07":
              resultado +=
                "Ss. Marthæ, Mariæ et Lazari<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Marthæ, Mariæ et Lazari"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0729"
              break
            case "30.07":
              resultado += "S. Petri Chrysologi, Episcopi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Petri Chrysologi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0730"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Africa: Saint Justin De Jacobis, Bishop"
                mienlace_texto["otro"] = "Africa: Saint Justin De Jacobis"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0730"
              }
              break
            case "31.07":
              resultado +=
                "S. Ignatii De Loyola, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Ignatii De Loyola"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0731"
              break
            case "01.08":
              resultado +=
                "S. Alfonsi Maríæ De Liguori, Episcopi et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Alfonsi Maríæ De Liguori"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0801"
              break
            case "02.08":
              resultado +=
                "S. Eusebii Vercellensis, Episcopi<br><span class=red>vel</span><br>S. Petri Iuliani Eymard, Presbyteri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0802"
              mienlace_texto["principal"] = "S. Eusebii Vercellensis"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0802Z"
              mienlace_texto["otro"] = "S. Petri Iuliani Eymard"
              break
            case "04.08":
              resultado +=
                "S. Ioannis Maríæ Vianney, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Ioannis Maríæ Vianney"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0804"
              break
            case "05.08":
              resultado += "In Dedicatione Basilicæ S. Maríæ"
              mienlace_texto["principal"] = "In Dedicatione Basilicæ S. Maríæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0805"
              break
            case "06.08":
              resultado +=
                "In Transfiguratione Domini<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "In Transfiguratione Domini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0806"
              break
            case "07.08":
              resultado +=
                "Ss. Xysti II, Papæ, et Sociorum, Martyrum<br><span class=red>vel</span><br>S. Caietani, Presbyteri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0807"
              mienlace_texto["principal"] = "Ss. Xysti II et Sociorum"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0807Z"
              mienlace_texto["otro"] = "S. Caietani"
              break
            case "08.08":
              resultado +=
                "S. Dominici, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Dominici"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0808"
              break
            case "09.08":
              resultado += "S. Teresiæ Benedictæ A Cruce, Virginis et Martyris"
              mienlace_texto["principal"] = "S. Teresiæ Benedictæ A Cruce"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0809"

              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>Argentina: Beata María Francisca Rubatto, Virgen"
                mienlace_texto["otro"] =
                  "Argentina: Beata María Francisca Rubatto"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0809"
              }
              break
            case "10.08":
              resultado +=
                "S. Laurentii, Diaconi et Martyris<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Laurentii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0810"
              break
            case "11.08":
              resultado +=
                "S. Claræ, Virginis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Claræ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0811"
              break
            case "12.08":
              resultado += "S. Ioannæ Franciscæ De Chantal, Religiosæ"
              mienlace_texto["principal"] = "S. Ioannæ Franciscæ De Chantal"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0812"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Africa: Blessed Isidoro Bakanja, Martyr"
                mienlace_texto["otro"] = "Africa: Blessed Isidoro Bakanja"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0812"
              }
              break
            case "13.08":
              resultado +=
                "Ss. Pontiani, Papæ et Hippolyti, Presbyteri, Martyrum"
              mienlace_texto["principal"] = "Ss. Pontiani et Hippolyti"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0813"
              break
            case "14.08":
              resultado +=
                "S. Maximiliani Maríæ Kolbe, Presbyteri et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Maximiliani Maríæ Kolbe"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0814"
              break
            case "15.08":
              resultado +=
                "In Assumptione Beatæ Maríæ Virginis<br><span class=red>(Sollemnitas)</span>"
              mienlace_texto["principal"] =
                "In Assumptione BMV. Ad Missam in Die "
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0815Z"
              mienlace_texto["otro"] = "In Assumptione BMV.Ad Missam in Vigilia"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0815"

              break
            case "16.08":
              resultado += "S. Stephani Hungariæ"
              mienlace_texto["principal"] = "S. Stephani Hungariæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0816"

              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>Argentina: San Roque"
                mienlace_texto["otro"] = "Argentina: San Roque"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_jul.html#0816"
              }

              break
            case "18.08":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "Africa: Blessed Victoria Rasoamanarivo"
                mienlace_texto["principal"] =
                  "Africa: Blessed Victoria Rasoamanarivo"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0818"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>Chile: San Alberto Hurtado Cruchaga, presbítero <span class=red>(F)</span>"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0818"
                mienlace_texto["otro"] = "Chile: San Alberto Hurtado Cruchaga"
              }
              break
            case "19.08":
              resultado += "S. Ioannis Eudes, Presbyteri"
              mienlace_texto["principal"] = "S. Ioannis Eudes"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0819"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: San Ezequiel Moreno Díaz"
                mienlace_texto["otro"] = "España: San Ezequiel Moreno Díaz"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0819Z"
              }
              break
            case "20.08":
              resultado +=
                "S. Bernardi, Abbatis et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Bernardi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0820"
              break
            case "21.08":
              resultado += "S. Pii X, Papæ<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Pii X"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0821"
              break
            case "22.08":
              resultado +=
                "Beatæ Maríæ Virginis Reginæ<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis Reginæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0822"
              break
            case "23.08":
              resultado += "S. Rosæ De Lima, Virginis"
              mienlace_texto["principal"] = "S. Rosæ De Lima"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0823"
              break
            case "24.08":
              resultado +=
                "S. Bartholomæi, Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Bartholomæi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0824"
              break
            case "25.08":
              resultado +=
                "S. Ludovici<br><span class=red>vel</span><br>S. Ioseph De Calasanz, Presbyteri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0825"
              mienlace_texto["principal"] = "S. Ludovici"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0825Z"
              mienlace_texto["otro"] = "S. Ioseph De Calasanz"
              break
            case "26.08":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado =
                  "Santa Teresa de Jesús Jornet e Ibars <span class=red>(M)</span>"
                mienlace_texto["principal"] =
                  "España: Santa Teresa de Jesús Jornet e Ibars"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0826"
                resultado += "<br>Argentina: Beato Ceferino Namuncurá"
                mienlace_texto["otro"] = "Argentina: Beato Ceferino Namuncurá"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0826"
              }
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "En France : Saint Césaire d’Arles, évêque"
                mienlace_santo["principal"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0826"
                mienlace_texto["principal"] = "En France : Saint Césaire d’Arles, évêque"
              }
              break
            case "27.08":
              resultado += "S. Monicæ<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Monicæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0827"
              break
            case "28.08":
              resultado +=
                "S. Augustini, Episcopi et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Augustini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0828"
              break
            case "29.08":
              resultado +=
                "In Passione S. Ioannis Baptistæ<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "In Passione S. Ioannis Baptistæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0829"
              break
            case "30.08":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "América: Santa Rosa de Lima, Virgen <span class=red>(F)</span>"
                mienlace_texto["principal"] = "América: Santa Rosa de Lima"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0830"
              }
              break
            case "31.08":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Paulinus von Trier, Bischof"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Paulinus von Trier"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_ago.html#0831"
              }
              break
            case "03.09":
              resultado +=
                "S. Gregorii Magni, Papæ et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Gregorii Magni"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0903"
              break
            case "05.09":
              resultado +=
                "S. Teresiæ de Calcutta, virginis"
              mienlace_texto["principal"] = "S. Teresiæ de Calcutta"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0905"
              break
            case "08.09":
              resultado +=
                "In Nativitate Beatæ Maríæ Virginis<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "In Nativitate Beatæ Maríæ Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0908"
              break
            case "09.09":
              resultado +=
                "S. Petri Claver, Presbyteri<br>United States: Memorial"
              mienlace_texto["principal"] = "S. Petri Claver"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0909"
              break
            case "12.09":
              resultado += "Sanctissimi Nominis Maríæ"
              mienlace_texto["principal"] = "Sanctissimi Nominis Maríæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0912"
              break
            case "13.09":
              resultado +=
                "S. Ioannis Chrysostomi, Episcopi Et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Ioannis Chrysostomi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0913"
              break
            case "14.09":
              resultado +=
                "In Exaltatione Sanctæ Crucis<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "In Exaltatione Sanctæ Crucis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0914"
              break
            case "15.09":
              resultado +=
                "Beatæ Maríæ Virginis Perdolentis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis Perdolentis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0915"
              break
            case "16.09":
              resultado +=
                "Ss. Cornelii, Papæ, Et Cypriani, Episcopi, Martyrum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Cornelii et Cypriani"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0916"
              break
            case "17.09":
              resultado +=
                "S. Roberti Bellarmino, Episcopi Et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Roberti Bellarmino"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0917"

              resultado +=
                "<br>S. Hildegardis Bingensis, virginis Et Ecclesiæ Doctoris"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0917Z"
              mienlace_texto["otro"] = "S. Hildegardis"

              break
            case "18.09":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Lambert, Bischof, Glaubensbote, Märtyrer"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Lambert"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0918"
              }
              break
            case "19.09":
              resultado += "S. Ianuarii, Episcopi Et Martyris"
              mienlace_texto["principal"] = "S. Ianuarii"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0919"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>Uruguay: Beatas Dolores y Consuelo Aguiar-Mella y Díaz y compañeras"
                mienlace_texto["otro"] =
                  "Uruguay: Beatas Dolores y Consuelo y compañeras"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#0919"
              }
              if (mimisal_1 == "fran" || mimisal_2 == "fran") {
                resultado += "<br>En France : Bienheureuse Vierge Marie de la Salette"
                mienlace_santo["otro"] = "../misal_v2/m_estructura/santos/m_estructura_santos_fran.html#0919"
                mienlace_texto["otro"] = "En France : BVM de la Salette"
              }

              break
            case "20.09":
              resultado +=
                "Ss. Andreæ Kim Taegon, Presbyteri Et Pauli Chong Hasang, Et Sociorum, Martyrum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Andreæ Kim Taegon et Sociorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0920"
              break
            case "21.09":
              resultado +=
                "S. Matthæi, Apostoli Et Evangelistæ<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Matthæi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0921"
              break
            case "22.09":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Mauritius und Gefährten, Märtyrer"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Mauritius und Gefährten"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0922"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Africa: Saint Maurice and Companions, Martyrs"
                mienlace_texto["otro"] =
                  "Africa: Saint Maurice and Companions, Martyrs"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#0922"
              }
              break
            case "23.09":
              resultado +=
                "S. Pii De Pietrelcina, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Pii De Pietrelcina"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0923"
              break
            case "24.09":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España, Chile y Argentina: B.M.V. de la Merced"
                mienlace_texto["principal"] = "B.M.V. de la Merced"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0924Z"
              }
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Rupert und hl. Virgil, Bischöfe, Glaubensboten"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Hl. Rupert und hl. Virgil"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0924"
              }
              break
            case "25.09":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Niklaus von Flüe, Einsiedler, Friedensstifter"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Niklaus von Flüe"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0925"
              }
              break
            case "26.09":
              resultado += "Ss. Cosmæ Et Damiani, Martyrum"
              mienlace_texto["principal"] = "Ss. Cosmæ et Damiani"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0926"
              break
            case "27.09":
              resultado +=
                "S. Vincentii De Paul, Presbyteri<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Vincentii De Paul"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0927"
              break
            case "28.09":
              resultado +=
                "S. Venceslai, Martyris<br><span class=red>vel</span><br>Ss. Laurentii Ruiz et Sociorum, Martyrum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0928"
              mienlace_texto["principal"] = "S. Venceslai"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0928Z"
              mienlace_texto["otro"] = "Ss. Laurentii Ruiz et Sociorum"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Hl. Lioba, Äbtissin"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0928Y"
                mienlace_texto["otro2"] = "In deutscher Sprache: Hl. Lioba"
              }
              break
            case "29.09":
              resultado +=
                "Ss. Michaelis, Gabrielis et Raphaelis, Archangelorum<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] =
                "Ss. Michaelis, Gabrielis et Raphaelis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0929"
              break
            case "30.09":
              resultado +=
                "S. Hieronymi, Presbyteri et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Hieronymi"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_sep.html#0930"
              break
            case "01.10":
              resultado +=
                "S. Teresiæ A Iesu Infante, Virginis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Teresiæ A Iesu Infante"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1001"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "<br>Nigeria: Our Lady, Queen of Nigeria<br><span class=red>(Solemnity)</span>"
                mienlace_texto["otro"] = "Nigeria: Our Lady, Queen of Nigeria"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#1001"
              }
              break
            case "02.10":
              resultado +=
                "Ss. Angelorum Custodum<br><span class=red>(Memoria)<br>(Opus Dei: Sollemnitas)</span>"
              mienlace_texto["principal"] = "Ss. Angelorum Custodum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1002"
              mienlace_texto["otro"] = "Opus Dei: Ss. Angelorum Custodum"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#1002"
              break
            case "03.10":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: San Francisco de Borja"
                mienlace_texto["principal"] = "España: San Francisco de Borja"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1003"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "<br>Nigeria: Saint Thérèse of the Child Jesus, Virgin and Doctor of the Church<br><span class=red>(Memorial)</span>"
                mienlace_texto["otro"] =
                  "Nigeria: Saint Thérèse of the Child Jesus"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1001"
              }
              if (mimisal_1 == "port" || mimisal_2 == "port") {
                resultado +=
                  "Brasil: Beatos mártires André de Soveral e companheiros"
                mienlace_texto["otro"] =
                  "Brasil: Beatos André de Soveral e companheiros"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1003Z"
              }
              break
            case "04.10":
              resultado +=
                "S. Francisci Assisiensis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Francisci Assisiensis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1004"
              break
            case "05.10":
              resultado += "S. Faustinæ Kowalska, virginis"
              mienlace_texto["principal"] = "S. Faustinæ Kowalska"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1005X"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "España: Témporas de acción de gracias y de petición"
                mienlace_texto["otro"] =
                  "España: Témporas de acción de gracias y de petición"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1005"
              }
              if (mimisal_1 == "port" || mimisal_2 == "port") {
                resultado += "Brasil: São Benedito, o Negro, religioso"
                mienlace_texto["otro2"] = "Brasil: São Benedito, o Negro"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1005Z"
              }
              break
            case "06.10":
              resultado +=
                "S. Brunonis, Presbyteri<br>United States: Blessed Marie Rose Durocher, Virgin"
              mienlace_texto["principal"] = "S. Brunonis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1006"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                mienlace_texto["otro"] =
                  "United States: Blessed Marie Rose Durocher"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1006Z"
              }
              break
            case "07.10":
              resultado +=
                "Beatæ Maríæ Virginis A Rosario<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Beatæ Maríæ Virginis A Rosario"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1007"
              break
            case "08.10":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: S. Faustina Kowalska, virgen"
                mienlace_texto["principal"] = "España: S. Faustina Kowalska"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1005X"
              }
              break
            case "09.10":
              resultado +=
                "Ss. Dionysii, Episcopi, et Sociorum Martyrum<br><span class=red>vel</span><br>S. Ioannis Leonardi, Presbyteri"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1009"
              mienlace_texto["principal"] = "Ss. Dionysii et Sociorum"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1009Z"
              mienlace_texto["otro"] = "S. Ioannis Leonardi"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "Argentina: San Héctor Valdivielso Sáez, Mártir"
                mienlace_texto["otro2"] = "Argentina: San Héctor Valdivielso"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#1009"
              }
              break
            case "10.10":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: Santo Tomás de Villanueva"
                mienlace_texto["principal"] =
                  "España: Santo Tomás de Villanueva"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1010"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Nigeria: Saint Daniel Comboni, Bishop"
                mienlace_texto["otro"] = "Nigeria: Saint Daniel Comboni"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#1010"
              }
              break
            case "11.10":
              resultado += "S. Ioannis XXIII, Papæ"
              mienlace_texto["principal"] = "S. Ioannis XXIII"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1011"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: Santa Soledad Torres Acosta"
                mienlace_texto["otro"] = "España: Santa Soledad Torres Acosta"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1011B"
              }
              break
            case "12.10":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "España: Nuestra Señora del Pilar <span class=red>(F)</span>"
                mienlace_texto["principal"] = "España: Nuestra Señora del Pilar"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1012"
              }
              if (mimisal_1 == "port" || mimisal_2 == "port") {
                resultado +=
                  "Brasil: Nossa Senhora da Conceição Aparecida <span class=red>(S)</span>"
                mienlace_texto["otro"] =
                  "Brasil: Nossa Senhora da Conceição Aparecida"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_brasil.html#1012Z"
              }
              break
            case "14.10":
              resultado += "S. Callisti I, Papæ et Martyris"
              mienlace_texto["principal"] = "S. Callisti I"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1014"
              break
            case "15.10":
              resultado +=
                "S. Teresiæ A Iesu, Virginis et Ecclesiæ Doctoris<br><span class=red>(Memoria)<br>(España: Fiesta)</span>"
              mienlace_texto["principal"] = "S. Teresiæ A Iesu"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1015"
              break
            case "16.10":
              resultado +=
                "S. Hedvigis, Religiosæ<br><span class=red>vel</span><br>S. Margaritæ Maríæ Alacoque, Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1016"
              mienlace_texto["principal"] = "S. Hedvigis"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1016Z"
              mienlace_texto["otro"] = "S. Margaritæ Maríæ Alacoque"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Hl. Gallus, Mönch"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1016Y"
                mienlace_texto["otro2"] = "In deutscher Sprache: Hl. Gallus"
              }
              break
            case "17.10":
              resultado +=
                "S. Ignatii Antiocheni, Episcopi et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Ignatii Antiocheni"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1017"
              break
            case "18.10":
              resultado +=
                "S. Lucæ, Evangelistæ<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Lucæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1018"
              break
            case "19.10":
              resultado +=
                "Ss. Ioannis De Brebeuf et Isaac Jogues, Presbyterorum, et Sociorum, Martyrum<br><span class=red>vel</span><br>S. Pauli A Cruce, Presbyteri<br>United States: Ss. John de Brebeuf and Isaac Jogues and Companions <span class=red>(M)</span>"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1019"
              mienlace_texto["principal"] =
                "Ss. Ioannis De Brebeuf et Isaac Jogues"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1019Z"
              mienlace_texto["otro"] = "S. Pauli A Cruce"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: San Pedro de Alcántara"
                mienlace_texto["otro2"] = "España: San Pedro de Alcántara"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1019Y"
              }
              break
            case "20.10":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Wendelin"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1020"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Wendelin"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                mienlace_texto["otro"] =
                  "United States: Saint Paul of the Cross"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1019Z"
                resultado +=
                  "<br>United States: Saint Paul of the Cross, priest<br>Africa: Blessed Daudi Okelo and Jildo Irwa, Martyrs"
                mienlace_texto["otro2"] =
                  "Africa: Blessed Daudi Okelo and Jildo Irwa"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#1020"
              }
              break
            case "21.10":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Ursula und Gefährtinnen, Märtyrinnen"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1021"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Ursula und Gefährtinnen"
              }
              break
            case "22.10":
              resultado += "S. Ioannis Pauli II, Papæ"
              mienlace_texto["principal"] = "S. Ioannis Pauli II"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1022"
              break
            case "23.10":
              resultado += "S. Ioannis De Capestrano, Presbyteri"
              mienlace_texto["principal"] = "S. Ioannis De Capestrano"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1023"
              break
            case "24.10":
              resultado += "S. Antonii Maríæ Claret, Episcopi"
              mienlace_texto["principal"] = "S. Antonii Maríæ Claret"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1024"
              break
            case "25.10":
              if (mimisal_1 == "port" || mimisal_2 == "port") {
                resultado += "Brasil: Santo Antônio de Santana Galvão"
                mienlace_texto["principal"] =
                  "Brasil: Santo Antônio de Santana Galvão"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1025"
              }
              break
            case "28.10":
              resultado +=
                "Ss. Simonis et Iudæ, Apostolorum<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "Ss. Simonis et Iudæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1028"

              break
            case "31.10":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Wolfgang, Bischof"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_oct.html#1031"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Wolfgang"
              }
              break
            case "01.11":
              resultado +=
                "Omnium Sanctorum<br><span class=red>(Sollemnitas)</span>"
              mienlace_texto["principal"] = "Omnium Sanctorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1101"
              break
            case "02.11":
              resultado += "In Commemoratione Omnium Fidelium Defunctorum"
              mienlace_texto["principal"] =
                "In Commemoratione Omnium Fidelium Defunctorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1102"
              break
            case "03.11":
              resultado += "S. Martini De Porres, Religiosi"
              mienlace_texto["principal"] = "S. Martini De Porres"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1103"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "<br>In deutscher Sprache: Hubert, Bischof<br>In deutscher Sprache: Hl. Pirmin, Abtbischof"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1103Z"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Hubert, Bischof"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1103Y"
                mienlace_texto["otro2"] =
                  "In deutscher Sprache: Hl. Pirmin, Abtbischof"
              }
              break
            case "04.11":
              resultado +=
                "S. Caroli Borromeo, Episcopi<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Caroli Borromeo"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1104"
              break
            case "05.11":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "España: Santa Ángela de la Cruz, virgen"
                mienlace_texto["principal"] = "España: Santa Ángela de la Cruz"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1105"
              }
              break

            case "06.11":
              resultado +=
                "España: Santos Pedro Poveda, Inocencio Canoura, y compañeros<br><span class=red>(Memoria)</span>"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                mienlace_texto["principal"] =
                  "España: Santos Pedro Poveda y compañeros"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1106"
              }
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Leonhard, Einsiedler"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1106Z"
                mienlace_texto["otro"] =
                  "In deutscher Sprache: Hl. Leonhard, Einsiedler"
              }
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado += "<br>Africa: All Saints of Africa (Memorial)"
                mienlace_texto["otro2"] = "Africa: All Saints of Africa"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_africa.html#1106"
              }
              break
            case "07.11":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "In deutscher Sprache: Hl. Willibrord, Bischof"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1107"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Willibrord"
              }
              break
            case "08.11":
              resultado += "Opus Dei: S. Severini"
              mienlace_texto["principal"] = "Opus Dei: S. Severini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#1108"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>Uruguay: Nuestra Señora, la Virgen de los Treinta y tres"
                mienlace_texto["otro"] =
                  "Uruguay: Nuestra Señora, la Virgen de los Treinta y tres"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#1108"
              }
              break
            case "09.11":
              resultado +=
                "In Dedicatione Basilicæ Lateranensis<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] =
                "In Dedicatione Basilicæ Lateranensis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1109"
              break
            case "10.11":
              resultado +=
                "S. Leonis Magni, Papæ et Ecclesiæ Doctoris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Leonis Magni"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1110"
              break
            case "11.11":
              resultado +=
                "S. Martini, Episcopi<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Martini"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1111"
              break
            case "12.11":
              resultado +=
                "S. Iosaphat, Episcopi et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Iosaphat"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1112"
              break
            case "13.11":
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "United States: Saint Frances Xavier Cabrini, Virgin <span class=red>(M)</span>"
                mienlace_texto["principal"] =
                  "United States: Saint Frances Xavier Cabrini"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1113Z"
              }
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado += "<br>España: San Leandro"
                mienlace_texto["otro"] = "España: San Leandro"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1113"
              }
              break
            case "15.11":
              resultado += "S. Alberti Magni, Episcopi et Ecclesiæ Doctoris"
              mienlace_texto["principal"] = "S. Alberti Magni"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1115"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado += "<br>In deutscher Sprache: Hl. Leopold"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1115Z"
                mienlace_texto["otro"] = "In deutscher Sprache: Hl. Leopold"
              }
              break
            case "16.11":
              resultado +=
                "S. Margaritæ Scotiæ<br><span class=red>vel</span><br>S. Gertrudis, Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1116"
              mienlace_texto["principal"] = "S. Margaritæ Scotiæ"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1116Z"
              mienlace_texto["otro"] = "S. Gertrudis"
              break
            case "17.11":
              resultado +=
                "S. Elisabeth Hungariæ<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Elisabeth Hungariæ"
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1117Z"
              } else
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1117"
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "<br>Argentina...: Santos Roque González, Alfonso Rodríguez y Juan del Castillo, Presbíteros y mártires"
                mienlace_texto["otro2"] =
                  "Argentina...: Santos Roque González, Alfonso Rodríguez y Juan del Castillo"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#1117"
              }
              break
            case "18.11":
              resultado +=
                "In Dedicatione Basilicarum Ss. Petri et Pauli, Apostolorum"
              mienlace_texto["principal"] =
                "In Dedicatione Basilicarum Ss. Petri et Pauli, Apostolorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1118"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "<br>United States: Saint Rose Philippine Duchesne, Virgin <span class=red>(M)</span>"
                mienlace_texto["otro"] =
                  "United States: Saint Rose Philippine Duchesne"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1118Z"
              }
              break
            case "19.11":
              if (mimisal_1 == "cast" || mimisal_2 == "cast") {
                resultado +=
                  "Paraguay: Santos Roque González, Alfonso Rodríguez y Juan del Castillo, Presbíteros y mártires<br><span class=red>(Solemnidad)</span>"
                mienlace_texto["principal"] =
                  "Paraguay: Santos Roque González, Alfonso Rodríguez y Juan del Castillo"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_arg.html#1119"
                resultado +=
                  "<br>Argentina y Uruguay: Santa Isabel de Hungría <span class=red>(M)</span>"
                mienlace_texto["otro"] = "Argentina y Uruguay: Santa Isabel"
                mienlace_santo["otro"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1117"
              }
              break
            case "21.11":
              resultado +=
                "In Præsentatione Beatæ Maríæ Virginis<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] =
                "In Præsentatione Beatæ Maríæ Virginis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1121"
              break
            case "22.11":
              resultado +=
                "S. Cæciliæ, Virginis et Martyris<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "S. Cæciliæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1122"
              break
            case "23.11":
              resultado +=
                "S. Clementis I, Papæ et Martyris<br><span class=red>vel</span><br>S. Columbani, Abbatis"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1123"
              mienlace_texto["principal"] = "S. Clementis I"
              mienlace_santo["otro"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1123Z"
              mienlace_texto["otro"] = "S. Columbani"
              if (mimisal_1 == "engl" || mimisal_2 == "engl") {
                resultado +=
                  "<br>United States: Blessed Miguel Agustín Pro, Priest and Martyr <span class=red>(M)</span>"
                mienlace_santo["otro2"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1123X"
                mienlace_texto["otro2"] = "Blessed Miguel Agustín Pro"
              }
              break
            case "24.11":
              resultado +=
                "Ss. Andreæ Dung-Lac, Presbyteri, et Sociorum, Martyrum<br><span class=red>(Memoria)</span>"
              mienlace_texto["principal"] = "Ss. Andreæ Dung-Lac, et Sociorum"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1124"
              break
            case "25.11":
              resultado += "S. Catharinæ Alexandrinæ, Virginis et Martyris"
              mienlace_texto["principal"] = "S. Catharinæ Alexandrinæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1125"
              break
            case "26.11":
              if (mimisal_1 == "germ" || mimisal_2 == "germ") {
                resultado +=
                  "In deutscher Sprache: Hl. Konrad und hl. Gebhard, Bischöfe"
                mienlace_santo["principal"] =
                  "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1126"
                mienlace_texto["principal"] =
                  "In deutscher Sprache: Hl. Konrad und hl. Gebhard"
              }
              break
            case "28.11":
              resultado += "Opus Dei: In anniversario erectionis Prælaturæ"
              mienlace_texto["principal"] =
                "Opus Dei: In anniversario erectionis Prælaturæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_obra.html#1128"
              break
            case "30.11":
              resultado +=
                "S. Andreæ, Apostoli<br><span class=red>(Festum)</span>"
              mienlace_texto["principal"] = "S. Andreæ"
              mienlace_santo["principal"] =
                "../misal_v2/m_estructura/santos/m_estructura_santos_nov.html#1130"
              break
            default:
              resultado = ""
          }
        }
        resultado += resultado_santos
        if (resultado != "")
          resultado =
            "<br><B class=red>Commemorationes Calendarii</B><br>" + resultado
        return resultado
      }
      var esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.indexOf('Macintosh') !== -1 && 'ontouchstart' in document);
      function onDeviceReady() {
  // Register the event listener
  if (!esDispositivoMovil) {
    var elementos = document.querySelectorAll("[ontouchend]");
    for (var i = 0; i < elementos.length; i++) {
      var elemento = elementos[i];
      var contenido = elemento.getAttribute("ontouchend");
      elemento.removeAttribute("ontouchend");
      elemento.setAttribute("onclick", contenido);
    }
    if (window.plugins && window.plugins.insomnia) {
      window.plugins.insomnia.keepAwake();
    }
  }
  document.addEventListener("backbutton", backKeyDown, true);
  if (esIOS) {
        $("#exitBtn").css('display' ,"none");
    }

  // Función para obtener la fecha en formato deseado
  function obtenerFechaLocal() {
    var hoy = new Date();
    var y1 = hoy.getFullYear();
    var m1 = hoy.getMonth() + 1; // integer, 0..11
    var d1 = hoy.getDate(); // integer, 1..31

    hoy_global = d1 + "." + m1 + "." + y1;
    buscafecha.resolve();
  }

  
  // Verificar si navigator.globalization y sus métodos están disponibles
  if (esDispositivoMovil &&
    navigator.globalization &&
    typeof navigator.globalization.dateToString === "function" &&
    typeof navigator.globalization.stringToDate === "function"
  ) {
    // Utilizar Globalization si está disponible
    navigator.globalization.dateToString(
      new Date(),
      function (date) {
        navigator.globalization.stringToDate(
          date.value,
          function (date2) {
            var y1 = date2.year;
            var m1 = date2.month + 1; // integer, 0..11
            var d1 = date2.day; // integer, 1..31

            hoy_global = d1 + "." + m1 + "." + y1;
            buscafecha.resolve();
          },
          function () {
            alert("Error getting date\n");
            obtenerFechaLocal(); // Fallback
          },
          { formatLength: "medium", selector: "date" }
        );
      },
      function () {
        obtenerFechaLocal(); // En caso de error, usar la fecha local
      },
      { formatLength: "medium", selector: "date" }
    );
  } else {
    // Si no está disponible, usar la fecha local
    obtenerFechaLocal();
  }

  $('#cabecera, td.day , .red , td.title , td.button ').css('font-size', mipreferencia["tamanotexto"] + 'pt');
  setTimeout(() => {
      arregla_top()
      arregla_bottom()
  }, 100);
}



      function backKeyDown() {
        //console.log("Back Button Pressed!");
        navigator.app.exitApp()
      }

      function pintacuadro() {
        document.formulario.lect_elegida.value = mienlace_lecturas["dia"]
        document.formulario.misa_elegida.value = mienlace_misa["dia"]
        resultado = ""
        i = 0
        resultado2 =
          '<br><div class="select-wrapper float-left"><select id=elegido name=elegido onchange=\'document.formulario.lect_elegida.value=document.getElementById("lect_"+this.value).value ;  document.formulario.misa_elegida.value=document.getElementById("misa_"+this.value).value ;   \' >'
        for (var key in mienlace_misa) {
          // write the index and the value of each element
          if (key == "dia") {
            textito = " selected "
          } else textito = ""
          resultado2 +=
            "<option  value='" +
            key +
            "' " +
            textito +
            ">" +
            mienlace_texto[key] +
            "</option>"
          i++
          resultado +=
            "<input type=hidden name=misa_" +
            key +
            " id =misa_" +
            key +
            " value='" +
            mienlace_misa[key] +
            "' >"
        }
        resultado2 += "</select><span>&#9660;</span></div><br>"

        if (i > 1) {
          resultado += resultado2
        } else if (i == 1) {
          resultado += "<input type=hidden name=elegido value='dia' >"
        } else resultado += "<input type=hidden name=elegido value=0 >"

        for (var key in mienlace_lecturas) {
          // write the index and the value of each element
          resultado +=
            "<input type=hidden name=lect_" +
            key +
            " id =lect_" +
            key +
            "   value='" +
            mienlace_lecturas[key] +
            "'>"
        }
        /*
              if (typeof mienlace_santo['alternativa0'] != undefined ) { document.formulario.santo_elegido.value = mienlace_santo['alternativa0'];
              } else if (typeof mienlace_santo['principal'] != undefined ) document.formulario.santo_elegido.value = mienlace_santo['principal']
              */
        k = 0
        resultado3 =
          "<br><div  class='select-wrapper float-left'><select name=misanto id=misanto onchange='document.formulario.santo_elegido.value=this.value'>"
        var textito = ""
        var seleccionado = false
        for (var key in mienlace_santo) {
          // write the index and the value of each element
          if (k == 0)
            document.formulario.santo_elegido.value = mienlace_santo[key]
          if (key == "alternativa0") {
            textito = " selected "
            document.formulario.santo_elegido.value =
              mienlace_santo["alternativa0"]
            seleccionado = true
          } else if (key == "principal" && !seleccionado) {
            document.formulario.santo_elegido.value =
              mienlace_santo["principal"]
          }
          resultado3 +=
            "<option  value='" +
            mienlace_santo[key] +
            "'" +
            textito +
            ">" +
            mienlace_texto[key] +
            "</option>"
          if (seleccionado) textito = ""
          k++
          resultado +=
            "<input type=hidden name=santo_" +
            key +
            " value='" +
            mienlace_santo[key] +
            "' >"
        }

        if (k > 0) {
          resultado3 +=
            "<option  value='m_estructura/indices/m_estructura_indice_santos.html?'>Index (Proprium Sanctorum)</option>"
          resultado +=
            "<input type=hidden name=santo_999 value='m_estructura/indices/m_estructura_indice_santos.html?' >"
          k++
        }
        resultado3 += "</select><span>&#9660;</span></div><br>"

        if (k > 1) {
          resultado += resultado3
        } else if (k == 1) {
          document.formulario.santo_elegido.value = mienlace_santo["principal"]
        } else document.formulario.santo_elegido.value = 0

        document.getElementById("cuadro").innerHTML = resultado
//        if (i > 1) $("#elegido").selectmenu()
//        $("#misanto").selectmenu()
      }

      function parseURL(url) {
        /*
              Ejemplo:
              var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');

              myURL.file;     // = 'index.html'
              myURL.hash;     // = 'top'
              myURL.host;     // = 'abc.com'
              myURL.query;    // = '?id=255&m=hello'
              myURL.params;   // = Object = { id: 255, m: hello }
              myURL.path;     // = '/dir/index.html'
              myURL.segments; // = Array = ['dir', 'index.html']
              myURL.port;     // = '8080'
              myURL.protocol; // = 'http'
              myURL.source;   // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'

              */

        var a = document.createElement("a")
        a.href = url
        return {
          source: url,
          protocol: a.protocol.replace(":", ""),
          host: a.hostname,
          port: a.port,
          query: a.search,
          params: (function () {
            var ret = {},
              seg = a.search.replace(/^\?/, "").split("&"),
              len = seg.length,
              i = 0,
              s
            for (; i < len; i++) {
              if (!seg[i]) {
                continue
              }
              s = seg[i].split("=")
              ret[s[0]] = s[1]
            }
            return ret
          })(),
          file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
          hash: a.hash.replace("#", ""),
          path: a.pathname.replace(/^([^\/])/, "/$1"),
          relative: (a.href.match(/tp:\/\/[^\/]+(.+)/) || [, ""])[1],
          segments: a.pathname.replace(/^\//, "").split("/"),
        }
      }

      $.fn.outerHTML = function () {
        return jQuery("<div />").append(this.eq(0).clone()).html()
      }
      
      function esperarCordova() {
  return new Promise(resolve => {
    function checkCordova() {
      // Caso 1: No estamos en Cordova → estamos en navegador
      if (!window.cordova) {
        console.log("Cordova no está presente: asumiendo entorno navegador.");
        return resolve(); // ✅ Salimos y continuamos sin esperar nada
      }

      // Caso 2: Cordova está presente y listo
      if (cordova.file) {
        console.log("Cordova y plugins listos (cordova.file disponible)");
        return resolve();
      }

      // Caso 3: Cordova está cargado, pero aún no ha disparado deviceready
      document.addEventListener("deviceready", () => {
        console.log("Cordova listo (evento deviceready)");
        resolve();
      }, { once: true });
    }

    checkCordova();
  });
}



      async function carga_pagina(origenURL) {
  await esperarCordova();
  var misal_1 = mimisal_1;
  var misal_2 = mimisal_2;
  var partes = origenURL.split("/");
  var miPath = partes.slice(0, -1).join("/");
  var miArchivo = partes[partes.length - 1];

  if (misal_1==misal_2){
    if (misal_1=='cast') { misal_2='latin';} else misal_2='cast';
  }
  var hash = origenURL.split("#")[1];
  var idiomaUrl1 = origenURL.replace(/estructura/gi, misal_1);
  var idiomaUrl2 = origenURL.replace(/estructura/gi, misal_2);
  var estructuraData = document.createElement("div");
  var idiomaData1 = document.createElement("div");
  var idiomaData2 = document.createElement("div");

        // Función auxiliar para manejar errores sin rechazar Promise.all()
        var safeGet = function(miurl, targetElement) {
              return new Promise(function(resolve) {
                var isIOS = window.cordova && cordova.platformId === "ios";
                var isCordova = !!window.cordova;
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
            
                // Solo usamos acceso directo a archivos en iOS Cordova
                if (isIOS && window.cordova.file) {
                  var fullUrl = cordova.file.applicationDirectory + "www/misal_v2/" + cleanUrl;
                  console.log("[safeGet] Intentando leer desde iOS filesystem:", fullUrl);

                  window.resolveLocalFileSystemURL(fullUrl, function (fileEntry) {
                    fileEntry.file(function (file) {
                      var reader = new FileReader();
                      var watchdog;

                      reader.onloadend = function () {
                        clearTimeout(watchdog);
                        console.log("[safeGet] Archivo leído con éxito (iOS)");
                        targetElement.innerHTML = this.result;
                        resolve(this.result);
                      };

                      reader.onerror = function () {
                        clearTimeout(watchdog);
                        console.error("[safeGet] Error leyendo archivo con FileReader");
                        resolve(null);
                      };

                      // Watchdog por si no dispara ningún evento (iOS bug)
                      watchdog = setTimeout(function() {
                        console.warn("[safeGet] FileReader timeout, resolviendo fallback");
                        resolve(null);
                      }, 3000);

                      reader.readAsText(file);
                    }, function (error) {
                      console.error("[safeGet] Error accediendo al archivo (file):", JSON.stringify(error));
                      fallback();
                    });
                  }, function (error) {
                    console.warn("[safeGet] No se pudo acceder al archivo (entry):", JSON.stringify(error));
                    fallback();
                  });

                } else {
                  fallback();
                }
              });
            };
        




  if (miPath !== "m_estructura/indices") {


      // Crear promesas para cada archivo
      var promesas = [
          safeGet(origenURL, estructuraData),
          safeGet(idiomaUrl1, idiomaData1),
          safeGet(idiomaUrl2, idiomaData2)
      ];

      // Esperar a que todas las promesas se completen sin fallar globalmente
      await Promise.all(promesas);
  
      if (hash) {
  var nuevoElemento = $(estructuraData).find("#" + hash).clone(); // Clonamos para evitar que desaparezca
  nuevoElemento.removeClass("dia"); // Quitamos la clase antes de insertarlo
  $(estructuraData).replaceWith(nuevoElemento); // Reemplazamos completamente el elemento original
  estructuraData = nuevoElemento; // Actualizamos la referencia si es necesario
}
//console.log('DESPUES: hash:' + hash + '----' + nuevoElemento.prop('outerHTML'));

//        console.log(('DESPUES: hash:'+hash+ '----'+$(estructuraData).html()))
      // Procesar los datos si se cargó algún idioma
      $(estructuraData)
      .find(".padre")
      .each(function () {
          var match = $(this).attr("class").match(/padre_([\w-]+)/);
          if (!match) return; // Salta si no encuentra clase padre_xxx
          var numero = match[1];

          var hijoIdioma1 = $(idiomaData1).find(".hijo_" + numero);
          if (hijoIdioma1.length > 0) {
              $(this).append(hijoIdioma1);
          }

          var hijoIdioma2 = $(idiomaData2).find(".hijo_" + numero);
          if (mimisal_1 !== mimisal_2 && hijoIdioma2.length > 0) {
              $(this).append(hijoIdioma2);
          }
  
          $(this).removeClass("padre padre_" + numero);
  
          // Eliminar clases "hijo" y "hijo_xxx" de los hijos recién añadidos
          $(this).children().removeClass("hijo hijo_" + numero);
      });
  
        } else {
          // Si estamos en "m_estructura/indices", solo cargamos origenURL
          await safeGet(origenURL, estructuraData);
      }
console.log('antes error '+origenURL)
var estructuraDom = $(estructuraData).get(0);
if (estructuraDom) {
  var elementos = estructuraDom.querySelectorAll("*");
  for (var i = 0; i < elementos.length; i++) {
    var el = elementos[i];
    var removed = false;
    var clases = Array.prototype.slice.call(el.classList);
    for (var j = 0; j < clases.length; j++) {
      var clase = clases[j];
      if (clase.indexOf("hijo_") === 0) {
        el.classList.remove(clase);
        removed = true;
      }
    }
    if (removed) {
      el.classList.remove("hijo");
    }
  }
} else {
  console.warn("estructuraData está vacío o no tiene elementos válidos:", origenURL);
}

console.log('despues error '+origenURL)
  // Agregar el fragmento al contenedor

  var $estructura = $(estructuraData).clone(); // No modificar el DOM original, si es necesario
reemplazarComentariosSoloEn($estructura);
var resultado = $estructura.html(); // Contiene HTML procesado sin tocar el DOM completo

      return resultado;

}


      async function prepara_misal(mimisa, milectura, misanto) {
          // Safety net for web: if deviceready fired too early (or not at all),
          // dia_liturgico may not have run yet, leaving globals like miciclo undefined.
          // Ensure they exist before using them.
          if (typeof miciclo === "undefined" || typeof tipoanio2 === "undefined" || !tipoanio2) {
            try {
              var _fechaBase =
                (typeof hoy_global !== "undefined" && hoy_global) ? hoy_global :
                (typeof fecha_hoy !== "undefined" ? fecha_hoy : "");
              if (_fechaBase) {
                dia_liturgico(_fechaBase);
              }
            } catch (e) {
              // If anything fails, fall back to stored preference.
              try { miciclo = dime_pref("ciclo", "A"); } catch (_) {}
              try { tipoanio2 = (typeof tipoanio2 !== "undefined" && tipoanio2) ? tipoanio2 : dime_pref("tipoanno", "par"); } catch (_) {}
            }
          }
          
          pon_pref("lhpf_tope", 500)
          pon_pref("lhpf_ultimo", 500)
          pon_pref("lhpe_tope", 500)
          pon_pref("lhpe_ultimo", 500)
          pon_pref("lhle502", "nada")
          pon_pref("lhle_tope", 500)
          pon_pref("lhle_ultimo", 500)
          pon_pref("lhc_tope", 500)
          pon_pref("lhc_ultimo", 500)
          pon_pref("lhs_tope", 500)
          pon_pref("lhs_ultimo", 500)
          pon_pref("lht_tope", 500)
          pon_pref("lht_ultimo", 500)
          pon_pref("scroll_o500", 0)
          pon_pref("scroll_t500", 0)
          pon_pref("scroll_s500", 0)
          pon_pref("scroll_le500", 0)
          pon_pref("scroll_pf500", 0)
          pon_pref("scroll_pe500", 0)
          pon_pref("scroll_c500", 0)
          pon_pref("scroll_t501", 0)
          pon_pref("scroll_s501", 0)
          pon_pref("scroll_le501", 0)
          pon_pref("scroll_le501", 0)
          pon_pref("scroll_pf501", 0)
          pon_pref("scroll_pe501", 0)
          pon_pref("scroll_c501", 0)
          pon_pref("lho500", '')
          pon_pref("lht500", '')
          pon_pref("lhs500", '')
          pon_pref("lhle500", '')
          pon_pref("lhpf500", '')
          pon_pref("lhpe500", '')
          pon_pref("lhc500", '')
          var promesas = []
        miUrl = parseURL(window.location.href).path
        var r = /[^\/]*$/
        miUrl = miUrl.replace(r, "")
        lect_santo = misanto.replace(
          "m_estructura/santos/m_estructura_santos_",
          "m_estructura/lecturas/m_estructura_lecturas_santos_"
        )
        //alert(mimisa + milectura + misanto + lect_santo)
        pon_pref("ciclo", miciclo)
        pon_pref("tipoanno", tipoanio2)

        pon_pref("opcion_elegida", "0")

        if (mimisa.includes('indice')) mimisa=0
        /*
        promesas.push(
          carga_pagina(
            "m_estructura/indices/m_estructura_indice_tiempos.html"
          ).then((contenido) => {
            // Aquí puedes hacer algo con el contenido si es necesario
            // Por ejemplo, asignarlo a un elemento específico
            pon_pref("lht500", contenido)
          })
        )
        */
        if (mimisa != "0") {
        promesas.push(
          carga_pagina(mimisa).then((contenido) => {
            // Aquí puedes hacer algo con el contenido si es necesario
            // Por ejemplo, asignarlo a un elemento específico
                pon_pref("lht_tope", 501)
                pon_pref("lht_ultimo", 501)
                pon_pref("lht501", contenido)
        //        console.log('cccc'+dime_pref("lht501", 'badadadad'))
          })
        )
          
        }
        /*
        promesas.push(
          carga_pagina(
            "m_estructura/indices/m_estructura_indice_santos.html"
          ).then((contenido) => {
            // Aquí puedes hacer algo con el contenido si es necesario
            // Por ejemplo, asignarlo a un elemento específico
            pon_pref("lhs500", contenido)
            
          })
        )
        
        */
            if (misanto != "0") {
        promesas.push(
          carga_pagina(misanto).then((contenido) => {
            // Aquí puedes hacer algo con el contenido si es necesario
            // Por ejemplo, asignarlo a un elemento específico
                pon_pref("lhs_tope", 501)
                pon_pref("lhs_ultimo", 501)
                pon_pref("lhs501", contenido)
          })
        )
            }
            /*
        promesas.push(
          carga_pagina(
            "m_estructura/indices/m_estructura_indice_comunes.html"
          ).then((contenido) => {
            // Aquí puedes hacer algo con el contenido si es necesario
            // Por ejemplo, asignarlo a un elemento específico
            pon_pref("lhc500", contenido)
          })
        )
        
        promesas.push(
          carga_pagina(
            "m_estructura/indices/m_estructura_indice_lecturas.html"
          ).then((contenido) => {
            pon_pref("lhle500", contenido)
          })
        )
        
        */
        if (milectura != "0") {
          promesas.push(
            carga_pagina(milectura).then((contenido) => {
              // Aquí puedes hacer algo con el contenido si es necesario
              // Por ejemplo, asignarlo a un elemento específico

              pon_pref("lhle_tope", 501)
                pon_pref("lhle_ultimo", 501)
                pon_pref("lhle501", contenido)
            })
          )

        }
        if (misanto != "0") {
          promesas.push(
            carga_pagina(lect_santo).then((contenido) => {
              // Aquí puedes hacer algo con el contenido si es necesario
              // Por ejemplo, asignarlo a un elemento específico
              
              pon_pref("lhle_tope", 502)
              pon_pref("lhle502", contenido)
            })
          )
        }
/*
        promesas.push(
          carga_pagina(
            "m_estructura/indices/m_estructura_indice_prefacios.html"
          ).then((contenido) => {
            // Aquí puedes hacer algo con el contenido si es necesario
            // Por ejemplo, asignarlo a un elemento específico
            pon_pref("lhpf500", contenido)
          })
        )
        promesas.push(
          carga_pagina(
            "m_estructura/indices/m_estructura_indice_pleg_euc.html"
          ).then((contenido) => {
            // Aquí puedes hacer algo con el contenido si es necesario
            // Por ejemplo, asignarlo a un elemento específico
            pon_pref("lhpe500", contenido)
          })
        )
        */
        await Promise.all(promesas)


        var partespos = ["tmp", "snt", "com", "pf", "pe"];
partespos.forEach((p) => pon_pref("x_" + p + "_prefacio", "nada"));
pon_pref("x_pe_pleg", "nada");

var partespos2 = [
  "titulo", "ant_ent", "gloria", "colecta", "credo", "antes_or_fieles",
  "or_ofrend", "ant_com", "post_com", "or_pueblo", "prefacio", "pleg",
];
partespos2.forEach((p) => pon_pref("x_com_" + p, "nada"));

puntero_t = dime_pref("lht_ultimo");
if (puntero_t == 500) {
  partespos2.forEach(function(p) { pon_pref("x_tmp_" + p, "nada"); });
} else {
  $("#mibuffer1").html(dime_pref("lht" + puntero_t));
  partespos2.forEach(function(p) {
    var elem = $("#mibuffer1 .x_" + p);
    pon_pref("x_tmp_" + p, elem.length ? elem[0].outerHTML : "nada");
  });
}
var promesaCargaTO = $.Deferred();
if (es_domingo_to){
  carga_pagina(
                "m_estructura/indices/m_estructura_indice_prefacios.html#extracto_domingos"
              ).then(function(contenido) {
                $("#mibuffer6").html(contenido)
                var midiv_pref = $("#mibuffer6 .x_prefacio").outerHTML()
                pon_pref("x_tmp_prefacio", midiv_pref)
                promesaCargaTO.resolve()
              })
} else promesaCargaTO.resolve()

puntero_s = dime_pref("lhs_ultimo");
if (puntero_s == 500) {
  partespos2.forEach(function(p) { pon_pref("x_snt_" + p, "nada"); });
} else {
  $("#mibuffer2").html(dime_pref("lhs" + puntero_s));
  partespos2.forEach(function(p) {
    var elem = $("#mibuffer2 .x_" + p);
    pon_pref("x_snt_" + p, elem.length ? elem[0].outerHTML : "nada");
  });
}

        puntero_le = dime_pref("lhle_ultimo")
        $("#mibuffer3").html(dime_pref("lhle" + puntero_le))
        $("#mibuffer3 .ciclo" + miciclo)
          .siblings()
          .remove()
        if (mitipoanio3 == "annoprimo") $("#mibuffer3  .annosecundo").remove()
        if (mitipoanio3 == "annosecundo") $("#mibuffer3  .annoprimo").remove()

        var partespos3 = [
          "prim_lect",
          "salmo",
          "seg_lect",
          "aleluya",
          "evangelio",
        ]
        var index3
        for (index3 = 0; index3 < partespos3.length; ++index3) {
          if ($("#mibuffer3 .x_" + partespos3[index3]).length) {
            var midiv3 = $("#mibuffer3 .x_" + partespos3[index3]).outerHTML()
            pon_pref("x_tmp_lct_" + partespos3[index3], midiv3)
          } else pon_pref("x_tmp_lct_" + partespos3[index3], "nada")
        }

        $("#mibuffer4").html(dime_pref("lhle502",'nada'))
        $("#mibuffer4 .ciclo" + miciclo)
          .siblings()
          .remove()
        if (mitipoanio3 == "annoprimo") $("#mibuffer4  .annosecundo").remove()
        if (mitipoanio3 == "annosecundo") $("#mibuffer4  .annoprimo").remove()


        var partespos3 = [
  "prim_lect",
  "salmo",
  "seg_lect",
  "aleluya",
  "evangelio",
];

for (var index3 = 0; index3 < partespos3.length; ++index3) {
  var selector = "#mibuffer4 .x_" + partespos3[index3];
  var $elemento = $(selector);

  if ($elemento.length) {
    // 1. Guardar el HTML ORIGINAL antes de modificar
    var midiv3 = $elemento[0].outerHTML;
    pon_pref("x_snt_lct_" + partespos3[index3], midiv3);

    // 2. Modificar solo el contenido actual en el DOM
    transformarHrefEnContenedor($elemento);
  } else {
    pon_pref("x_snt_lct_" + partespos3[index3], "nada");
  }
}
pon_pref("lhle502",$("#mibuffer4").html())

var promesaCarga = $.Deferred();
if ($("#mibuffer2 .x_titulo a").filter('a[href^="m_estructura/comunes"]').length > 0) {
  var micomun2 = $("#mibuffer2 .x_titulo a ").filter('a[href^="m_estructura/comunes"]').first().attr("href");
  carga_pagina(micomun2).then(function(contenido) {
    $("#mibuffer5").html(contenido);
    pon_pref("lhc_ultimo", 501);
    pon_pref("lhc_tope", 501);
    pon_pref("lhc501", contenido);
    partespos2.forEach(function(p) {
      var elem = $("#mibuffer5 .x_" + p);
      pon_pref("x_com_" + p, elem.length ? elem[0].outerHTML : "nada");
    });
    promesaCarga.resolve();
  });
} else {
    pon_pref("lhc501", 'nada');
  promesaCarga.resolve();
}

$.when(promesaCarga,promesaCargaTO).then(() => {
  window.location = "misal_todo.html";
});
      }
      function transformarHrefEnContenedor(contenedor) {
  var $contenedor = $(contenedor);

  $contenedor.find('a.boton').each(function () {
    var $link = $(this);
    var originalHref = $link.attr('href');

    if (originalHref && originalHref.indexOf("javascript: vete_a") !== 0) {
      $link.attr('href', "javascript: vete_a('" + originalHref + "');");
    }
  });
}
      function dime_pref(key, defecto) {
        var resultado = window.localStorage.getItem(key)

        if (resultado == null) resultado = defecto
        //console.log('Saco: '+ key+ '... -> ... '+resultado)
        return resultado
      }


      function getUrlVars() {
        var url = window.location.href.replace(window.location.hash, "")
        var vars = {}
        var parts = url.replace(
          /[?&]+([^=&]+)=([^&]*)/gi,
          function (m, key, value) {
            vars[key] = value
          }
        )
        return vars
      }

      function reemplazarComentariosSoloEn($contenedor) {
  // Diccionario de traducciones por idioma y palabra clave
  var traducciones = {
      "cast": { "BREVE": "más breve", "LARGO": "más largo", "O_BIEN": "o bien","SALMO": "Salmo", "LECT_1": "Primera Lectura","LECT_2":"Segunda lectura","ALELUYA":"Aleluya","EVANGELIO":"Evangelio", "LECCIONARIO":"Leccionario", "INDICE" : "ÍNDICE"},
      "engl": { "BREVE": "shorter", "LARGO": "longer", "O_BIEN": "or else","SALMO": "Psalm", "LECT_1": "First Reading","LECT_2":"Second Reading","ALELUYA":"","EVANGELIO":"Gospel", "LECCIONARIO":"Readings", "INDICE" : "INDEX" },
      "ital": { "BREVE": "più breve", "LARGO": "più lungo", "O_BIEN": "oppure","SALMO": "Salmo", "LECT_1": "Prima Lettura","LECT_2":"Seconda Lettura","ALELUYA":"Alleluia","EVANGELIO":"Vangelo", "LECCIONARIO":"Lezionario", "INDICE" : "INDICE" },
      "germ": { "BREVE": "kurzfassung", "LARGO": "länger", "O_BIEN": "oder","SALMO": "Antwortpsalm", "LECT_1": "Erste Lesung","LECT_2":"Zweite Lesung","ALELUYA":"Ruf vor dem Evangelium","EVANGELIO":"Evangelium", "LECCIONARIO":"Lesungen", "INDICE" : "VERZEICHNIS" },
      "port": { "BREVE": "mais breve", "LARGO": "mais longo", "O_BIEN": "ou então","SALMO": "Salmo", "LECT_1": "Primeira Leitura","LECT_2":"Segunda Leitura","ALELUYA":"Aleluia","EVANGELIO":"Evangelho", "LECCIONARIO":"Lecionário", "INDICE" : "INDEX" },
      "fran": { "BREVE": "plus court", "LARGO": "plus long", "O_BIEN": "ou bien","SALMO": "Psaume", "LECT_1": "Première lecture","LECT_2":"Deuxième lecture","ALELUYA":"Alléluia","EVANGELIO":"Évangile", "LECCIONARIO":"Lectionnaire", "INDICE" : "INDEX" },
      "latin": { "BREVE": "brevior", "LARGO": "longior", "O_BIEN": "vel","SALMO": "Psalmus", "LECT_1": "Lectio I","LECT_2":"Lectio II","ALELUYA":"Alleluia","EVANGELIO":"Evangelium", "LECCIONARIO":"Lectionarium", "INDICE" : "INDEX"  }
  };

  $contenedor.contents().each(function procesar() {
        if (this.nodeType === 8) {
            var textoComentario = this.nodeValue.trim();
            if (traducciones.cast[textoComentario]) {
                var contenedor = $(this).closest(".cast, .engl, .ital, .germ, .port, .fran, .latin");
                var idioma = contenedor.length ? contenedor.attr("class").split(" ")[0] : "cast";
                var textoReemplazo = (traducciones[idioma] && traducciones[idioma][textoComentario]) ? traducciones[idioma][textoComentario] : textoComentario;
                $(this).replaceWith(textoReemplazo);
            }
        } else if (this.nodeType === 1) {
            $(this).contents().each(procesar); // Recursivo
        }
    });
}
      window.onerror = function (message, url, lineNumber) {
        console.log(
          "Error: " + message + " in " + url + " at line " + lineNumber
        )
        //        alert("Error: "+message+" in "+url+" at line "+lineNumber)
      }

      var semana_latin = [
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
        "XI",
        "XII",
        "XIII",
        "XIV",
        "XV",
        "XVI",
        "XVII",
        "XVIII",
        "XIX",
        "XX",
        "XXI",
        "XXII",
        "XXIII",
        "XXIV",
        "XXV",
        "XXVI",
        "XXVII",
        "XXVIII",
        "XXIX",
        "XXX",
        "XXXI",
        "XXXII",
        "XXXIII",
        "XXXIV",
      ]

      var mienlace_misa = new Array()
      var mienlace_lecturas = new Array()
      var mienlace_santo = new Array()
      var mienlace_texto = new Array()
      var resultado_santos = ""
      var preferencias = ""
      var midia = 0
      var mipreferencia = new Array()

      mipreferencia['misal_pral'] = dime_pref("misal_pral_defecto", 0)
mipreferencia['segundoidioma'] = dime_pref("segundoidioma_defecto",1)
mipreferencia['presentaciontexto'] = dime_pref("presentaciontexto_defecto",2)
mipreferencia['presentacionrespuestas'] = dime_pref("presentacionrespuestas_defecto",5)
mipreferencia['fondo'] = dime_pref("fondo_defecto", 1)
mipreferencia['tipoletra'] = dime_pref("tipoletra_defecto", 1)
mipreferencia['tamanotexto']=dime_pref("tamanotexto_defecto",12)
mipreferencia['tamanorubrica'] = dime_pref("tamanorubrica_defecto",90)
mipreferencia['tamanomenus']=dime_pref("tamanomenus_defecto",10)
mipreferencia['oracionestodos'] = dime_pref("oracionestodos_defecto",0)
mipreferencia['presentacionpestanas'] = dime_pref("presentacionpestanas_defecto",0)
mipreferencia['presentacionbotones'] = dime_pref("presentacionbotones_defecto",0)
mipreferencia['botoneszurdos'] = dime_pref("botoneszurdos_defecto",0)
mipreferencia['ordinarionormal'] = dime_pref("ordinarionormal_defecto",0)
mipreferencia['avance'] = dime_pref("avance_defecto", 100)
mipreferencia['margen_superior']=dime_pref("margen_superior_defecto", 0)
mipreferencia['margen_inferior']=dime_pref("margen_inferior_defecto", 0)

      var tamano_actual = dime_pref(
        "tamano_calend",
        mipreferencia["tamanotexto"]
      )

      if (mipreferencia["tipoletra"] == 1) {
        mitexto = ' body  { font-family: "Times New Roman"; }  '
      } else mitexto = ""

      if (mipreferencia["fondo"] == 0) {
        mitexto =
          +"  body  {background-color: white; background-image: none; font-size: " +
          mipreferencia["tamanotexto"] +
          "pt }    "
      } else if (mipreferencia["fondo"] == 1) {
        mitexto +=
          "  body  { font-size: " + mipreferencia["tamanotexto"] + "pt; }   "
      }
      if (mipreferencia["fondo"] == 0) {
        mitexto +=
          ' .boton ,  span.botonlengua ,  .boton span.red , a.boton   { background: url("../boton2.png") top right no-repeat;  color: #660000; }'
      } else
        mitexto +=
          ' span.boton , span.botonlengua , .boton span.red , a.boton  { background: url("../boton.png") top right no-repeat;  color: white; }'

      mitexto += " .calendario { font-size: " + tamano_actual + " } "

      var _s = document.createElement('style'); _s.textContent = mitexto; document.head.appendChild(_s);

      lengua = "latin"


      var hoy_global = ""
      var buscafecha = $.Deferred()
      var llegueaqui = $.Deferred()

      $.when(buscafecha, llegueaqui).then(function () {
        respuesta = dia_liturgico(hoy_global)
        document.getElementById("pintar_aqui").innerHTML = respuesta
        pintacuadro()

        mienlace_santo = Array()
        mienlace_lecturas = Array()
        mienlace_misa = Array()
        mienlace_texto = Array()
      })

      var hoy = new Date()
      var y1 = hoy.getFullYear()
      var m1 = hoy.getMonth() + 1 // integer, 0..11
      var d1 = hoy.getDate() // integer, 1..31

      var fecha_hoy = d1 + "." + m1 + "." + y1
      var es_domingo_to = false
      var ciclos = ["A", "B", "C"]
      var tiposanio = ["II", "I"]
      var tiposanio2 = ["par", "impar"]
      var tipoanio2 = ""
      var tiposanio3 = ["annosecundo", "annoprimo"]
      var mitipoanio3 = ""
      // Inicialização preventiva para evitar ReferenceError
      var miciclo = dime_pref("ciclo", "A")
      var idiomas = ["latin", "cast", "engl", "germ", "ital", "port","fran"]
      var mimisal_1 = idiomas[mipreferencia["misal_pral"]]
      var mimisal_2 = idiomas[mipreferencia["segundoidioma"]]
      var santos_aux = ""
      var estoymac = window.localStorage.getItem("estoymac")
      var tamano_actual = dime_pref(
        "tamano_calend",
        mipreferencia["tamanotexto"]
      )
    if (estoymac != 1) {
      estoymac = false
      $(".solo_android").css("display", "block")
      $(".solo_mac").css("display", "none")
    } else {
      estoymac = true
      $(".solo_android").css("display", "none")
      $(".solo_mac").css("display", "block")
    }


    function ejecuta_fiat() {
      $("#boton_fiat").css("opacity", ".4")
      if ($("#misanto").length > 0)
        document.formulario.santo_elegido.value = $("#misanto").val()
      prepara_misal(
        document.formulario.misa_elegida.value,
        document.formulario.lect_elegida.value,
        document.formulario.santo_elegido.value
      )
    }
//     window.addEventListener("load",  loaded, false);
    async function aseguraCarga() {
  // esta funcion asegura que se han creado los indices de las pestañas. Pensado para el arranque inicial...

  //console.log('hola1')
  var promesas = [];
  /*
  if (dime_pref("lhpf_tope", "nada") == "nada") {
    promesas.push(
      carga_pagina("m_estructura/indices/m_estructura_indice_prefacios.html").then(
        (contenido) => {
          // Aquí puedes hacer algo con el contenido si es necesario
          // Por ejemplo, asignarlo a un elemento específico
          pon_pref("lhpf500", contenido);
          pon_pref("lhpf_tope", 500);
          pon_pref("lhpf_ultimo", 500);
        }
      )
    );
  }
  if (dime_pref("lhpe_tope", "nada") == "nada") {
    promesas.push(
      carga_pagina("m_estructura/indices/m_estructura_indice_pleg_euc.html").then(
        (contenido) => {
          // Aquí puedes hacer algo con el contenido si es necesario
          // Por ejemplo, asignarlo a un elemento específico
          pon_pref("lhpe500", contenido);
          pon_pref("lhpe_tope", 500);
          pon_pref("lhpe_ultimo", 500);
        }
      )
    );
  }

  if (dime_pref("lhle_tope", "nada") == "nada") {
    promesas.push(
      carga_pagina("m_estructura/indices/m_estructura_indice_lecturas.html").then(
        (contenido) => {
          pon_pref("lhle500", contenido);
          pon_pref("lhle_tope", 500);
          pon_pref("lhle_ultimo", 500);
        }
      )
    );
  }
  if (dime_pref("lhc_tope", "nada") == "nada") {
    promesas.push(
      carga_pagina("m_estructura/indices/m_estructura_indice_comunes.html").then(
        (contenido) => {
          // Aquí puedes hacer algo con el contenido si es necesario
          // Por ejemplo, asignarlo a un elemento específico
          pon_pref("lhc500", contenido);
          pon_pref("lhc_tope", 500);
          pon_pref("lhc_ultimo", 500);
        }
      )
    );
  }
  if (dime_pref("lhs_tope", "nada") == "nada") {
    promesas.push(
      carga_pagina("m_estructura/indices/m_estructura_indice_santos.html").then(
        (contenido) => {
          // Aquí puedes hacer algo con el contenido si es necesario
          // Por ejemplo, asignarlo a un elemento específico
          pon_pref("lhs500", contenido);
          pon_pref("lhs_tope", 500);
          pon_pref("lhs_ultimo", 500);
        }
      )
    );
  }
  if (dime_pref("lht_tope", "nada") == "nada") {
    //  console.log('hola2')
    promesas.push(
      carga_pagina("m_estructura/indices/m_estructura_indice_tiempos.html").then(
        (contenido) => {
          // Aquí puedes hacer algo con el contenido si es necesario
          // Por ejemplo, asignarlo a un elemento específico
        //  console.log('hola2-3')
          pon_pref("lht500", contenido);
          pon_pref("lht_tope", 500);
          pon_pref("lht_ultimo", 500);
          
        }
      )
    );
  }
*/
  pon_pref("lhpf_tope", 500);
          pon_pref("lhpf_ultimo", 500);
  pon_pref("lhpe_tope", 500);
          pon_pref("lhpe_ultimo", 500);
  pon_pref("lhle_tope", 500);
          pon_pref("lhle_ultimo", 500);
  pon_pref("lhc_tope", 500);
          pon_pref("lhc_ultimo", 500);
  pon_pref("lhs_tope", 500);
          pon_pref("lhs_ultimo", 500);
  pon_pref("lht_tope", 500);
          pon_pref("lht_ultimo", 500);
  //console.log('hola3')
  /*
  try {
    await Promise.all(promesas);
    console.log("aseguraCarga() completada");
    window.location='misal_todo.html';
  } catch (error) {
    console.error("Error en aseguraCarga():", error);
    throw error; // Propaga el error para que pueda ser manejado por el llamador
  }
    */
}
      
