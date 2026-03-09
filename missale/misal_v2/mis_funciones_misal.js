var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* __MISAL_WEB_SHIM__ */
(function () {
    try {
        if (typeof window === 'undefined')
            return;
        if (window.__missalWebShimInstalled)
            return;
        window.__missalWebShimInstalled = true;

        // Detecta Kindle (navegador Silk ou user agent Kindle)
        window.esKindle = /Kindle|Silk|KFTT|KFOT|KFJW|KFJWA|KFAP|KFAPW|KFARW|KFASWI|KFTHW|KFSOW/i.test(navigator.userAgent);
        // Stubs mínimos para o app não quebrar fora do Cordova
        if (!window.plugins)
            window.plugins = {};
        if (!window.plugins.insomnia) {
            window.plugins.insomnia = {
                keepAwake: function () { },
                allowSleepAgain: function () { }
            };
        }
        if (!navigator.app)
            navigator.app = {};
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
        // Garante deviceready no navegador (Cordova real continua com o fluxo normal)
        var fired = false;
        document.addEventListener('deviceready', function () { fired = true; }, { once: true });
        function isNativeShell() {
            try {
                var url = (document.URL || '').toLowerCase();
                var proto = (location.protocol || '').toLowerCase();
                if (proto === 'cdvfile:')
                    return true;
                if (proto === 'file:' && url.indexOf('android_asset') !== -1)
                    return true;
                // Cordova/iOS/Android normalmente roda em file://; na web fica em http(s)://
                if (proto === 'file:' && url.indexOf('http') !== 0)
                    return true;
            }
            catch (e) { }
            return false;
        }
        function fireDevicereadyFallback() {
            if (fired)
                return;
            if (isNativeShell())
                return;
            try {
                document.dispatchEvent(new Event('deviceready'));
            }
            catch (e) {
                var ev = document.createEvent('Event');
                ev.initEvent('deviceready', true, true);
                document.dispatchEvent(ev);
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                setTimeout(fireDevicereadyFallback, 0);
            }, { once: true });
        }
        else {
            setTimeout(fireDevicereadyFallback, 0);
        }
    }
    catch (e) {
        console.warn('missal web shim falhou:', e);
    }
})();
function initGlobalErrorHandler() {
    var osInfo = 'SO desconocido';
    var deviceInfo = 'Dispositivo desconocido';
    document.addEventListener('deviceready', function () {
        if (window.device) {
            osInfo = "".concat(device.platform, " ").concat(device.version);
            deviceInfo = "".concat(device.manufacturer, " ").concat(device.model);
        }
        else {
            osInfo = 'SO no disponible';
            deviceInfo = 'Modelo no disponible';
        }
    });
    // Captura de errores JS
    window.addEventListener('error', function (event) {
        var _a;
        var message = event.message || 'Error desconocido';
        var source = event.filename || 'desconocido';
        var lineno = event.lineno || 0;
        var colno = event.colno || 0;
        var stack = ((_a = event.error) === null || _a === void 0 ? void 0 : _a.stack) || 'No hay stack disponible';
        var fullMessage = [
            '🛑 Error de JavaScript',
            "SO: ".concat(osInfo),
            "Dispositivo: ".concat(deviceInfo),
            "Mensaje: ".concat(message),
            "Archivo: ".concat(source),
            "L\u00EDnea: ".concat(lineno, ", Columna: ").concat(colno),
            "Stack:\n".concat(stack)
        ].join('\n');
        console.error(fullMessage);
        alert(fullMessage);
    });
    // Captura de errores en promesas
    window.addEventListener('unhandledrejection', function (event) {
        var reason = event.reason || {};
        var message = reason.message || reason.toString() || 'Error desconocido';
        var stack = reason.stack || 'No hay stack disponible';
        var fullMessage = [
            '🚨 Error en promesa no manejada',
            "SO: ".concat(osInfo),
            "Dispositivo: ".concat(deviceInfo),
            "Mensaje: ".concat(message),
            "Stack:\n".concat(stack)
        ].join('\n');
        console.error(fullMessage);
        alert(fullMessage);
    });
    console.log('✅ Manejador de errores con info de SO y dispositivo inicializado');
}
initGlobalErrorHandler();
function inicia_ord() {
    return __awaiter(this, void 0, void 0, function () {
        var promesas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // no lo vamos a ejecutar
                    console.log('Estoy en 2');
                    promesas = [];
                    promesas.push(carga_pagina("m_estructura/ordinario/m_estructura_ordinario.html").then(function (contenido) {
                        // Aquí puedes hacer algo con el contenido si es necesario
                        // Por ejemplo, asignarlo a un elemento específico
                        $("#tab_o").html(contenido);
                        arreglaCarga("o");
                        pon_pref("lho_tope", 500);
                        pon_pref("lho_ultimo", 500);
                        pon_pref("lho500", $("#tab_o").html());
                        $("#tab_1").css("display", "block");
                        $("ul.pestanas").addClass("tabnav_o");
                        $("#bot_adelante").css("visibility", "hidden");
                        $("#bot_atras").css("visibility", "hidden");
                        // Expande as seções automaticamente após carregar o ordinário
                        if (mipreferencia["ordinarionormal"] == 0) {
                            setTimeout(function() { cargado2(); }, 50);
                        }
                    }));
                    return [4 /*yield*/, Promise.all(promesas)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadedAsync() {
    console.log('Estoy en 3');
    return new Promise(function (resolve) {
        console.log('Estoy en 4');
        var espera = 1;
        toggle_pestanas(0);

        // No Kindle, usa scroll nativo em vez de iScroll
        if (window.esKindle) {
            console.log('Kindle: usando scroll nativo, iScroll desativado');
            // Mock do myScroll para compatibilidade com scroll nativo no Kindle
            myScroll = {
                y: 0,
                refresh: function() {
                    var contenedor = document.getElementById('contenedor');
                    if (contenedor) this.y = -contenedor.scrollTop;
                },
                scrollTo: function(x, y, time, relative) {
                    var contenedor = document.getElementById('contenedor');
                    if (!contenedor) return;

                    var newScrollTop;
                    if (relative) {
                        // iScroll: y positivo = scroll para cima, y negativo = scroll para baixo
                        // scrollTop: aumenta para baixo
                        newScrollTop = contenedor.scrollTop - y;
                    } else {
                        // Posição absoluta (y é negativo no iScroll)
                        newScrollTop = Math.abs(y);
                    }

                    // Garante que não seja negativo
                    newScrollTop = Math.max(0, newScrollTop);

                    if (time && time > 0) {
                        // Scroll suave
                        contenedor.scrollTo({ top: newScrollTop, behavior: 'smooth' });
                    } else {
                        contenedor.scrollTop = newScrollTop;
                    }
                    this.y = -newScrollTop;
                },
                scrollToElement: function(el, time) {
                    if (el) el.scrollIntoView({ behavior: time ? 'smooth' : 'auto' });
                },
                scrollToPage: function() {
                    var contenedor = document.getElementById('contenedor');
                    if (contenedor) {
                        contenedor.scrollTop = 0;
                        this.y = 0;
                    }
                },
                enable: function() {},
                disable: function() {}
            };
        } else {
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
            onBeforeScrollStart: function (e) {
                var target = e.target;
                while (target.nodeType != 1)
                    target = target.parentNode;
                if (target.tagName != "SELECT" &&
                    target.tagName != "INPUT" &&
                    target.tagName != "TEXTAREA" &&
                    target.tagName != "OPTION")
                    e.preventDefault();
            },
            onBeforeScrollMove: function (e) {
                myScroll.refresh();
                if (parseInt(dime_pref('pasarpagina_defecto', 1)) === 1) {
                    //desactivé esto a ver si se arregla lo de los samsung.Luego como preferncia
                    var headerBottom_1 = document.getElementById("cabecera").getBoundingClientRect().bottom;
                    var pieTop_1 = document.getElementById("piedepantalla").getBoundingClientRect().top;
                    var paginaAltura_1 = pieTop_1 - headerBottom_1;
                    if (this.distX > 40 && this.absDistX > this.absDistY) {
                        myScroll.disable();
                        myScroll.scrollTo(0, -(paginaAltura_1 - 10), 300, true);
                        this.distX = 0;
                        this.moved = true;
                        myScroll.enable();
                    }
                    else if (this.distX < -40 && this.absDistX > this.absDistY) {
                        myScroll.disable();
                        myScroll.scrollTo(0, (paginaAltura_1 - 10), 300, true);
                        this.distX = 0;
                        this.moved = true;
                        myScroll.enable();
                    }
                }
            },
            onScrollStart: function () {
                $("#menu_diamante, #menu_grabar, #menu_ira").css("display", "none");
                return false;
            },
            onScrollEnd: function () {
                miposicion = myScroll.y;
                pon_pref("scroll_" + mipestana + puntero, miposicion);
                return false;
            },
        });
        } // fecha o else do esKindle
        console.log('Estoy en 6');
        document.addEventListener("deviceready", onDeviceReady2, false);
        var headerBottom = document.getElementById("cabecera").getBoundingClientRect().bottom;
        var pieTop = document.getElementById("piedepantalla").getBoundingClientRect().top;
        var paginaAltura = pieTop - headerBottom;
        if (avancepantalla == 100) {
            avancepantalla = (avancepantalla * paginaAltura) / 100 - 10;
        }
        else
            avancepantalla = (avancepantalla * paginaAltura) / 100;
        if (mipreferencia["fondo"] == 1) {
            $(" .boton ").each(function () {
                $(this).removeClass("boton").addClass("botonBueno");
            });
        }
        setTimeout(function () {
            esperame = false;
            console.log('Estoy en 7');
            myScroll.refresh();
            esperame = false;
            myScroll.refresh();
            if (typeof parcial2 === "undefined") {
                myScroll.scrollTo(0, -miposicion, 0, true);
            }
            else {
                //esto solo ocurre en el ordinario
                if (parcial2 == "rito_comunion") {
                    muestraono("botonmas5", false);
                    muestraono("liturgia_eucaristica_3", true);
                    myScroll.scrollToElement(document.getElementById("rito_comunion"), 0);
                }
                else if (parcial2 == "lit_euchar") {
                    muestraono("botonmas3", false);
                    muestraono("liturgia_eucaristica_1", true);
                    myScroll.scrollToElement(document.getElementById("lit_euchar"), 0);
                }
                else
                    myScroll.scrollTo(0, -miposicion, 0, true);
            }
            $("#mis_intenciones").html(dime_pref("misintenciones", "---"));
            setTimeout(function () {
                console.log('Estoy en 8');
                arregla_top();
                arregla_bottom();
            }, 100);
            // ✅ RESOLVEMOS CUANDO TERMINA
            resolve();
        }, espera);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    esperarCordova()
        .then(function () {
        console.log("Estoy en 1-1");
        return new Promise(function (resolve) {
            if (document.readyState === "complete") {
                console.log("load ya había ocurrido");
                resolve();
            }
            else {
                window.addEventListener("load", function () {
                    console.log("esperé load");
                    setTimeout(resolve, ajuste * 20);
                }, { once: true });
            }
        });
    })
        .then(function () {
        console.log("Estoy en 1-3");
        $("#tab_o").css("display", "block");
        $("ul.pestanas").addClass("tabnav_o");
    })
        .then(function () {
        console.log("Estoy en 1-3b");
        return loadedAsync();
    })
        .then(function () {
        console.log("Estoy en 1-2");
        return inicia_ord();
    })
        .then(function () {
        console.log("Estoy en 1-4");
        if (esIOS)
            $("#contenedor").css("bottom", "-1.9em");
        if (mipestana == "o" && mipreferencia["ordinarionormal"] == 0) {
            console.log('Estoy en 5');
            cargado2();
            espera = 300;
        }
    });
});
function loaded() {
    var espera = 1;
    toggle_pestanas(0);
    if (mipestana == "o" && mipreferencia["ordinarionormal"] == 0) {
        cargado2();
        espera = 300;
    }
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
        onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1)
                target = target.parentNode;
            if (target.tagName != "SELECT" &&
                target.tagName != "INPUT" &&
                target.tagName != "TEXTAREA" &&
                target.tagName != "OPTION")
                e.preventDefault();
        },
        onBeforeScrollMove: function (e) {
            if (dime_pref('pasarpagina_defecto', 1)) {
                //desactivé esto a ver si se arregla lo de los samsung.Luego como preferncia
                var headerBottom_2 = document.getElementById("cabecera").getBoundingClientRect().bottom;
                var pieTop_2 = document.getElementById("piedepantalla").getBoundingClientRect().top;
                var paginaAltura_2 = pieTop_2 - headerBottom_2;
                if (this.distX > 40 && this.absDistX > this.absDistY) {
                    myScroll.disable();
                    myScroll.scrollTo(0, -(paginaAltura_2 - 10), 300, true);
                    this.distX = 0;
                    this.moved = true;
                    myScroll.enable();
                }
                else if (this.distX < -40 && this.absDistX > this.absDistY) {
                    myScroll.disable();
                    myScroll.scrollTo(0, (paginaAltura_2 - 10), 300, true);
                    this.distX = 0;
                    this.moved = true;
                    myScroll.enable();
                }
            }
        },
        onScrollStart: function () {
            $("#menu_diamante, #menu_grabar, #menu_ira").css("display", "none");
            return false;
        },
        onScrollEnd: function () {
            miposicion = myScroll.y;
            pon_pref("scroll_" + mipestana + puntero, miposicion);
            return false;
        },
    });
    //     }  esto es lo de formato_misal
    document.addEventListener("deviceready", onDeviceReady2, false);
    console.log('Estoy en 9');
    var headerBottom = document.getElementById("cabecera").getBoundingClientRect().bottom;
    var pieTop = document.getElementById("piedepantalla").getBoundingClientRect().top;
    var paginaAltura = pieTop - headerBottom;
    if (avancepantalla == 100) {
        avancepantalla = (avancepantalla * paginaAltura) / 100 - 10;
    }
    else
        avancepantalla = (avancepantalla * paginaAltura) / 100;
    if (mipreferencia["fondo"] == 1) {
        $(" .boton ").each(function () {
            $(this).removeClass("boton").addClass("botonBueno");
        });
    }
    setTimeout(function () {
        esperame = false;
        myScroll.refresh();
        if (typeof parcial2 === "undefined") {
            myScroll.scrollTo(0, -miposicion, 0, true);
        }
        else {
            //esto solo ocurre en el ordinario
            if (parcial2 == "rito_comunion") {
                muestraono("botonmas5", false);
                muestraono("liturgia_eucaristica_3", true);
                myScroll.scrollToElement(document.getElementById("rito_comunion"), 0);
            }
            else if (parcial2 == "lit_euchar") {
                muestraono("botonmas3", false);
                muestraono("liturgia_eucaristica_1", true);
                myScroll.scrollToElement(document.getElementById("lit_euchar"), 0);
            }
            else
                myScroll.scrollTo(0, -miposicion, 0, true);
        }
    }, espera);
    /*
  window.onbeforeunload = function (e) {      $('#scroller').css('opacity','.3'); saveUltimo(mipestana); }
  */
    //alert(puntero)
    $("#mis_intenciones").html(dime_pref("misintenciones", "---"));
    setTimeout(function () {
        arregla_top();
        arregla_bottom();
    }, 100);
}
function reemplazarComentarios() {
    // Diccionario de traducciones por idioma y palabra clave
    var traducciones = {
        "cast": { "BREVE": "más breve", "LARGO": "más largo", "O_BIEN": "o bien", "SALMO": "Salmo", "LECT_1": "Primera Lectura", "LECT_2": "Segunda lectura", "ALELUYA": "Aleluya", "EVANGELIO": "Evangelio", "LECCIONARIO": "Leccionario", "INDICE": "ÍNDICE" },
        "engl": { "BREVE": "shorter", "LARGO": "longer", "O_BIEN": "or else", "SALMO": "Psalm", "LECT_1": "First Reading", "LECT_2": "Second Reading", "ALELUYA": "", "EVANGELIO": "Gospel", "LECCIONARIO": "Readings", "INDICE": "INDEX" },
        "ital": { "BREVE": "più breve", "LARGO": "più lungo", "O_BIEN": "oppure", "SALMO": "Salmo", "LECT_1": "Prima Lettura", "LECT_2": "Seconda Lettura", "ALELUYA": "Alleluia", "EVANGELIO": "Vangelo", "LECCIONARIO": "Lezionario", "INDICE": "INDICE" },
        "germ": { "BREVE": "kurzfassung", "LARGO": "länger", "O_BIEN": "oder", "SALMO": "Antwortpsalm", "LECT_1": "Erste Lesung", "LECT_2": "Zweite Lesung", "ALELUYA": "Ruf vor dem Evangelium", "EVANGELIO": "Evangelium", "LECCIONARIO": "Lesungen", "INDICE": "VERZEICHNIS" },
        "port": { "BREVE": "mais breve", "LARGO": "mais longo", "O_BIEN": "ou então", "SALMO": "Salmo", "LECT_1": "Primeira Leitura", "LECT_2": "Segunda Leitura", "ALELUYA": "Aleluia", "EVANGELIO": "Evangelho", "LECCIONARIO": "Lecionário", "INDICE": "INDEX" },
        "fran": { "BREVE": "plus court", "LARGO": "plus long", "O_BIEN": "ou bien", "SALMO": "Psaume", "LECT_1": "Première lecture", "LECT_2": "Deuxième lecture", "ALELUYA": "Alléluia", "EVANGELIO": "Évangile", "LECCIONARIO": "Lectionnaire", "INDICE": "INDEX" },
        "latin": { "BREVE": "brevior", "LARGO": "longior", "O_BIEN": "vel", "SALMO": "Psalmus", "LECT_1": "Lectio I", "LECT_2": "Lectio II", "ALELUYA": "Alleluia", "EVANGELIO": "Evangelium", "LECCIONARIO": "Lectionarium", "INDICE": "INDEX" }
    };
    $("*").contents().each(function () {
        var _a;
        if (this.nodeType === 8) { // Verificar si es un comentario
            var textoComentario = this.nodeValue.trim(); // Obtener el texto dentro del comentario
            // Verificar si el comentario está en la lista de palabras clave
            if (["BREVE", "LARGO", "O_BIEN", "SALMO", "LECT_1", "LECT_2", "ALELUYA", "EVANGELIO", "LECCIONARIO"].includes(textoComentario)) {
                var contenedor = $(this).closest(".cast, .engl, .ital, .germ, .port, .fran, .latin"); // Buscar el idioma más cercano
                var idioma = contenedor.length ? contenedor.attr("class").split(" ")[0] : mimisal_1; // Determinar el idioma
                var textoReemplazo = ((_a = traducciones[idioma]) === null || _a === void 0 ? void 0 : _a[textoComentario]) || textoComentario; // Buscar traducción
                $(this).replaceWith(textoReemplazo); // Reemplazar el comentario con la traducción
            }
        }
    });
}
function incluye_pe_contenido(nombre) {
    if ($("#x_tmp_titulo #soy_misa_jueves_sto").length == 0 ||
        nombre != "m_estructura/plegarias_euc/m_estructura_plegaria_euc_1.html") {
        a_incluir = nombre + "#contenido_pe";
    }
    else
        a_incluir =
            "m_estructura/tiempos/m_estructura_tiempos_semanasta3.html#pleg_euc_juev_sto";
    carga_pagina(a_incluir).then(function (contenido) {
        $("#x_pe_pleg").html(contenido);
        $("#x_pe_pleg").removeClass("novisibleb").addClass("visibleb");
        $("#x_ord_pleg").removeClass("visibleb").addClass("novisibleb");
        $("#bot_pleg .bot_pe").addClass("noactivo").removeClass("activo");
        $("#bot_pleg .bot_ord").removeClass("noactivo").addClass("activo");
        $("#x_ord_pleg").removeClass("visibleb").addClass("novisibleb");
        $("#x_pe_pleg").removeClass("novisibleb").addClass("visibleb");
        $("#bot_pleg").parent().removeClass("novisibleb").addClass("visibleb");
        if (mipreferencia["fondo"] == 1) {
            $(" .boton ").each(function () {
                $(this).removeClass("boton").addClass("botonBueno");
            });
        }
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
        myScroll.refresh();
        pon_pref("x_pe_pleg", $("#x_pe_pleg").html());
        if ($("#x_tmp_titulo #soy_misa_jueves_sto").length == 0)
            $(".solo_misa_jueves_sto").remove();
        $(".alternativa").removeClass("visibleb").addClass("novisibleb");
        if ($("#x_tmp_titulo #soy_misa_jueves_sto").length == 0)
            $(".solo_misa_jueves_sto").remove();
        if ($("#x_tmp_titulo .soy_pentecostes").length > 0)
            $(".pentecostes").removeClass("novisibleb").addClass("visibleb");
        if ($("#x_tmp_titulo .soy_ascension").length > 0)
            $(".ascension").removeClass("novisibleb").addClass("visibleb");
        if ($("#x_tmp_titulo .soy_epifania").length > 0)
            $(".epifania").removeClass("novisibleb").addClass("visibleb");
        if ($("#x_tmp_titulo .soy_octava_pascua").length > 0)
            $(".octava_pascua").removeClass("novisibleb").addClass("visibleb");
        if ($(".x_titulo .soy_octava_navidad").length > 0)
            $(".octava_navidad").removeClass("novisibleb").addClass("visibleb");
    });
}
function incluye_pf_contenido(nombre) {
    carga_pagina(nombre + "#contenido_pf").then(function (contenido) {
        $("#x_pe_prefacio").html(contenido);
        $(".txt_prefacio").removeClass("visibleb").addClass("novisibleb");
        $(".txt_prefacio.txt_pe").removeClass("novisibleb").addClass("visibleb");
        $("#bot_prefacio .noactivo").removeClass("noactivo").addClass("activo");
        $("#bot_prefacio .bot_pe").removeClass("activo").addClass("noactivo");
        $("#bot_prefacio").parent().removeClass("novisibleb").addClass("visibleb");
        myScroll.refresh();
        pon_pref("x_pe_prefacio", $("#x_pe_prefacio").html());
        if ($("#x_tmp_titulo #soy_misa_jueves_sto").length == 0)
            $(".solo_misa_jueves_sto").remove();
        if ($("#x_tmp_titulo .soy_octava_pascua").length > 0)
            $(".octava_pascua").removeClass("novisibleb").addClass("visibleb");
    });
    carga_pagina(nombre + "#contenido_pe").then(function (contenido) {
        $("#x_pe_pleg").html(contenido);
        $("#bot_pleg .bot_pe").addClass("noactivo").removeClass("activo");
        $("#bot_pleg .bot_ord").removeClass("noactivo").addClass("activo");
        $("#x_ord_pleg").removeClass("visibleb").addClass("novisibleb");
        $("#x_pe_pleg").removeClass("novisibleb").addClass("visibleb");
        $("#bot_pleg").parent().removeClass("novisibleb").addClass("visibleb");
        if (mipreferencia["fondo"] == 1) {
            $(" .boton ").each(function () {
                $(this).removeClass("boton").addClass("botonBueno");
            });
        }
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
        myScroll.refresh();
        pon_pref("x_pe_pleg", $("#x_pe_pleg").html());
        $(".alternativa").removeClass("visibleb").addClass("novisibleb");
        if ($("#x_tmp_titulo #soy_misa_jueves_sto").length == 0)
            $(".solo_misa_jueves_sto").remove();
        if ($("#x_tmp_titulo .soy_pentecostes").length > 0)
            $(".pentecostes").removeClass("novisibleb").addClass("visibleb");
        if ($("#x_tmp_titulo .soy_ascension").length > 0)
            $(".ascension").removeClass("novisibleb").addClass("visibleb");
        if ($("#x_tmp_titulo .soy_epifania").length > 0)
            $(".epifania").removeClass("novisibleb").addClass("visibleb");
        if ($("#x_tmp_titulo .soy_octava_pascua").length > 0)
            $(".octava_pascua").removeClass("novisibleb").addClass("visibleb");
        if ($(".x_titulo .soy_octava_navidad").length > 0)
            $(".octava_navidad").removeClass("novisibleb").addClass("visibleb");
    });
}
function incluye_pf(nombre) {
    carga_pagina(nombre).then(function (contenido) {
        $("#x_pf_prefacio").html(contenido);
        myScroll.refresh();
    });
    $(".txt_prefacio").removeClass("visibleb").addClass("novisibleb");
    $(".txt_prefacio.txt_pf").removeClass("novisibleb").addClass("visibleb");
    $("#bot_prefacio .noactivo").removeClass("noactivo").addClass("activo");
    $("#bot_prefacio .bot_pf").removeClass("activo").addClass("noactivo");
    ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    myScroll.refresh();
    pon_pref("x_pf_prefacio", $("#x_pf_prefacio").html());
    if ($("#x_tmp_titulo .soy_octava_pascua").length > 0)
        $(".octava_pascua").addClass("visibleb");
}
function muestra_or_fieles(oracion) {
    carga_pagina("m_estructura/ordinario/m_estructura_oracion_fieles.html#" + oracion).then(function (contenido) {
        // Aquí puedes hacer algo con el contenido si es necesario
        $("#texto_or_fieles").html(contenido);
        muestraono("indice_or_fieles", false);
        muestraono("texto_or_fieles", true);
        $("#tab_or_fieles_txt").removeClass("activo").addClass("noactivo");
        $("#tab_or_fieles_ind").removeClass("noactivo").addClass("activo");
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
        myScroll.refresh();
    });
}
function muestra_or_pueblo() {
    carga_pagina("m_estructura/ordinario/m_estructura_oraciones_pueblo.html#interior").then(function (contenido) {
        // Aquí puedes hacer algo con el contenido si es necesario
        $("#x_ord_or_pueblo").html(contenido);
        var coletilla = "";
        if (mipreferencia["fondo"] == 1)
            coletilla = "Bueno";
        $("#bot_or_pueblo_ord").trigger("touchend").trigger("click");
        muestraono("x_ord_or_pueblo", true);
        $("#x_ord_or_pueblo").prepend("<div class=solodos><span class=boton" +
            coletilla +
            " onclick='setTimeout( function() {muestraono(\"x_ord_or_pueblo\",false); $(this).remove; }, 10);'>X</span></div>");
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
        myScroll.refresh();
    });
}
function muestra_bendiciones() {
    carga_pagina("m_estructura/ordinario/m_estructura_bendiciones.html").then(function (contenido) {
        $("#x_ord_or_pueblo").html(contenido);
        var coletilla = "";
        if (mipreferencia["fondo"] == 1)
            coletilla = "Bueno";
        $("#bot_or_pueblo_ord").trigger("touchend").trigger("click");
        muestraono("x_ord_or_pueblo", true);
        $("#x_ord_or_pueblo").prepend("<div class=solodos><span class=boton" +
            coletilla +
            " onclick='setTimeout( function() {muestraono(\"x_ord_or_pueblo\",false); $(this).remove; }, 10);'>X</span></div>");
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
        myScroll.refresh();
    });
}
function miluna(year, idioma) {
    // esta funcion se utilizaría para las Kalendas, en el pregón de Navidad.
    month = 12;
    day = 25;
    var c = (e = jd = b = 0);
    if (month < 3) {
        year--;
        month += 12;
    }
    ++month;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09; //jd is total days elapsed
    jd /= 29.5305882; //divide by the moon cycle
    b = parseInt(jd); //int(jd) -> b, take integer part of jd
    jd -= b; //subtract integer part to leave fractional part of original jd
    b = Math.floor(jd * 29.5305882);
    if (b == 0)
        b = 30;
    if (idioma == "cast") {
        var ordinal = [
            "primera",
            "segunda",
            "tercera",
            "cuarta",
            "quinta",
            "sexta",
            "séptima",
            "octava",
            "novena",
            "décima",
            "decimoprimera",
            "decimosegunda",
            "decimotercera",
            "decimocuarta",
            "decimoquinta",
            "decimosexta",
            "decimoséptima",
            "decimoctava",
            "decimonovena",
            "vigésima",
            "vigesimoprimera",
            "vigesimosegunda",
            "vigesimotercera",
            "vigesimocuarta",
            "vigesimoquinta",
            "vigesimosexta",
            "vigesimoséptima",
            "vigesimoctava",
            "vigesimonovena",
            "trigésima",
        ];
    }
    else if (idioma == "latin") {
        var ordinal = [
            "prima",
            "secunda",
            "tertia",
            "quarta",
            "quinta",
            "sexta",
            "septima",
            "octava",
            "nona",
            "decima",
            "undecima",
            "duodecima",
            "tertia decima",
            "quarta decima",
            "quinta decima",
            "sexta decima",
            "septima decima",
            "octava decima",
            "nona decima",
            "vicesima",
            "vicesima prima",
            "vicesima secunda",
            "vicesima tertia",
            "vicesima quarta",
            "vicesima quinta",
            "vicesima sexta",
            "vicesima septima",
            "vicesima octava",
            "vicesima nona",
            "trigesima",
        ];
    }
    else if (idioma == "ital") {
        var ordinal = [
            "prima",
            "seconda",
            "terzia",
            "quarta",
            "quinta",
            "sesta",
            "settima",
            "ottava",
            "nona",
            "decima",
            "undicesima",
            "dodicesima",
            "tredicesima",
            "quattordicesima",
            "quindicesima",
            "sedicesima",
            "diciassettesima",
            "diciottesima",
            "diciannovesima",
            "ventesima",
            "ventunesimo",
            "ventiduesima",
            "ventritreesima",
            "ventiquattresima",
            "venticinquesima",
            "ventiseiesima",
            "ventisettesima",
            "ventottesima",
            "ventinovesima",
            "trentesima",
        ];
    }
    return ordinal[b - 1];
}
function cambia_pref_a(nuevopref) {
    carga_pagina("m_estructura/prefacios/m_estructura_prefacios.html#" + nuevopref).then(function (contenido) {
        $("#tab_pf").html(contenido);
    });
    arreglaCarga(mipestana);
    //$('#'+nuevopref+ ' div.meter_aqui').html($('#introduccion').html())
}
function activa_bot(elemento, pestana3, parte) {
    if (parte != "global") {
        $(elemento).siblings(".noactivo").removeClass("noactivo").addClass("activo");
        $(elemento).removeClass("activo").addClass("noactivo");
        $(".txt_" + parte)
            .removeClass("visibleb")
            .addClass("novisibleb");
        $(".txt_" + pestana3 + ".txt_" + parte)
            .removeClass("novisibleb")
            .addClass("visibleb");
    }
    else {
        $(".txt_ord:not(.txt_pleg , .txt_prefacio), .txt_tmp, .txt_snt, .txt_com")
            .removeClass("visibleb")
            .addClass("novisibleb");
        $(".txt_" + pestana3 + ".txt_titulo")
            .removeClass("novisibleb")
            .addClass("visibleb");
        $(".bot_ord.noactivo, .bot_tmp.noactivo, .bot_snt.noactivo, .bot_com.noactivo, .bot_pf.noactivo, #bot_prefacio .bot_pe.noactivo , #bot_pleg .bot_pe.noactivo")
            .removeClass("noactivo")
            .addClass("activo");
        $(elemento).removeClass("activo").addClass("noactivo");
        $(".bot_" + pestana3).each(function () {
            miparte = $(this).closest(".div-botones").attr("id").substr(4);
            if ($(this).hasClass("noactivo")) {
                $(this).removeClass("activo").addClass("noactivo");
                $(".txt_" + pestana3 + ".txt_" + miparte)
                    .removeClass("novisibleb")
                    .addClass("visibleb");
            }
            else if (pestana3 == "snt" &&
                $(this).siblings(".bot_com").hasClass("activo")) {
                $(this).siblings(".bot_com").removeClass("activo").addClass("noactivo");
                $(".txt_com.txt_" + miparte)
                    .removeClass("novisibleb")
                    .addClass("visibleb");
            }
        });
        if (pestana3 == "ord") {
            $(".txt_tmp_lct, .txt_snt_lct")
                .removeClass("visibleb")
                .addClass("novisibleb");
            $(".bot_tmp_lct.noactivo, .bot_snt_lct.noactivo")
                .removeClass("noactivo")
                .addClass("activo");
        }
        if (pestana3 == "tmp" || (pestana3 == "snt" && !lect_sant_prior)) {
            $(".txt_tmp_lct").removeClass("novisibleb").addClass("visibleb");
            $(".bot_snt_lct.noactivo").removeClass("noactivo").addClass("activo");
            $(".bot_tmp_lct.activo").removeClass("activo").addClass("noactivo");
            $(".txt_snt_lct").removeClass("visibleb").addClass("novisibleb");
        }
        if (pestana3 == "snt" && lect_sant_prior) {
            $(".txt_snt_lct").removeClass("novisibleb").addClass("visibleb");
            $(".bot_tmp_lct.noactivo").removeClass("noactivo").addClass("activo");
            $(".bot_snt_lct.activo").removeClass("activo").addClass("noactivo");
            $(".txt_tmp_lct").removeClass("visibleb").addClass("novisibleb");
        }
    }
    if (!esperame)
        myScroll.refresh();
}
function arreglaLectura(parte8) {
    var coletilla = "";
    if (mipreferencia["fondo"] == 1)
        coletilla = "Bueno";
    if ($("input.x_tmp_precedencia").length) {
        preced_tmp = Number($("input.x_tmp_precedencia").val());
        if (preced_tmp == 66)
            if (midia == 0) {
                preced_tmp = 6;
            }
            else
                preced_tmp = 13;
    }
    if ($("input.x_snt_precedencia").length) {
        preced_snt = Number($("input.x_snt_precedencia").val());
    }
    else
        preced_snt = 88;
    var pestanaspos = ["tmp_lct", "snt_lct", "otr_lct"];
    var index0;
    var encontre_alguno = false;
    for (index0 = 0; index0 < pestanaspos.length; ++index0) {
        pestana8 = pestanaspos[index0];
        $("#bot_" + parte8 + " .bot_" + pestana8)
            .removeClass("noactivo")
            .removeClass("activo");
        valor = dime_pref("x_" + pestana8 + "_" + parte8, "nada");
        //console.log('x_'+pestana8+'_'+parte8+'.....'+valor+'--')
        //if (pestana8+'_'+parte8=='snt_lct_prim_lect') alert('x_'+pestana8+'_'+parte8+'.....'+valor+'--')
        if (valor != "nada" && valor.length > 1) {
            encontre_alguno = true;
            $("#x_" + pestana8 + "_" + parte8)
                .html(valor)
                .removeClass("visibleb")
                .addClass("novisibleb");
            $("#bot_" + parte8)
                .parent()
                .removeClass("novisibleb")
                .addClass("visibleb");
            $(".cursores , .respuesta").remove();
            $("#bot_" + parte8 + " .bot_" + pestana8).addClass("activo");
            if (parte8 == "evangelio") {
                $("#dialogo_evang")
                    .clone()
                    .removeAttr("id")
                    .prependTo("#x_" + pestana8 + "_" + parte8);
                $('.dialogo_evang:not("#dialogo_evang")')
                    .removeClass("novisibleb")
                    .addClass("visibleb");
            }
            $("#x_" + pestana8 + "_" + parte8 + " a").each(function () {
                midirec = "m_estructura/lecturas/m_estructura_";
                sitio = parseURL(this.href);
                //alert(this.href)
                if (this.href.indexOf("parcial=") > 0) {
                    cadena = extraerRutaDesdeMisalV2(sitio.path) + "#parcial_" + sitio.params["parcial"];
                    //alert(cadena)
                }
                else
                    cadena = extraerRutaDesdeMisalV2(sitio.path) + "#" + sitio.hash;
                if (!this.href.startsWith('javascript')) {
                    this.href =
                        "javascript: carga_lectura('" +
                            cadena +
                            "','x_" +
                            parte8 +
                            "','x_res_lct_" +
                            parte8 +
                            "');";
                }
            });
            if (pestana8 == "otr_lct")
                $("#x_" + pestana8 + "_" + parte8).prepend("<div class=solodos><span class=boton" +
                    coletilla +
                    " ontouchend='setTimeout( function() { pon_pref(\"x_" +
                    pestana8 +
                    "_" +
                    parte8 +
                    '","nada"); arreglaLectura("' +
                    parte8 +
                    "\");  }, 10);'>X</span></div>");
        }
        else {
            $("#x_" + pestana8 + "_" + parte8)
                .html(valor)
                .removeClass("visibleb")
                .addClass("novisibleb");
        }
    }
    if (!encontre_alguno)
        $(".txt_ord.txt_" + parte8)
            .removeClass("txt_ord")
            .removeClass("novisibleb")
            .addClass("visibleb");
    if (mipreferencia["fondo"] == 1) {
        $(" .boton ").each(function () {
            $(this).removeClass("boton").addClass("botonBueno");
        });
    }
    if (preced_snt < preced_tmp &&
        (preced_snt <= 8 || $("span.lect_obl").length != 0) &&
        $("#bot_" + parte8 + " .bot_snt_lct").hasClass("activo")) {
        $("#bot_" + parte8 + " .bot_snt_lct").trigger("touchend");
    }
    else if ($("#bot_" + parte8 + " .bot_tmp_lct").hasClass("activo")) {
        $("#bot_" + parte8 + " .bot_tmp_lct").trigger("touchend");
    }
    else if ($("#bot_" + parte8 + " .bot_snt_lct").hasClass("activo")) {
        $("#bot_" + parte8 + " .bot_snt_lct").trigger("touchend");
    }
    else if ($("#bot_" + parte8 + " .bot_otr_lct").hasClass("activo")) {
        $("#bot_" + parte8 + " .bot_otr_lct").trigger("touchend");
    }
    else {
        $("#bot_" + parte8)
            .parent()
            .removeClass("visibleb")
            .addClass("novisibleb");
        $(".txt_ord.txt_" + parte8)
            .removeClass("txt_ord")
            .removeClass("novisibleb")
            .addClass("visibleb");
    }
    myScroll.refresh();
}
$.fn.outerHTML = function () {
    return jQuery("<div />").append(this.eq(0).clone()).html();
};
function extraerRutaDesdeMisalV2(ruta) {
    if (typeof ruta !== 'string')
        return '';
    var indice = ruta.indexOf('/misal_v2');
    if (indice !== -1) {
        // Saltamos "/misal_v2/" → 10 caracteres
        return ruta.slice(indice + '/misal_v2/'.length);
    }
}
function arreglaCarga(pestana) {
    var tareas = [];
    $('#icono-sticky').removeClass('visibleb').addClass('novisibleb');
    $('#bot_grabar').css('visibility', '');
    if (mipreferencia["ordinarionormal"] == 1) {
        if (pestana == "o") {
            $(".div-botones , .incrustado")
                .removeClass("visibleb")
                .addClass("novisibleb");
            $(".txt_ord , .noincrustado")
                .removeClass("novisibleb")
                .addClass("visibleb");
        }
    }
    else {
        switch (pestana) {
            case "o":
                if (dime_pref('ver_bot_int_defecto', 1) == 0)
                    $('#icono-sticky').remove();
                $('#icono-sticky').removeClass('novisibleb').addClass('visibleb');
                $('#bot_grabar').css('visibility', 'hidden');
                esperame = true;
                var ab = 0;
                var pestanaspos = ["tmp", "snt", "com", "pf", "pe"];
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
                ];
                // quité gloria y credo
                // var partespos= ['titulo','ant_ent','colecta','antes_or_fieles','or_ofrend','ant_com','post_com','or_pueblo','prefacio','pleg']
                var index;
                for (index = 0; index < partespos.length; ++index) {
                    var encontre_alguno = false;
                    var index0;
                    for (index0 = 0; index0 < pestanaspos.length; ++index0) {
                        pestana8 = pestanaspos[index0];
                        parte8 = partespos[index];
                        valor = dime_pref("x_" + pestana8 + "_" + parte8, "nada");
                        if (parte8 != "titulo")
                            valor = valor.replace("h2", "h4");
                        $("#x_" + pestana8 + "_" + parte8)
                            .html(valor)
                            .removeClass("visibleb")
                            .addClass("novisibleb");
                        if ($("#x_" + pestana8 + "_" + parte8).length)
                            if (valor != "nada" &&
                                valor.length > 1 &&
                                $("#x_" + pestana8 + "_" + parte8).html().length > 90) {
                                encontre_alguno = true;
                                $("#x_" + pestana8 + "_" + parte8 + " .cursores").remove();
                                $("#bot_global .bot_" + pestana8).addClass("activo");
                                $("#bot_" + parte8)
                                    .parent()
                                    .removeClass("novisibleb")
                                    .addClass("visibleb");
                                $("#bot_" + parte8 + " .bot_" + pestana8).addClass("activo");
                                if (parte8 == "prefacio") {
                                    $("#x_ord_prefacio")
                                        .removeClass("visibleb")
                                        .addClass("novisibleb");
                                    $("#x_" + pestana8 + "_prefacio a").each(function () {
                                        midirec = "m_estructura/prefacios/";
                                        sitio = parseURL(this.href);
                                        cadena = midirec + sitio.file + "#" + sitio.hash;
                                        if (!this.href.startsWith('javascript')) {
                                            this.href = "javascript: carga_prefacio('" + cadena + "');";
                                        }
                                    });
                                }
                                if (parte8 == "or_pueblo")
                                    $("#x_" + pestana8 + "_or_pueblo a").each(function () {
                                        midirec = "m_estructura/ordinario/m_estructura_";
                                        sitio2 = parseURL(this.href);
                                        cadena =
                                            midirec + sitio2.file + "#bend" + sitio2.params["parcial"];
                                        if (!this.href.startsWith('javascript')) {
                                            this.href =
                                                "javascript: carga_bendicion('" +
                                                    cadena +
                                                    "','#x_" +
                                                    pestana8 +
                                                    "_or_pueblo','#bend" +
                                                    sitio2.params["parcial"] +
                                                    "');";
                                        }
                                    });
                            }
                    }
                }
                //cambio enlaces-pensando en los comunes
                $("#x_snt_titulo a").each(function () {
                    sitio = parseURL(this.href);
                    //alert(this.href)
                    if (this.href.indexOf("parcial=") > 0) {
                        cadena = extraerRutaDesdeMisalV2(sitio.path) + "#parcial_" + sitio.params["parcial"];
                        //alert(cadena)
                    }
                    else
                        cadena = extraerRutaDesdeMisalV2(sitio.path) + "#" + sitio.hash;
                    if (!this.href.startsWith('javascript')) {
                        this.href =
                            "javascript: ejecutarCargaYRecarga('" +
                                cadena +
                                "','x_" +
                                parte8 +
                                "','x_res_lct_" +
                                parte8 +
                                "'); ";
                    }
                });
                // hasta aquí
                var coletilla = "";
                if (mipreferencia["fondo"] == 1)
                    coletilla = "Bueno";
                var pestanaspos = ["tmp_lct", "snt_lct", "otr_lct"];
                var partespos = [
                    "prim_lect",
                    "salmo",
                    "seg_lect",
                    "aleluya",
                    "evangelio",
                ];
                var index;
                for (index = 0; index < partespos.length; ++index) {
                    parte8 = partespos[index];
                    var index0;
                    var encontre_alguno = false;
                    for (index0 = 0; index0 < pestanaspos.length; ++index0) {
                        pestana8 = pestanaspos[index0];
                        valor = dime_pref("x_" + pestana8 + "_" + parte8, "nada");
                        //console.log('x_'+pestana8+'_'+parte8+'.....'+valor+'--')
                        //if (pestana8+'_'+parte8=='snt_lct_prim_lect') alert('x_'+pestana8+'_'+parte8+'.....'+valor+'--')
                        if (valor == "nada") {
                            $("#x_" + pestana8 + "_" + parte8).html("");
                        }
                        else
                            $("#x_" + pestana8 + "_" + parte8).html(valor);
                        $("#x_" + pestana8 + "_" + parte8)
                            .removeClass("visibleb")
                            .addClass("novisibleb");
                        if ($("#x_" + pestana8 + "_" + parte8).length)
                            if (valor != "nada" &&
                                valor.length > 0 &&
                                $("#x_" + pestana8 + "_" + parte8).html().length > 90) {
                                encontre_alguno = true;
                                if (parte8 == "evangelio") {
                                    $("#dialogo_evang")
                                        .clone()
                                        .removeAttr("id")
                                        .prependTo("#x_" + pestana8 + "_" + parte8);
                                    $('.dialogo_evang:not("#dialogo_evang")')
                                        .removeClass("novisibleb")
                                        .addClass("visibleb");
                                }
                                $("#bot_global .bot_" + pestana8).addClass("activo");
                                $("#bot_" + parte8)
                                    .parent()
                                    .removeClass("novisibleb")
                                    .addClass("visibleb");
                                $(".cursores , .respuesta").remove();
                                $("#bot_" + parte8 + " .bot_" + pestana8).addClass("activo");
                                $("#x_" + pestana8 + "_" + parte8 + " a").each(function () {
                                    midirec = "m_estructura/lecturas/m_estructura_";
                                    sitio = parseURL(this.href);
                                    //alert(this.href)
                                    if (this.href.indexOf("parcial=") > 0) {
                                        cadena = extraerRutaDesdeMisalV2(sitio.path) + "#parcial_" + sitio.params["parcial"];
                                        //alert(cadena)
                                    }
                                    else
                                        cadena = extraerRutaDesdeMisalV2(sitio.path) + "#" + sitio.hash;
                                    if (!this.href.startsWith('javascript')) {
                                        this.href =
                                            "javascript: carga_lectura('" +
                                                cadena +
                                                "','x_" +
                                                parte8 +
                                                "','x_res_lct_" +
                                                parte8 +
                                                "');";
                                    }
                                });
                                if (pestana8 == "otr_lct")
                                    $("#x_" + pestana8 + "_" + parte8).prepend("<div class=solodos><span class=boton" +
                                        coletilla +
                                        " ontouchend='setTimeout( function() { pon_pref(\"x_" +
                                        pestana8 +
                                        "_" +
                                        parte8 +
                                        '","nada"); arreglaLectura("' +
                                        parte8 +
                                        "\"); } , 10);'>X</span></div>");
                            }
                        //alert('#x_'+pestana8+'_'+parte8+':'+$('#x_'+pestana8+'_'+parte8).html())
                    }
                    if (!encontre_alguno) {
                        $(".txt_ord.txt_" + parte8)
                            .removeClass("txt_ord")
                            .removeClass("novisibleb")
                            .addClass("visibleb");
                    }
                }
                // Una vez cargado lo normal, vemos días especiales
                //Domingo de Ramos
                if ($("#x_tmp_titulo #soy_mierc_ceniza").length > 0) {
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_cuaresma.html#x_antes_or_fieles").then(function (contenido) {
                        $("#despues_homilia").html(contenido);
                        $("#acto_penitencial , #himno_gloria")
                            .removeClass("visibleb")
                            .addClass("novisibleb");
                        $(".bot_snt , .bot_com").removeClass("activo");
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                }
                if ($("#x_tmp_titulo #soy_dom_ramos").length > 0) {
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_semanasta.html#entrada_dom_ramos").then(function (contenido) {
                        $("#todo_hasta_colecta").html(contenido);
                        carga_pagina("m_estructura/ordinario/m_estructura_ordinario.html#antes_ant_ent").then(function (contenido2) {
                            $("#iniciales_ramos_1").html(contenido2);
                            ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                        });
                        carga_pagina("m_estructura/ordinario/m_estructura_ordinario.html#desp_ant_ent").then(function (contenido2) {
                            $("#iniciales_ramos_2").html(contenido2);
                            ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                        });
                        $("#entrada_ramos")
                            .addClass("texto_incluido")
                            .removeClass("novisibleb")
                            .addClass("visibleb");
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_semanasta.html#antes_pasion").then(function (contenido) {
                        $("#antes_evangelio").html(contenido);
                        $(".bot_snt , .bot_com").removeClass("activo");
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                }
                if ($("#x_tmp_titulo #soy_misa_crismal").length > 0) {
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_semanasta2.html#despues_homilia").then(function (contenido) {
                        $("#despues_homilia").html(contenido);
                        $(".bot_snt , .bot_com").removeClass("activo");
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                }
                if ($("#x_tmp_titulo #soy_misa_jueves_sto").length > 0) {
                    $("#bloque_credo_orfieles").remove();
                    $("#rub_homilia").remove();
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_semanasta3.html#despues_homilia").then(function (contenido) {
                        $("#despues_homilia").html(contenido);
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_semanasta3.html#todo_desp_or_post_com").then(function (contenido) {
                        $("#todo_desp_or_post_com").html(contenido);
                        $(".bot_snt , .bot_com").removeClass("activo");
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                }
                if ($("#x_tmp_titulo #soy_misa_viernes_sto").length > 0) {
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_semanasta4.html#todo_viernes_sto").then(function (contenido) {
                        $("#todo").html(contenido);
                        $("#lectura_isaias").html(dime_pref("x_tmp_lct_prim_lect", ""));
                        $("#lectura_hebreos").html(dime_pref("x_tmp_lct_seg_lect", ""));
                        $("#lectura_juan").html(dime_pref("x_tmp_lct_evangelio", ""));
                        $(".noincrustado").removeClass("visibleb").addClass("novisibleb");
                        $(".bot_snt , .bot_com").removeClass("activo");
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                }
                if ($("#x_tmp_titulo #soy_vigilia_pascual").length > 0) {
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_semanasta5.html#todo_hasta_ofertorio").then(function (contenido) {
                        $("#todo_hasta_ofertorio").html(contenido);
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                    tareas.push(carga_pagina("m_estructura/tiempos/m_estructura_tiempos_semanasta5.html#despedida_final").then(function (contenido) {
                        $("#despedida_final").html(contenido);
                        $("#bendic_sacd").remove();
                        $(".bot_snt , .bot_com").removeClass("activo");
                        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    }));
                }
                if ($("#x_tmp_titulo .soy_octava_pascua").length > 0) {
                    $(".octava_pascua").removeClass("novisibleb").addClass("visibleb");
                }
                else
                    $(".octava_pascua").removeClass("visibleb").addClass("novisibleb");
                if ($("#x_tmp_titulo .soy_pentecostes").length > 0) {
                    $(".pentecostes").removeClass("novisibleb").addClass("visibleb");
                }
                if ($("#luna_cast").length > 0) {
                    $("#luna_cast").html(miluna(mianno, "cast"));
                }
                if ($("#luna_latin").length > 0) {
                    $("#luna_latin").html(miluna(mianno, "latin"));
                }
                if ($("#luna_ital").length > 0) {
                    $("#luna_ital").html(miluna(mianno, "ital"));
                }
                $(".meter_aqui, .santus148")
                    .removeClass("visibleb")
                    .addClass("novisibleb");
                break;
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
                ];
                var index;
                for (index = 0; index < partespos.length; ++index) {
                    parte8 = partespos[index];
                    if ($(".x_" + parte8 + ":visible").length) {
                        pon_pref("x_tmp_" + parte8, $(".x_" + parte8 + ":visible").outerHTML());
                    }
                    else
                        pon_pref("x_tmp_" + parte8, "nada");
                    if (parte8 == "prefacio") {
                        $(".x_prefacio a").each(function () {
                            midirec = "m_estructura/prefacios/";
                            sitio = parseURL(this.href);
                            cadena = midirec + sitio.file + "#" + sitio.hash;
                            if (!this.href.startsWith('javascript')) {
                                this.href =
                                    "javascript: cambia_a_pest('pf'); vete_a('" + cadena + "');";
                            }
                        });
                    }
                    if (parte8 == "or_pueblo")
                        $(".x_or_pueblo a").each(function () {
                            midirec = "m_estructura/ordinario/m_estructura_";
                            sitio2 = parseURL(this.href);
                            cadena =
                                midirec + sitio2.file + "#bend" + sitio2.params["parcial"];
                            if (!this.href.startsWith('javascript')) {
                                this.href =
                                    "javascript: carga_bendicion('" +
                                        cadena +
                                        "','.x_or_pueblo','#bend" +
                                        sitio2.params["parcial"] +
                                        "');";
                            }
                        });
                }
                if ($("#luna_cast").length > 0) {
                    $("#luna_cast").html(miluna(mianno, "cast"));
                }
                if ($("#luna_latin").length > 0) {
                    $("#luna_latin").html(miluna(mianno, "latin"));
                }
                if ($("#luna_ital").length > 0) {
                    $("#luna_ital").html(miluna(mianno, "ital"));
                }
                ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                break;
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
                ];
                var index;
                for (index = 0; index < partespos.length; ++index) {
                    parte8 = partespos[index];
                    if ($(".x_" + parte8 + ":visible").length) {
                        pon_pref("x_snt_" + parte8, $(".x_" + parte8 + ":visible").outerHTML());
                    }
                    else
                        pon_pref("x_snt_" + parte8, "nada");
                    if (parte8 == "prefacio") {
                        $(".x_prefacio a").each(function () {
                            midirec = "m_estructura/prefacios/";
                            sitio = parseURL(this.href);
                            cadena = midirec + sitio.file + "#" + sitio.hash;
                            if (!this.href.startsWith('javascript')) {
                                this.href =
                                    "javascript: cambia_a_pest('pf'); vete_a('" + cadena + "');";
                            }
                        });
                    }
                    if (parte8 == "titulo") {
                        $(".x_titulo a").each(function () {
                            sitio = parseURL(this.href);
                            //alert(this.href)
                            if (this.href.indexOf("parcial=") > 0) {
                                cadena = sitio.path + "#parcial_" + sitio.params["parcial"];
                                //alert(cadena)
                            }
                            else
                                cadena = sitio.path + "#" + sitio.hash;
                            if (!this.href.startsWith('javascript')) {
                                this.href =
                                    "javascript: cambia_a_pest('c'); vete_a('" +
                                        cadena +
                                        "');";
                            }
                        });
                    }
                    if (parte8 == "or_pueblo")
                        $(".x_or_pueblo a").each(function () {
                            midirec = "m_estructura/ordinario/m_estructura_";
                            sitio2 = parseURL(this.href);
                            cadena =
                                midirec + sitio2.file + "#bend" + sitio2.params["parcial"];
                            if (!this.href.startsWith('javascript')) {
                                this.href =
                                    "javascript: carga_bendicion('" +
                                        cadena +
                                        "','.x_or_pueblo','#bend" +
                                        sitio2.params["parcial"] +
                                        "');";
                            }
                        });
                }
                url = window.location.pathname;
                var id_santo = $(".dia:visible").attr("id");
                var milecturasanto2 = url.replace("santos/santos_", "lecturas/lecturas_santos_") +
                    " #" +
                    id_santo;
                var partespos4 = [
                    "prim_lect",
                    "salmo",
                    "seg_lect",
                    "aleluya",
                    "evangelio",
                ];
                var $midiv = $("<div>")
                    .attr("id", "mibuffer4")
                    .removeClass("visibleb")
                    .addClass("novisibleb");
                $("#scroller").append($midiv);
                $("#mibuffer4").load(milecturasanto2, function () {
                    $("#mibuffer4 .ciclo" + miciclo)
                        .siblings()
                        .remove();
                    var index4;
                    for (index4 = 0; index4 < partespos4.length; ++index4) {
                        if ($("#mibuffer4 .x_" + partespos4[index4]).length) {
                            var midiv4 = $("#mibuffer4 .x_" + partespos4[index4]).outerHTML();
                            //
                            pon_pref("x_snt_lct_" + partespos4[index4], midiv4);
                        }
                        else
                            pon_pref("x_snt_lct_" + partespos4[index4], "nada");
                    }
                }); //load lectura de santos
                break;
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
                ];
                var index;
                for (index = 0; index < partespos.length; ++index) {
                    parte8 = partespos[index];
                    if ($(".x_" + parte8 + ":visible").length) {
                        pon_pref("x_com_" + parte8, $(".x_" + parte8 + ":visible").outerHTML());
                    }
                    else
                        pon_pref("x_com_" + parte8, "nada");
                    if (parte8 == "prefacio") {
                        $(".x_prefacio a").each(function () {
                            midirec = "m_estructura/prefacios/";
                            sitio = parseURL(this.href);
                            cadena = midirec + sitio.file + "#" + sitio.hash;
                            if (!this.href.startsWith('javascript')) {
                                this.href =
                                    "javascript: cambia_a_pest('pf'); vete_a('" + cadena + "');";
                            }
                        });
                    }
                }
                break;
            case "le":
                if (document.getElementById("ciclo" + miciclo)) {
                    document.getElementById("ciclo" + miciclo).checked = true;
                    document.getElementById("anno_" + tipoanno).checked = true;
                }
                $(".cicloA, .cicloB, .cicloC").css("display", "none");
                $(".ciclo" + miciclo).css("display", "block");
                $(".annoprimo, .annosecundo").css("display", "none");
                if (tipoanno == "impar") {
                    $(".annoprimo").css("display", "block");
                }
                else if (tipoanno == "par")
                    $(".annosecundo").css("display", "block");
                if ($(".soysanto").length || $(".soytiempo").length) {
                    if ($(".soysanto").length) {
                        pestana8 = "_snt_lct_";
                    }
                    else
                        pestana8 = "_tmp_lct_";
                    var partespos = [
                        "prim_lect",
                        "salmo",
                        "seg_lect",
                        "aleluya",
                        "evangelio",
                    ];
                    var index;
                    for (index = 0; index < partespos.length; ++index) {
                        parte8 = partespos[index];
                        if ($(".x_" + parte8 + ":visible").length) {
                            pon_pref("x" + pestana8 + parte8, $(".x_" + parte8 + ":visible").outerHTML());
                        }
                        else
                            pon_pref("x" + pestana8 + parte8, "nada");
                    }
                    $("a").each(function () {
                        if (!this.href.startsWith('javascript') && this.href.length > 0) {
                            this.href =
                                "javascript: vete_a('" + extraerRutaDesdeMisalV2(this.href) + "');";
                        }
                    });
                }
                break;
            case "pf":
                if ($(".dia:visible").length) {
                    pon_pref("x_pf_prefacio", $(".dia:visible").outerHTML());
                }
                else
                    pon_pref("x_pf_prefacio", "nada");
                $(".octava_pascua").addClass("visibleb");
                Promise.all([
                    carga_pagina("m_estructura/prefacios/m_estructura_prefacios.html#introduccion2").then(function (contenido) {
                        $(".meter_aqui").html(contenido);
                    }),
                    carga_pagina("m_estructura/prefacios/m_estructura_prefacios.html#santus148").then(function (contenido) {
                        $(".santus148").html(contenido);
                    }),
                ]).then(function () {
                    ajusta_idiomas(nuevoidioma1, nuevoidioma2);
                    texto = $("#tab_pf").html();
                    pon_pref("x_pf", texto);
                    pon_pref("x_pf_prefacio", texto);
                });
                //  carga_pagina("m_estructura/prefacios/m_estructura_prefacios.html#introduccion").then((contenido2) => {
                //    $(".meter_aqui").html(contenido2)
                //    ajusta_idiomas(nuevoidioma1, nuevoidioma2)
                //  });
                break;
            case "pe":
                url = window.location.pathname;
                filename = url.substring(url.lastIndexOf("/") + 1);
                $(".alternativa").addClass("visibleb");
                if ($("#contenido_pf").length) {
                    pon_pref("x_pe_prefacio", $("#contenido_pf").html());
                }
                else
                    pon_pref("x_pe_prefacio", "nada");
                if ($("#contenido_pe").length) {
                    pon_pref("x_pe_pleg", $("#contenido_pe").html());
                }
                else
                    pon_pref("x_pe_pleg", "nada");
                break;
        }
        //esta traca final busca algun enlace suelto
        $('a[href]').each(function () {
            var href = $(this).attr('href');
            // Verifica que no comience con "javascript:"
            if (!href.startsWith('javascript:') && (!href.startsWith('devocionario'))) {
                $(this).removeAttr('href');
                $(this).attr('onclick', "vete_a('" + href + "')");
            }
        });
    }
    pon_noche2(dime_pref("valor_noche", "1"));
    if (mipreferencia["fondo"] == 1) {
        $(" .boton ").each(function () {
            $(this).removeClass("boton").addClass("botonBueno");
        });
    }
    // Verificar si es un dispositivo móvil
    var esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!esDispositivoMovil) {
        var elementos = document.querySelectorAll("[ontouchend]");
        elementos.forEach(function (elemento) {
            var contenido = elemento.getAttribute("ontouchend");
            elemento.removeAttribute("ontouchend");
            elemento.setAttribute("onclick", contenido);
        });
    }
    // lo anterior es para depuracion en navegador
    Promise.all(tareas).then(function () {
        reemplazarComentarios();
        myScroll.refresh();
    });
}
function arregla_top() {
    var safeAreaTop = 0; //parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0;
    $('#cabecera').css('padding-top', (parseInt(dime_pref('margen_superior_defecto', 2)) + safeAreaTop) + 'px');
    padHeader = parseInt($("#cabecera").css("padding-top"));
    $("#contenedor").css("top", $("#cabecera").outerHeight(true) + "px");
    $("#icono-sticky, #icono-gear").css("top", parseInt($("#cabecera").outerHeight(true) + 30) + "px");
}
function getSafeAreaBottom() {
    var testDiv = document.createElement("div");
    testDiv.style.cssText = "position: absolute; bottom: 0; height: env(safe-area-inset-bottom); visibility: hidden;";
    document.body.appendChild(testDiv);
    var safeAreaBottom = testDiv.offsetHeight;
    document.body.removeChild(testDiv);
    return safeAreaBottom || 0; // Devuelve 0 si no hay margen seguro
}
function arregla_bottom() {
    var safeAreaBottom = getSafeAreaBottom();
    $('#piedepantalla').css('padding-bottom', (parseInt(dime_pref('margen_inferior_defecto', 0)) + safeAreaBottom) + 'px');
}
function pon_noche() {
    valor_noche = dime_pref("valor_noche", "0");
    if (valor_noche == 1) {
        pon_noche2(0);
    }
    else {
        pon_noche2(1);
    }
}
function pon_noche2(estado) {
    fondo_libro = "../fondo_libro.png";
    // Set data-theme for CSS-variable-based dark mode
    if (estado == 1) {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    if (estado == 1) {
        if (mipreferencia["fondo"] == 0) {
            $("body")
                .css("background-image", "none")
                .css("background-color", "#ffffff")
                .css("color", "black");
        }
        else {
            $("body")
                .css("background-image", "url('" + fondo_libro + "')")
                .css("background-color", "transparent")
                .css("color", "black");
        }
        $(".black , a.blnk , a.bllnkd, .enlacepref").css("color", "black");
        $(".h1 , h2 , h3, h4").css("color", "#B50000");
        $(" span.enlace , span.blue , span.enlace_salmodia, span.azul, .blboce").css("color", "darkblue"); // quité a, a:link  ,
        //       $('a.botonBueno , a.botonBueno:visited ').css('color','white');
        $(".texto_incluido").css("background-color", "whitesmoke");
        $("#top_botones").css("background-color", "seashell");
    }
    else {
        $("body")
            .css("background-image", "none")
            .css("background-color", "black")
            .css("color", "white");
        $(".black , a.blnk , a.bllnkd, .enlacepref").css("color", "gray");
        $(".h1 , h2 , h3, h4").css("color", "red");
        $("span.enlace , span.blue , span.enlace_salmodia, span.azul, .blboce").css("color", "lightblue");
        $(".texto_incluido").css("background-color", "DarkSlateGray");
        $("#top_botones").css("background-color", "#7e7a47");
    }
    pon_pref("valor_noche", estado);
}
function backKeyDown() {
    //console.log("Back Button Pressed!");
    if (confirm("Exit?"))
        navigator.app.exitApp();
}
function boton_adelante(pestanaloc) {
    //alert(pestana+'...'+puntero+'..'+tope)
    tope = dime_pref("lh" + pestanaloc + "_tope");
    if (puntero < tope) {
        puntero = Number(puntero) + 1;
        pon_pref("lh" + pestanaloc + "_ultimo", puntero);
        if (puntero == dime_pref("lh" + pestanaloc + "_tope")) {
            document.getElementById("bot_adelante").style.visibility = "hidden";
        }
        $("#tab_" + pestanaloc).html(dime_pref("lh" + pestanaloc + puntero));
        document.getElementById("bot_atras").style.visibility = "visible";
    }
    reemplazarComentarios();
    ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    myScroll.refresh();
    posicion = dime_pref("scroll_" + pestanaloc + puntero, 1);
    setTimeout(function () { myScroll.scrollTo(0, posicion, 0, false); }, 200);
}
function boton_atras(pestanaloc) {
    console.log(pestanaloc + '--' + puntero);
    if (puntero > 500) {
        puntero = Number(puntero) - 1;
        pon_pref("lh" + pestanaloc + "_ultimo", puntero);
        if (puntero == 500) {
            document.getElementById("bot_atras").style.visibility = "hidden";
        }
        if (puntero != 500) {
            $("#tab_" + pestanaloc).html(dime_pref("lh" + pestanaloc + puntero));
        }
        else
            carga_indice(pestanaloc, 1);
        document.getElementById("bot_adelante").style.visibility = "visible";
        if (document.getElementById("ciclo" + miciclo)) {
            document.getElementById("ciclo" + miciclo).checked = true;
            document.getElementById("anno_" + tipoanno).checked = true;
        }
    }
    reemplazarComentarios();
    ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    myScroll.refresh();
    posicion = dime_pref("scroll_" + pestanaloc + puntero, 1);
    setTimeout(function () { myScroll.scrollTo(0, posicion, 0, false); }, 200);
}
function cambia_indice(mielemento, otro) {
    $(mielemento.parentNode).removeClass("visibleb").addClass("novisibleb");
    $("#otro").addClass("visibeilb");
    saveUltimo(mipestana);
    myScroll.refresh();
}
function cambialengua(objeto) {
    // según sean las preferencias y la primera letra del id del div padre del elemento desde el que se ha llamado esta funcion muestra/oculta un idioma, u otro
    if (modocopia)
        return false;
    if (myScroll.moved)
        return;
    if (mipreferencia["presentaciontexto"] <= 1 || mimisal_1 == mimisal_2)
        return;
    var d = new Date();
    var hora = d.getTime();
    diferencia = hora - hora_ant[objeto.tagName];
    if (diferencia < 200)
        return;
    hora_ant[objeto.tagName] = 0;
    cambia = false;
    cambiaAlatin = false;
    cambiaAcast = false;
    if (objeto.tagName == "SPAN")
        objeto = objeto.parentNode;
    if (objeto.parentNode.className == "pueblo" ||
        mipreferencia["presentacionrespuestas"] == 5) {
        cambia = true;
    }
    else if (mipreferencia["presentaciontexto"] == 2 &&
        objeto.className != "botonlengua") {
        cambia = true;
    }
    else if (mipreferencia["presentaciontexto"] == 3 &&
        objeto.className == "botonlengua")
        cambia = true;
    if (cambia) {
        encontrado = false;
        if (objeto.className == mimisal_2) {
            cambiaAlatin = true;
            encontrado = true;
        }
        else if (objeto.className == mimisal_1) {
            cambiaAcast = true;
            encontrado = true;
        }
        if (!encontrado) {
            if ($(objeto).parents("." + mimisal_2).length > 0) {
                cambiaAlatin = true;
            }
            else if ($(objeto).parents("." + mimisal_1).length > 0)
                cambiaAcast = true;
        }
        if (cambiaAlatin) {
            if (encontrado) {
                padre = $(objeto).parents()[0];
            }
            else {
                padre = $(objeto)
                    .parents("." + mimisal_2)[0]
                    .parent()[0];
            }
            if ($(padre).children("." + mimisal_1).length > 0) {
                $(padre)
                    .children("." + mimisal_2)
                    .css("display", "none");
                $(padre)
                    .children("." + mimisal_1)
                    .css("display", "block");
                $(padre)
                    .children("." + mimisal_1 + ":empty")
                    .text("--- ??? ---");
            }
        }
        else if (cambiaAcast) {
            if (encontrado) {
                padre = $(objeto).parents()[0];
            }
            else {
                padre = $(objeto)
                    .parents("." + mimisal_1)[0]
                    .parent()[0];
            }
            if ($(padre).children("." + mimisal_2).length > 0) {
                $(padre)
                    .children("." + mimisal_2)
                    .css("display", "block");
                $(padre)
                    .children("." + mimisal_1)
                    .css("display", "none");
                $(padre)
                    .children("." + mimisal_2 + ":empty")
                    .text("--- ??? ---");
            }
        }
        myScroll.refresh();
    }
    return;
}
function cambialengua2(objeto) {
    // esta funcion es igual que la anterior, a la que se ha añadido la primeralínea.
    if (mipreferencia["presentaciontexto"] <= 1 || mimisal_1 == mimisal_2)
        return;
    var d = new Date();
    var hora = d.getTime();
    diferencia = hora - hora_ant[objeto.tagName];
    if (diferencia < 200)
        return;
    hora_ant[objeto.tagName] = 0;
    cambia = false;
    cambiaAlatin = false;
    cambiaAcast = false;
    if (objeto.tagName == "SPAN")
        objeto = objeto.parentNode;
    if (objeto.parentNode.className == "pueblo" ||
        mipreferencia["presentacionrespuestas"] == 5) {
        cambia = true;
    }
    else if (mipreferencia["presentaciontexto"] == 2 &&
        objeto.className != "botonlengua") {
        cambia = true;
    }
    else if (mipreferencia["presentaciontexto"] == 3 &&
        objeto.className == "botonlengua")
        cambia = true;
    if (cambia) {
        encontrado = false;
        if (objeto.className == mimisal_2) {
            cambiaAlatin = true;
            encontrado = true;
        }
        else if (objeto.className == mimisal_1) {
            cambiaAcast = true;
            encontrado = true;
        }
        if (!encontrado) {
            if ($(objeto).parents("." + mimisal_2).length > 0) {
                cambiaAlatin = true;
            }
            else if ($(objeto).parents("." + mimisal_1).length > 0)
                cambiaAcast = true;
        }
        if (cambiaAlatin) {
            if (encontrado) {
                padre = $(objeto).parents()[0];
            }
            else {
                padre = $(objeto)
                    .parents("." + mimisal_2)[0]
                    .parent()[0];
            }
            if ($(padre).children("." + mimisal_1).length > 0) {
                $(padre)
                    .children("." + mimisal_2)
                    .removeClass("visibleb")
                    .addClass("novisibleb");
                $(padre)
                    .children("." + mimisal_1)
                    .removeClass("novisibleb")
                    .addClass("visibleb");
                $(padre)
                    .children("." + mimisal_1 + ":empty")
                    .text("--- ??? ---");
            }
        }
        else if (cambiaAcast) {
            if (encontrado) {
                padre = $(objeto).parents()[0];
            }
            else {
                padre = $(objeto)
                    .parents("." + mimisal_1)[0]
                    .parent()[0];
            }
            if ($(padre).children("." + mimisal_2).length > 0) {
                $(padre)
                    .children("." + mimisal_2)
                    .removeClass("novisibleb")
                    .addClass("visibleb");
                $(padre)
                    .children("." + mimisal_1)
                    .removeClass("visibleb")
                    .addClass("novisibleb");
                $(padre)
                    .children("." + mimisal_2 + ":empty")
                    .text(" --- ??? --- ");
            }
        }
    }
    myScroll.refresh();
    return;
}
function cambia_vista(miId) {
    var d = new Date();
    var hora = d.getTime();
    diferencia = hora - hora_ant[miId];
    if (diferencia < 300)
        return;
    hora_ant[miId] = 0;
    mielemento = document.getElementById(miId);
    if (mielemento.style.display == "block") {
        mielemento.style.display = "none";
    }
    else
        mielemento.style.display = "block";
    // ahora guardamos el nuevo estado de lo que hemos variado en la variable embutidos
    saveUltimo(mipestana);
    myScroll.refresh();
    return false;
}
function cambia_vista2(miId) {
    var d = new Date();
    var hora = d.getTime();
    diferencia = hora - hora_ant[miId];
    if (diferencia < 300)
        return;
    hora_ant[miId] = 0;
    $("#" + miId).toggleClass("visibleb novisibleb");
    // ahora guardamos el nuevo estado de lo que hemos variado en la variable embutidos
    saveUltimo(mipestana);
    myScroll.refresh();
}
function cambia_vista_y_simbolo(objeto, miId) {
    cambia_vista(miId);
    if ($("#" + miId).css("display") == "none") {
        objeto.innerHTML = "&#9654;&#xFE0E;";
    }
    else {
        objeto.innerHTML = "&#9660;&#xFE0E;";
    }
    myScroll.refresh();
}
function cambia_pref(pref, nuevovalor) {
    mipreferencia[pref] = nuevovalor;
    preferencias = "?fondo=" + mipreferencia["fondo"];
    preferencias += "&tamanotexto=" + mipreferencia["tamanotexto"];
    preferencias += "&avance=" + mipreferencia["avance"];
    preferencias += "&tipoletra=" + mipreferencia["tipoletra"];
    preferencias += "&tamanorubrica=" + mipreferencia["tamanorubrica"];
    preferencias += "&margen_superior=" + mipreferencia["margen_superior"];
    preferencias += "&margen_inferior=" + mipreferencia["margen_inferior"];
    preferencias += "&misal_pral=" + mipreferencia["misal_pral"];
    preferencias += "&tamanomenus=" + mipreferencia["tamanomenus"];
    preferencias += "&segundoidioma=" + mipreferencia["segundoidioma"];
    preferencias += "&presentaciontexto=" + mipreferencia["presentaciontexto"];
    preferencias +=
        "&presentacionrespuestas=" + mipreferencia["presentacionrespuestas"];
    preferencias +=
        "&presentacionpestanas=" + mipreferencia["presentacionpestanas"];
    preferencias += "&presentacionbotones=" + mipreferencia["presentacionbotones"];
    preferencias += "&oracionestodos=" + mipreferencia["oracionestodos"];
    preferencias += "&botoneszurdos=" + mipreferencia["botoneszurdos"];
    preferencias += "&ordinarionormal=" + mipreferencia["ordinarionormal"];
    window.localStorage.setItem("preferencias", preferencias);
    pon_pref("cambiartamano", 1);
}
function dime_pref(key, defecto) {
    var resultado = window.localStorage.getItem(key);
    //alert("dime hola77" + key)
    if (resultado == null)
        resultado = defecto;
    //console.log('Saco: '+ key+ '... -> ... '+resultado)
    return resultado;
}
function esconde_clase(elem, clase, siono) {
    var l = new Array(elem), c = 1, ret = new Array();
    //This first loop will loop until the count var is stable//
    for (var r = 0; r < c; r++) {
        //This loop will loop thru the child element list//
        for (var z = 0; z < l[r].childNodes.length; z++) {
            //Push the element to the return array.
            if (l[r].childNodes[z].className == clase) {
                if (siono) {
                    l[r].childNodes[z].style.display = "none";
                }
                else {
                    l[r].childNodes[z].style.display = "inline";
                }
            }
            else if (l[r].childNodes[z].className != "pueblo") {
                esconde_clase(l[r].childNodes[z], clase, siono);
            }
        } //FOR
    } //FOR
}
function extrae_parcial(miurl) {
    var a = document.createElement("a");
    a.href = miurl;
    url = miurl.replace(a.hash, "");
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    if (typeof vars["parcial"] === "undefined") {
        resultado = "";
    }
    else
        resultado = "&parcial=" + vars["parcial"];
    return resultado;
}
function getUrlVars() {
    var url = window.location.href.replace(window.location.hash, "");
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
        //    console.log(key+'->'+value);
    });
    return vars;
}
function cargado2() {
    // Expande diretamente todas as seções do ordinário
    // Isso é mais confiável que trigger("touchend") em dispositivos como Kindle
    try {
        // Mostra todas as seções principais
        muestraono("ritos_iniciales", true);
        muestraono("liturgia_palabra", true);
        muestraono("liturgia_eucaristica_1", true);
        muestraono("liturgia_eucaristica_2", true);
        muestraono("liturgia_eucaristica_3", true);
        muestraono("liturgia_eucaristica_4", true);

        // Esconde todos os botões "+"
        muestraono("botonmas1", false);
        muestraono("botonmas2", false);
        muestraono("botonmas3", false);
        muestraono("botonmas4", false);
        muestraono("botonmas5", false);
        muestraono("botonmas6", false);

        // Alterna o superbot (mostra "---" em vez de "+++")
        muestraono("superbot_1", false);
        muestraono("superbot_2", true);
    } catch (e) {
        console.log("Erro ao expandir seções:", e);
    }
    $(".respuesta").remove();
    if ($("input.x_tmp_precedencia").length) {
        preced_tmp = Number($("input.x_tmp_precedencia").val());
        if (preced_tmp == 66)
            if (midia == 0) {
                preced_tmp = 6;
            }
            else
                preced_tmp = 13;
    }
    else
        preced_tmp = 88;
    if ($("input.x_snt_precedencia").length) {
        preced_snt = Number($("input.x_snt_precedencia").val());
    }
    else
        preced_snt = 88;
    if (preced_tmp <= 8)
        $(".no_fiestas").remove();
    opcion_elegida = dime_pref("opcion_elegida", "0");
    // alert(opcion_elegida+'-'+preced_snt+'-'+preced_tmp+'-'+midia)
    if (opcion_elegida == 0) {
        if (preced_snt < preced_tmp) {
            if (preced_snt <= 8 || $("span.lect_obl").length != 0) {
                lect_sant_prior = true;
                $(".no_fiestas").remove();
            }
            // Chama activa_bot diretamente (mais confiável no Kindle)
            activa_bot(".bot_snt.activo", "snt", "global");
            pon_pref("opcion_elegida", "2");
        }
        else {
            // Chama activa_bot diretamente (mais confiável no Kindle)
            activa_bot(".bot_tmp.activo", "tmp", "global");
            pon_pref("opcion_elegida", "1");
        }
    }
    else {
        if (opcion_elegida == 1) {
            // Chama activa_bot diretamente (mais confiável no Kindle)
            activa_bot(".bot_tmp.activo", "tmp", "global");
        }
        if (opcion_elegida == 2) {
            if (preced_snt <= 8 || $("span.lect_obl").length != 0) {
                lect_sant_prior = true;
                $(".no_fiestas").remove();
            }
            // Chama activa_bot diretamente (mais confiável no Kindle)
            activa_bot(".bot_snt.activo", "snt", "global");
        }
        if (opcion_elegida == 3)
            // Chama activa_bot diretamente (mais confiável no Kindle)
            activa_bot(".bot_com.activo", "com", "global");
    }
    //        muestraono("ritos_iniciales",true); muestraono("botonmas1",false); muestraono("liturgia_palabra",true); muestraono("botonmas2",false); muestraono("liturgia_eucaristica_1",true); muestraono("botonmas3",false); muestraono("liturgia_eucaristica_2",true); muestraono("botonmas4",false); muestraono("liturgia_eucaristica_3",true); muestraono("botonmas5",false); muestraono("liturgia_eucaristica_4",true); muestraono("botonmas6",false);  muestraono("superbot_1",false); muestraono("superbot_2",true);
    //        if ($('#bot_global .bot_tmp').hasClass('activo'))  activa_bot('.bot_tmp.activo','tmp','global');
    if ($("#bot_prefacio .bot_pf").hasClass("activo")) {
        $("#bot_prefacio .bot_pf")
            .siblings(".noactivo")
            .removeClass("noactivo")
            .addClass("activo");
        $("#bot_prefacio .bot_pf").removeClass("activo").addClass("noactivo");
        $(".txt_prefacio").removeClass("visibleb").addClass("novisibleb");
        $("#x_pf_prefacio").removeClass("novisibleb").addClass("visibleb");
    }
    if ($("#bot_prefacio .bot_pe").hasClass("activo")) {
        $("#bot_prefacio .bot_pe")
            .siblings(".noactivo")
            .removeClass("noactivo")
            .addClass("activo");
        $("#bot_prefacio .bot_pe").removeClass("activo").addClass("noactivo");
        $(".txt_prefacio").removeClass("visibleb").addClass("novisibleb");
        $("#x_pe_prefacio").removeClass("novisibleb").addClass("visibleb");
    }
    if ($("#bot_pleg .bot_pe").hasClass("activo")) {
        $("#bot_pleg .bot_ord").removeClass("noactivo").addClass("activo");
        $("#bot_pleg .bot_pe").removeClass("activo").addClass("noactivo");
        $("#x_ord_pleg").removeClass("visibleb").addClass("novisibleb");
        $("#x_pe_pleg").removeClass("novisibleb").addClass("visibleb");
    }
}
function onDeviceReady2() {
    // Register the event listener
    //console.log("PhoneGap preparado!");
    document.addEventListener("backbutton", backKeyDown, true);
    //navigator.splashscreen.hide()
    if (window.cordova)
        navigator.splashscreen.hide();
    if (esIOS) {
        $("#exitBtn").css('display', "none");
    }
    else {
        document.addEventListener("volumeupbutton", retrasa_pantalla, false);
        document.addEventListener("volumedownbutton", avanza_pantalla, false);
    }
}
function retrasa_pantalla() {
    // myScroll.scrollTo(0, -eval(document.getElementById('contenedor').offsetHeight-10), 0, true);
    var headerBottom = document.getElementById("cabecera").getBoundingClientRect().bottom;
    var pieTop = document.getElementById("piedepantalla").getBoundingClientRect().top;
    var paginaAltura = pieTop - headerBottom;
    $("#contenedor").animate({
        scrollTop: "-=" + (paginaAltura - 10),
    }, 200);
}
function avanza_pantalla() {
    //myScroll.scrollTo(0, eval(document.getElementById('contenedor').offsetHeight-10), 0, true);
    var headerBottom = document.getElementById("cabecera").getBoundingClientRect().bottom;
    var pieTop = document.getElementById("piedepantalla").getBoundingClientRect().top;
    var paginaAltura = pieTop - headerBottom;
    $("#contenedor").animate({
        scrollTop: "+=" + (paginaAltura - 10),
    }, 200);
}
function botonPantAbajo() {
    myScroll.scrollTo(0, avancepantalla, 200, true);
    ayuda = 1;
    return false;
}
function botonPantArriba() {
    myScroll.scrollTo(0, -avancepantalla, 200, true);
}
function parseURL(url) {
    /*
  Ejemplo:
  var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
  
  myURL.file; // = 'index.html'
  myURL.hash; // = 'top'
  myURL.host; // = 'abc.com'
  myURL.query; // = '?id=255&m=hello'
  myURL.params; // = Object = { id: 255, m: hello }
  myURL.path; // = '/dir/index.html'
  myURL.segments; // = Array = ['dir', 'index.html']
  myURL.port; // = '8080'
  myURL.protocol; // = 'http'
  myURL.source; // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'
  
  */
    var a = document.createElement("a");
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(":", ""),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {}, seg = a.search.replace(/^\?/, "").split("&"), len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split("=");
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
        hash: a.hash.replace("#", ""),
        path: a.pathname.replace(/^([^\/])/, "/$1"),
        relative: (a.href.match(/tp:\/\/[^\/]+(.+)/) || [, ""])[1],
        segments: a.pathname.replace(/^\//, "").split("/"),
    };
}
function cambia_titulos() {
    document.getElementById("titulo01").innerHTML =
        "1:&nbsp;" + dime_pref("titulo1", "- 1 -");
    document.getElementById("titulo02").innerHTML =
        "2:&nbsp;" + dime_pref("titulo2", "- 2 -");
    document.getElementById("titulo03").innerHTML =
        "3:&nbsp;" + dime_pref("titulo3", "- 3 -");
    document.getElementById("titulo04").innerHTML =
        "4:&nbsp;" + dime_pref("titulo4", "- 4 -");
    document.getElementById("titulo05").innerHTML =
        "5:&nbsp;" + dime_pref("titulo5", "- 5 -");
    document.getElementById("titulo06").innerHTML =
        "6:&nbsp;" + dime_pref("titulo6", "- 6 -");
    document.getElementById("titulo07").innerHTML =
        "7:&nbsp;" + dime_pref("titulo7", "- 7 -");
    document.getElementById("titulo1").innerHTML =
        "1:&nbsp;" + dime_pref("titulo1", "- 1 -");
    document.getElementById("titulo2").innerHTML =
        "2:&nbsp;" + dime_pref("titulo2", "- 2 -");
    document.getElementById("titulo3").innerHTML =
        "3:&nbsp;" + dime_pref("titulo3", "- 3 -");
    document.getElementById("titulo4").innerHTML =
        "4:&nbsp;" + dime_pref("titulo4", "- 4 -");
    document.getElementById("titulo5").innerHTML =
        "5:&nbsp;" + dime_pref("titulo5", "- 5 -");
    document.getElementById("titulo6").innerHTML =
        "6:&nbsp;" + dime_pref("titulo6", "- 6 -");
    document.getElementById("titulo7").innerHTML =
        "7:&nbsp;" + dime_pref("titulo7", "- 7 -");
}
function mi_oracion_new() {
    var hoy = new Date();
    var dl = hoy.getDate();
    var dia = hoy.getDay();
    if (dl > 14 && dl < 22 && dia == 0) {
        $("#otras").trigger("expand");
        $("#orac23").trigger("expand");
        $("#otras").collapsible("option", "collapsed", false);
        $("#orac23").collapsible("option", "collapsed", false);
        $("#orac23").get(0).scrollIntoView();
    }
    else if (dia == 2) {
        $("#otras").trigger("expand");
        $("#orac18").trigger("expand");
        $("#otras").collapsible("option", "collapsed", false);
        $("#orac18").collapsible("option", "collapsed", false);
        $("#orac18").get(0).scrollIntoView();
    }
    else if (dia == 4) {
        $("#otras").trigger("expand");
        $("#orac25").trigger("expand");
        $("#otras").collapsible("option", "collapsed", false);
        $("#orac25").collapsible("option", "collapsed", false);
        $("#orac25").get(0).scrollIntoView();
    }
    else {
        $("#gracias").trigger("expand");
        $("#orac17").trigger("expand");
        $("#gracias").collapsible("option", "collapsed", false);
        $("#orac17").collapsible("option", "collapsed", false);
        $("#orac17").get(0).scrollIntoView();
    }
    window.scrollBy(0, -80);
    contador = 0;
}
function mi_oracion() {
    var hoy = new Date();
    var dl = hoy.getDate();
    var dia = hoy.getDay();
    if (dl > 14 && dl < 22 && dia == 0) {
        muestraono("otras", true);
        muestraono("orac23", true);
        myScroll.refresh;
        myScroll.scrollToElement(document.getElementById("orac023"), 20);
    }
    else if (dia == 2) {
        muestraono("otras", true);
        muestraono("orac18", true);
        myScroll.refresh;
        myScroll.scrollToElement(document.getElementById("orac018"), 20);
    }
    else if (dia == 4) {
        muestraono("otras", true);
        muestraono("orac25", true);
        myScroll.refresh;
        myScroll.scrollToElement(document.getElementById("orac025"), 20);
    }
    else {
        muestraono("gracias", true);
        muestraono("orac17", true);
        myScroll.refresh;
        myScroll.scrollToElement(document.getElementById("orac017"), 20);
    }
    contador = 0;
}
function pinta_tabs(directorio, libro) {
    salida = "";
    mitexto = "";
    var miarchivo = parseURL(window.location.href).file;
    margenSuperior = esIOS ? "env(safe-area-inset-top)" : mipreferencia['margen_superior'] + "px";
    if (miarchivo != "indice_tiempos.html" &&
        miarchivo != "indice_comunes.html" &&
        miarchivo != "indice_santos.html" &&
        miarchivo != "indice_lecturas.html" &&
        miarchivo != "indice_prefacios.html" &&
        miarchivo != "indice_pleg_euc.html" &&
        miarchivo != "indice_ogmr.html") {
        directorio2 = ""; // "../"
    }
    else
        directorio2 = "";
    mitexto = " ";
    sitio1 = 'cambia_a_pest("o")';
    sitio2 = 'cambia_a_pest("t")';
    sitio3 = 'cambia_a_pest("s")';
    sitio4 = 'cambia_a_pest("c")';
    sitio5 = 'cambia_a_pest("le")';
    sitio6 = 'cambia_a_pest("pf")';
    sitio7 = 'cambia_a_pest("pe")';
    sitio8 = 'cambia_a_pest("i")';
    mispestanas = ".tabnav_" + pestana;

    // Verifica se já existe cabecera com estilo segmented (novo estilo)
    var cabeceraExiste = document.getElementById('cabecera');
    var usarSegmented = cabeceraExiste && document.getElementById('chipsNav');

    if (usarSegmented) {
        // Cabecera segmented já existe no HTML, não criar novamente
        var texto = "";
    }
    else if (libro == "dev") {
        pestana = "9";
        var texto = "<div id=cabecera style='text-align: center; position: fixed; top: 0; left: 0; width: 100%; border-bottom: 1px solid #aa0000; padding-bottom: 1%; " +
            mitexto +
            " ; z-index: 50000; '>";
        texto +=
            "<span class=boton style='float: left; margin-left: 2%;' ontouchend='event.stopPropagation();vete_a(\"sacerdotale.html\")' >Sacerdotale</span><img id='bot_indice' src=\"../estrella.png\" style=\" width: 1.6em; height: 1.6em;\" ontouchend='contador++ ; setTimeout(function() { if (contador==1) mi_oracion(); },500) ; if (contador==2) { muestraono(\"precesobra\",true); myScroll.refresh; myScroll.scrollToElement(document.getElementById(\"precesobra\"),0); contador=0; };' ><span class=boton style='float: right; margin-right: 2%;' ontouchend='sitioultimo(\"o\")' >Missale</span></div>";
    }
    else if (libro == "sac") {
        pestana = "0";
        var texto = "<div id=cabecera style='position: absolute; top: 0; left: 0; width: 100%; border-bottom: 1px solid #aa0000; padding-bottom: 1%; " +
            mitexto +
            " ; z-index: 50000; '>";
        texto +=
            "<span class=boton style='margin-left: 2%; float: left;' ontouchend='event.stopPropagation();vete_a(\"devocionario_old.html\")' >Devotionarium</span><span class=boton style='float: right; margin-right: 2%;' ontouchend='sitioultimo(\"o\")' >Missale</span></div>";
    }
    else {
        if (mipreferencia["presentacionpestanas"] == 3) {
            //emergentes
            var texto = "<div id=cabecera_back style='z-index: 50000; position: absolute; top: 0; left: 0; font-size: " +
                mipreferencia["tamanomenus"] +
                "pt; text-align: center; background: transparent;' ontouchend='if (pestanasactivas==0) toggle_pestanas(1);' > <div id=cabecera style='margin-left: 2%; margin-right: 2%; height: 2.1em; width: 96%; z-index: 50000; ' >";
            texto += "<ul class='pestanas tabnav_" + pestana + "'>";
            texto += "<li class='tab1' ontouchend='" + sitio1 + "'>Ord</li>";
            texto += "<li class='tab2' ontouchend='" + sitio2 + "'>Tmp</li>";
            texto += "<li class='tab3' ontouchend='" + sitio3 + "'>Snt</li>";
            texto += "<li class='tab4' ontouchend='" + sitio4 + "'>Com</li>";
            texto += "<li class='tab5' ontouchend='" + sitio5 + "'>Lct</li>";
            texto +=
                "<li class='tab6' ontouchend='" + sitio6 + "'>&nbsp;Pf&nbsp;</li>";
            texto +=
                "<li class='tab7' ontouchend='" + sitio7 + "'>&nbsp;PE&nbsp;</li>";
            // texto+="<li class='tab8' ontouchend='"+sitio8+"'>IGMR</li>";
            texto += "</ul>";
            texto += "</div></div>";
        }
        else if (mipreferencia["presentacionpestanas"] == 0) {
            // siempre visibles
            if (!estoymac) {
                var texto = "<div id='cabecera' style='position: absolute; top: 0; left: 0; font-size: " +
                    mipreferencia["tamanomenus"] +
                    "pt; text-align: center;'> <div id=cabecera style='margin-left: 2%; margin-right: 2%; height: 2.1em; padding-top: " + margenSuperior + "; width: 96%; z-index: 50000; '>";
                texto += "<ul class=pestanas tabnav_" + pestana + "'>";
                texto += "<li class='tab1' ontouchend='" + sitio1 + "'>Ord</li>";
                texto += "<li class='tab2' ontouchend='" + sitio2 + "'>Tmp</li>";
                texto += "<li class='tab3' ontouchend='" + sitio3 + "'>Snt</li>";
                texto += "<li class='tab4' ontouchend='" + sitio4 + "'>Com</li>";
                texto += "<li class='tab5' ontouchend='" + sitio5 + "'>Lct</li>";
                texto +=
                    "<li class='tab6' ontouchend='" + sitio6 + "'>&nbsp;Pf&nbsp;</li>";
                texto +=
                    "<li class='tab7' ontouchend='" + sitio7 + "'>&nbsp;PE&nbsp;</li>";
                // texto+="<li class='tab8' ontouchend='"+sitio8+"'>IGMR</li>";
            }
            else {
                var texto = "<div id='cabecera' style='position: absolute; top: 0; left: 0; font-size: " +
                    mipreferencia["tamanomenus"] +
                    "pt; text-align: center;'> <div id=cabecera style='margin-left: 2%; margin-right: 2%; padding-top: " + margenSuperior + "; height: 2.1em; width: 96%; z-index: 50000; '>";
                texto += "<ul style='' class='pestanas tabnav_" + pestana + "'>";
                texto += "<li class='tab1' ontouchend='" + sitio1 + "'>Ord</li>";
                texto += "<li class='tab2' ontouchend='" + sitio2 + "'>Tmp</li>";
                texto += "<li class='tab3' ontouchend='" + sitio3 + "'>Snt</li>";
                texto += "<li class='tab4' ontouchend='" + sitio4 + "'>Com</li>";
                texto += "<li  class='tab5' ontouchend='" + sitio5 + "'>Lct</li>";
                texto +=
                    "<li class='tab6' ontouchend='" + sitio6 + "'>&nbsp;Pf&nbsp;</li>";
                texto +=
                    "<li class='tab7' ontouchend='" + sitio7 + "'>&nbsp;PE&nbsp;</li>";
            }
            texto += "</ul>";
            texto += "</div></div>";
        }
        else {
            // es decir, 1 visibles mediante botón
            var texto = "<style> #contenedor { top: 0; } </style><div id='cabecera' style='position: absolute; top: 0; left: 0;'></div><div id=cabecera2 style='position: absolute; top: 0; left: 0 ; height: 100%; font-size: " +
                mipreferencia["tamanomenus"] +
                "pt; text-align: left; width: auto; opacity: .9; background: transparent; padding-top: " + margenSuperior + "; z-index: 50000; '> ";
            texto +=
                "<div style='margin-top: 8em;'><div id=icono_abajo style='float: right; padding: 1em 0 1em 1em; display: none;' ontouchend= 'document.getElementById(\"tabnav" +
                    pestana +
                    '").style.display="none"; this.style.display= "none"; document.getElementById("icono_arriba").style.display="block"; $("#cabecera2").css("background","transparent"); \'><img src=\'../' +
                    directorio2 +
                    "izquierda.png'' style='height: 1.6em; float: right;'></div><div id=icono_arriba style='float: left; padding: 1em 1em 1em 0; display: block;' ontouchend= 'document.getElementById(\"tabnav" +
                    pestana +
                    '").style.display="block"; this.style.display= "none"; document.getElementById("icono_abajo").style.display="block"; this.style.display= "none"; $("#cabecera2").css("background","#440000");\' ><img src=\'../' +
                    directorio2 +
                    "derecha2.png'' style=' height: 1.6em;'></div></div><div style='float:left;'><ul class=ul_pestanas id='tabnav" +
                    pestana +
                    "' style='display: none; padding: 0; ' >";
            texto +=
                "<li class='tab1' style=' display: block; width:100%; ' ontouchend='" +
                    sitio1 +
                    "'>Ordo missæ</li>";
            texto +=
                "<li class='tab2' style='display: block; width:100%;' ontouchend='" +
                    sitio2 +
                    "'>Proprium de tempore</li>";
            texto +=
                "<li class='tab3' style=' display: block; width:100%;' ontouchend='" +
                    sitio3 +
                    "'>Proprium sanctorum</li>";
            texto +=
                "<li class='tab4' style=' display: block; width:100%;' ontouchend='" +
                    sitio4 +
                    "'>Communia</li>";
            texto +=
                "<li class='tab5' style=' display: block; width:100%;' ontouchend='" +
                    sitio5 +
                    "'>Lectionarium</li>";
            texto +=
                "<li class='tab6' style=' display: block; width:100%;' ontouchend='" +
                    sitio6 +
                    "'>Præfatio</li>";
            texto +=
                "<li class='tab7' style=' display: block; width: 100%;' ontouchend='" +
                    sitio7 +
                    "'>Prex Eucharistica</li>";
            texto += "</ul></div>";
            texto += "</div>";
        }
    }
    // Só escreve o cabecera se não estiver usando o estilo segmented
    if (texto && texto.length > 0) {
        var _container = document.getElementById('cabecera') || document.body;
        _container.insertAdjacentHTML('beforeend', texto);
    }
    // menu para guardar posicion de lecturas
    texto =
        "<div id=menu_grabar style='position: absolute; bottom: 2em; right: 50%; width: auto; font-weight: bold; display: none; z-index: 30000; text-align: right;' ><ul class=ul_normal id=tab_grabar >";
    texto +=
        '<li id=titulo01 ontouchend=\'cambia_vista("menu_grabar"); titulo1=prompt("Titulum 1:" , "- 1 -"); if (titulo1!= null ) { pon_pref("titulo1", titulo1); } ; pon_pref("mr_pest1",mipestana); pon_pref("mr_alia1",$("#tab_"+mipestana).html());\' >- 1 -</li>';
    texto +=
        '<li id=titulo02 ontouchend=\'cambia_vista("menu_grabar"); titulo1=prompt("Titulum 2:" , "- 2 -"); if (titulo1!= "") { pon_pref("titulo2", titulo1); } ; pon_pref("mr_pest2",mipestana); pon_pref("mr_alia2",$("#tab_"+mipestana).html());\' >- 2 -</li>';
    texto +=
        '<li id=titulo03 ontouchend=\'cambia_vista("menu_grabar"); titulo1=prompt("Titulum 3:" , "- 3 -"); if (titulo1!= "") { pon_pref("titulo3", titulo1); } ; pon_pref("mr_pest3",mipestana); pon_pref("mr_alia3",$("#tab_"+mipestana).html());\' >- 3 -</li>';
    texto +=
        '<li id=titulo04 ontouchend=\'cambia_vista("menu_grabar"); titulo1=prompt("Titulum 4:" , "- 4 -"); if (titulo1!= "") { pon_pref("titulo4", titulo1); } ; pon_pref("mr_pest4",mipestana); pon_pref("mr_alia4",$("#tab_"+mipestana).html());\' >- 4 -</li>';
    texto +=
        '<li id=titulo05 ontouchend=\'cambia_vista("menu_grabar"); titulo1=prompt("Titulum 5:" , "- 5 -"); if (titulo1!= "") { pon_pref("titulo5", titulo1); } ; pon_pref("mr_pest5",mipestana); pon_pref("mr_alia5",$("#tab_"+mipestana).html());\' >- 5 -</li>';
    texto +=
        '<li id=titulo06 ontouchend=\'cambia_vista("menu_grabar"); titulo1=prompt("Titulum 6:" , "- 6 -"); if (titulo1!= "") { pon_pref("titulo6", titulo1); } ; pon_pref("mr_pest6",mipestana); pon_pref("mr_alia6",$("#tab_"+mipestana).html());\' >- 6 -</li>';
    texto +=
        '<li id=titulo07 ontouchend=\'cambia_vista("menu_grabar"); titulo1=prompt("Titulum 7:" , "- 7 -"); if (titulo1!= "") { pon_pref("titulo7", titulo1); } ; pon_pref("mr_pest7",mipestana); pon_pref("mr_alia7",$("#tab_"+mipestana).html());\' >- 7 -</li>';
    texto += "</ul></div>";
    document.body.insertAdjacentHTML('beforeend', texto);
    texto =
        "<div id=menu_ira style='position: absolute; bottom: 2em; left: 50%; width: auto; font-weight: bold; display: none; z-index: 30000;' ><ul class=ul_normal id=tab_ira >";
    texto +=
        '<li id=titulo1 ontouchend=\'cambia_vista("menu_ira"); if (dime_pref("mr_alia1" , 0 )!=0 ) { cambia_a_pest(dime_pref("mr_pest1","o") ); if (mipestana!="o") {$("#tab_"+mipestana).html(dime_pref("mr_alia1", "noExiste")); arreglaCarga(mipestana);} } else alert ("Ignotum"); \' >- 1 -</li>';
    texto +=
        '<li id=titulo2 ontouchend=\'cambia_vista("menu_ira"); if (dime_pref("mr_alia2" , 0 )!=0 ) { cambia_a_pest(dime_pref("mr_pest2","o") ); if (mipestana!="o") {$("#tab_"+mipestana).html(dime_pref("mr_alia2", "noExiste")); arreglaCarga(mipestana);}  } else alert ("Ignotum"); \' >- 2 -</li>';
    texto +=
        '<li id=titulo3 ontouchend=\'cambia_vista("menu_ira"); if (dime_pref("mr_alia3",0)!=0 ) { cambia_a_pest(dime_pref("mr_pest3","o") ); if (mipestana!="o") {$("#tab_"+mipestana).html(dime_pref("mr_alia3", "noExiste")); arreglaCarga(mipestana);} } else alert ("Ignotum"); \' >- 3 -</li>';
    texto +=
        '<li id=titulo4 ontouchend=\'cambia_vista("menu_ira"); if (dime_pref("mr_alia4" , 0 )!=0 ) { cambia_a_pest(dime_pref("mr_pest4","o") ); if (mipestana!="o") {$("#tab_"+mipestana).html(dime_pref("mr_alia4", "noExiste")); arreglaCarga(mipestana);} } else alert ("Ignotum"); \' >- 4 -</li>';
    texto +=
        '<li id=titulo5 ontouchend=\'cambia_vista("menu_ira"); if (dime_pref("mr_alia5",0)!=0 ) { cambia_a_pest(dime_pref("mr_pest5","o") ); if (mipestana!="o") {$("#tab_"+mipestana).html(dime_pref("mr_alia5", "noExiste")); arreglaCarga(mipestana);} } else alert ("Ignotum"); \' >- 5 -</li>';
    texto +=
        '<li id=titulo6 ontouchend=\'cambia_vista("menu_ira"); if (dime_pref("mr_alia6",0)!=0 ) { cambia_a_pest(dime_pref("mr_pest6","o") ); if (mipestana!="o") {$("#tab_"+mipestana).html(dime_pref("mr_alia6", "noExiste")); arreglaCarga(mipestana);} } else alert ("Ignotum"); \' >- 6 -</li>';
    texto +=
        '<li id=titulo7 ontouchend=\'cambia_vista("menu_ira"); if (dime_pref("mr_alia7",0)!=0 ) { cambia_a_pest(dime_pref("mr_pest7","o") ); if (mipestana!="o") {$("#tab_"+mipestana).html(dime_pref("mr_alia7", "noExiste")); arreglaCarga(mipestana);} } else alert ("Ignotum"); \' >- 7 -</li>';
    texto += "</ul></div>";
    document.body.insertAdjacentHTML('beforeend', texto);
    if (mipreferencia["tipoletra"] == 1) {
        mitexto = ' body { font-family: "Times New Roman"; } ';
    }
    else
        mitexto = ' body { font-family: "Arial"; } ';
    if (mipreferencia["fondo"] == 0) {
        mitexto +=
            " body {background-color: #ffffff; background-image: none; font-size: " +
                mipreferencia["tamanotexto"] +
                "pt } ";
    }
    else if (mipreferencia["fondo"] == 1) {
        mitexto += " body { font-size: " + mipreferencia["tamanotexto"] + "pt; } ";
    }
    if (miarchivo != "indice_tiempos.html" &&
        miarchivo != "indice_comunes.html" &&
        miarchivo != "indice_santos.html" &&
        miarchivo != "indice_lecturas.html" &&
        miarchivo != "indice_prefacios.html" &&
        miarchivo != "indice_pleg_euc.html" &&
        miarchivo != "indice_ogmr.html") {
        mitexto +=
            " .red , .roja { font-size: 80%; } .rubrica { font-size: " +
                mipreferencia["tamanorubrica"] +
                "%; } ";
    }
    if (mipreferencia["fondo"] == 0) {
        mitexto +=
            ' .boton , .boton span.red , a.boton { background: url("../' +
                directorio2 +
                'boton2.png") top right no-repeat; color: #660000; }';
    }
    else
        mitexto +=
            ' span.boton , .boton span.red , a.boton { background: url("../' +
                directorio2 +
                'boton.png") top right no-repeat; color: white; }';
    if (mipreferencia["oracionestodos"] == 0) {
        mitexto += " .oracionestodos {font-style: normal; font-weight: normal; } ";
    }
    else if (mipreferencia["oracionestodos"] == 1) {
        mitexto +=
            " .oracionestodos { font-style: italic; font-weight: normal; } .oracionestodos .rubrica , .oracionestodos .red { font-style: normal; font-weight: normal; } ";
    }
    else
        mitexto +=
            " .oracionestodos { font-style: normal; font-weight: bold; } .oracionestodos .rubrica , .oracionestodos .red { font-style: normal; font-weight: normal; } ";
    // presentaciontexto: 0    Sin traduccion    1    dos columnas    2    cambio tocando
    if (mipreferencia["presentaciontexto"] == 0 ||
        mipreferencia["misal_pral"] == mipreferencia["segundoidioma"]) {
        mitexto +=
            " div, div .re , hr .re { float: left; width: 100%; } ." +
                mimisal_1 +
                " , .lengua1 { float: left; width: 98%; display: block; } .botonlengua { background-image: none; padding-left: 0; padding-right: 0; } ";
    }
    else if (mipreferencia["presentaciontexto"] == 1) {
        mitexto +=
            " div, div .re , hr .re { float: left; width: 100%; } ." +
                mimisal_1 +
                " , .lengua1 { float: left; width: 47%; display: block; } ." +
                mimisal_2 +
                " , .lengua2 { float: right; display: block; width: 47%; margin-right: 1%;} .botonlengua { background-image: none; padding-left: 0; padding-right: 0; } h1 { width: 80%; }";
    }
    else if (mipreferencia["presentaciontexto"] == 2) {
        mitexto +=
            " div, div .re , hr .re { float: left; width: 100%; } ." +
                mimisal_1 +
                " , .lengua1 { float: left; width: 98%; display: block; } ." +
                mimisal_2 +
                " , .lengua2 { float: left; display: none; width: 98%; } .botonlengua { background-image: none; padding-left: 0; padding-right: 0; } ";
    }
    if (mipreferencia["presentaciontexto"] != 1) {
        // presentacionrespuestas:     1    idioma misal    2 segundo idioma    3    ambos(filas)    4    ambos(columnas)    5    cambio tocando el texto
        if (mipreferencia["presentacionrespuestas"] == 1 ||
            mipreferencia["presentacionrespuestas"] == 5 ||
            mipreferencia["misal_pral"] == mipreferencia["segundoidioma"]) {
            mitexto += " .pueblo ." + mimisal_2 + " { width: 98%; display: none; } ";
            mitexto += " .pueblo ." + mimisal_1 + " { width: 98%; display: block;} ";
        }
        else if (mipreferencia["presentacionrespuestas"] == 2) {
            mitexto += " .pueblo ." + mimisal_1 + " { width: 98%; display: none; } ";
            mitexto += " .pueblo ." + mimisal_2 + " { width: 98%; display: block; } ";
        }
        else if (mipreferencia["presentacionrespuestas"] == 3) {
            mitexto +=
                " .pueblo ." +
                    mimisal_1 +
                    " , .pueblo ." +
                    mimisal_2 +
                    " { width: 98%; display: block; float: left; } ";
        }
        else if (mipreferencia["presentacionrespuestas"] == 4) {
            mitexto +=
                " .pueblo ." +
                    mimisal_1 +
                    " { width: 47%; display: block; float: left; } .pueblo ." +
                    mimisal_2 +
                    " { width: 47%; display: block; float: right; } ";
        }
    }
    else {
        mitexto +=
            " .pueblo ." +
                mimisal_1 +
                " { width: 47%; display: block; float: left; } , .pueblo ." +
                mimisal_2 +
                " { width: 47%; display: block; float: right; } ";
    }
    mitexto += " .misal_" + mimisal_1 + " { display: inline-block; } ";
    if (mipreferencia["presentaciontexto"] != 1) {
        mitexto +=
            " .solodos { text-align: right; } .solodos span { margin-right: 10%; } ";
    }
    else
        mitexto += " .solodos { text-align: center; } ";
    if (miciclo == "A") {
        mitexto +=
            " .cicloB { display: none; } .cicloC { display: none; } .cicloA { display: block; } ";
    }
    else if (miciclo == "B") {
        mitexto +=
            " .cicloA { display: none; } .cicloC { display: none; } .cicloB { display: block; } ";
    }
    else if (miciclo == "C")
        mitexto +=
            " .cicloA { display: none; } .cicloB { display: none; } .cicloC { display: block; } ";
    if (tipoanno == "impar") {
        mitexto +=
            " .annosecundo { display: none; } .annoprimo { display: block; } ";
    }
    else if (tipoanno == "par")
        mitexto +=
            " .annoprimo { display: none; } .annosecundo { display: block; } ";
    var parcial = getUrlVars()["parcial"];
    if (typeof parcial === "undefined")
        mitexto += " .parcial { display: block; } ";
    var _s2 = document.createElement('style'); _s2.textContent = mitexto; document.head.appendChild(_s2);
}
function pinta_botones(directorio, pestana) {
    // Esta funcin, además de poner los botones al final de la página, pone las preferencias en los links, y esconde cosas según las preferencias.
    pon_pref("cambiartamano", 0);
    var miarchivo = parseURL(window.location.href).file;
    directorio2 = "";
    // if (pestana=='o') { pag_origen='ordinario/ordinario.html'; } else
    // if (pestana=='t') { pag_origen='indice_tiempos.html'; } else
    // if (pestana=='s') { pag_origen='indice_santos.html'; } else
    // if (pestana=='c') { pag_origen='indice_comunes.html'; } else
    // if (pestana=='le') { pag_origen='indice_lecturas.html'; } else
    // if (pestana=='pf') { pag_origen='indice_prefacios.html'; } else
    // if (pestana=='pe') { pag_origen='indice_pleg_euc.html'; } else
    // if (pestana=='i') { pag_origen='indice_ogmr.html'; }
    pag_origen = directorio2 + pag_origen;
    // menu diamante
    nuevoidioma2 = mipreferencia["misal_pral"];
    nuevoidioma1 = mipreferencia["segundoidioma"];
    masgrande = Number(mipreferencia["tamanotexto"]) + 1;
    maspeq = Number(mipreferencia["tamanotexto"]) - 1;
    texto =
        "<div id=menu_diamante style='  position: absolute;  bottom: 2em;  left: 50%;  transform: translateX(-50%);  width: auto;  font-weight: bold;  display: none;  z-index: 30000;  text-align: left;' ><ul class=ul_normal id=tab_diamante>";
    texto += esIOS ? "" : "<li ontouchend=\"navigator.app.exitApp()\"><img src=\"../exit.png\" style=\"height: 1.2em;\" /></li>";
    texto +=
        "<li id=indexdiamante ontouchend=\" cambia_vista('menu_diamante'); window.location='" +
            directorio2 +
            "feria_actual.html' ; return false; \")'><img src=\"../calendario_blanco.png\" style=\"height:1.3em;\"></li>";
    if (pestana != "dev" && pestana != "sac") {
        texto +=
            "<li id='ic_indice' style='display:none; ' ontouchend=\" carga_indice(mipestana); cambia_vista('menu_diamante');\"><img  src=\"../indice_blanco.png\" style=\"height:1.3em;\"></li>";
    }
    if (mipreferencia["tipoletra"] == 1) {
        nuevaletra = 0;
    }
    else
        nuevaletra = 1;
    if (nuevoidioma2 != nuevoidioma1 && mipreferencia["presentaciontexto"] != 0) {
        texto +=
            "<li ontouchend=' cambia_idiomas(nuevoidioma1,nuevoidioma2); myScroll.refresh();' >" +
                '<img src="../dos_colum.png" alt="Icono" style="height: 1.2em;"> &nbsp;<=>&nbsp; <img src="../una_colum.png" alt="Icono" style="height: 1.2em;">' +
                "</li>";
    }
    // window.location.reload();
    // $(\".\"+mimisal_1).css(\"display\", \"none\"); $(\".\"+mimisal_2).css(\"display\", \"block\"); ayuda=mimisal_2 ; mimisal_2=mimisal_1 ; mimisal_1 = ayuda; myScroll.refresh;
    texto += '<li ontouchend="event.stopPropagation();cambia_vista(\'menu_diamante\'); window.location=\'preferencias.html\'; return false" ><img src="../gear.png" alt="Icono" style="height: 1.2em;" /></li>' +
        '<li ontouchend=\'cambia_vista("menu_diamante"); window.location="' +
        directorio2 +
        "ayuda.html\"; return false' >" +
        "<img src=\"../interrogacion_rojo.png\" style=\"height:1.3em;\">" +
        "</li>";
    // texto+="<li ontouchend='pon_pref(\"libro\",$(\"#scroller\").html()); window.location=\""+directorio2+"modolibro.html\"; return false; ' ><img style='height: 1em;' id='bot_libro' src=\""+directorio+"libro.png\"></li>";  //
    texto +=
        "<li id=menunoche ontouchend='event.stopPropagation(); cambia_vista(\"menu_diamante\"); pon_noche();'  ><img style='height: 1em;' id='bot_noche' src='" +
            directorio +
            "noche.png'></li>";
    texto +=
        "<li ontouchend='cambia_pref(\"tipoletra\", nuevaletra ); cambia_fuente(); myScroll.refresh(); ' ><span style=' font-family: Times New Roman; '>ABC</span> &nbsp;&#9664;&#xFE0E; &#9654;&#xFE0E;&nbsp; <span style=' font-family: Arial; '>ABC</span></li>";
    texto +=
        "<li id='titulo002' ontouchend='cambia_pref(\"tamanotexto\", masgrande ); cambia_tamanoletra(masgrande); myScroll.refresh();' >" +
            mipreferencia["tamanotexto"] +
            "&nbsp;&#9654;&#xFE0E;&nbsp;<span style=' font-size: " +
            masgrande +
            "pt; '>" +
            masgrande +
            "</span>" +
            "</li>";
    texto +=
        "<li id='titulo003' ontouchend='cambia_pref(\"tamanotexto\", maspeq ); cambia_tamanoletra(maspeq); myScroll.refresh(); ' >" +
            mipreferencia["tamanotexto"] +
            "&nbsp;&#9654;&#xFE0E;&nbsp;<span style=' font-size: " +
            maspeq +
            "pt; '>" +
            maspeq +
            "</span>" +
            "</li>";
    texto +=
        '<li ontouchend=\'modocopia = ! modocopia ; if (modocopia) { myScroll.disable(); $(this).css("background-color","green"); } else {myScroll.enable(); $(this).css("background-color","maroon"); }; cambia_vista("menu_diamante"); \' ><img style=\'height: 1em;\' id=\'bot_copy\' src="' +
            directorio +
            'copy-icon.png"></li>';
    texto += "</ul></div>";
    document.body.insertAdjacentHTML('beforeend', texto);
    if (mipreferencia["botoneszurdos"] == 1) {
        boton2 =
            '<li class=botonabajo ontouchend="botonPantArriba();"><img id=\'bot_arriba\' src="' +
                directorio +
                'angle-double-up2.png" style=" height: 1.6em;" border=0 ></li>';
        boton1 =
            '<li class=botonabajo ontouchend="botonPantAbajo();"><img id=\'bot_abajo\' src="' +
                directorio +
                'angle-double-down2.png" style=" height: 1.6em;"></li>';
    }
    else {
        boton1 =
            '<li class=botonabajo ontouchend="botonPantArriba();"><img id=\'bot_arriba\' src="' +
                directorio +
                'angle-double-up2.png" style=" height: 1.6em;" border=0 ></li>';
        boton2 =
            '<li class=botonabajo ontouchend="botonPantAbajo();"><img id=\'bot_abajo\' src="' +
                directorio +
                'angle-double-down2.png" style=" height: 1.6em;"></li>';
    }
    var margenInferior = esIOS ? "env(safe-area-inset-bottom)" : mipreferencia['margen_inferior'] + "em";
    var texto = "<div id=piedepantalla class=gradienterojo style=' padding-bottom: "
        + margenInferior + "; font-size: "
        + mipreferencia["tamanomenus"] + "pt; z-index: 30000;' >";
    //siempre visibles
    texto += "<ol id=menupie >" + boton1;
    texto +=
        "<li ontouchend=\"if ($('#bot_atras').css('visibility') !== 'hidden') boton_atras(mipestana);\"'><img id='bot_atras' src=\"" +
            directorio +
            'chevron-left2.png" style=" height: 1.6em" ></li> ';
    texto +=
        "<li class=botonabajo ontouchend=\"if ($('#bot_grabar').css('visibility') !== 'hidden') {cambia_titulos(); cambia_vista('menu_grabar');}\"'><img id='bot_grabar' src=\"" +
            directorio +
            'bookmark-o2.png" style=" height: 1.6em" ></li> ';
    texto +=
        "<li ontouchend=\"cambia_vista('menu_diamante');\"><img id='bot_indice' src=\"" +
            directorio +
            'asterisk2.png" style=" height: 1.6em;" ></li> ';
    texto +=
        "<li class=botonabajo ontouchend=\"if ($('#bot_rombo').css('visibility') !== 'hidden') {cambia_titulos(); cambia_vista('menu_ira');} \"'><img id='bot_rombo' src=\"" +
            directorio +
            'goto_bookmark2.png" style=" height: 1.6em" ></li> ';
    texto +=
        "<li ontouchend=\"if ($('#bot_adelante').css('visibility') !== 'hidden')boton_adelante(mipestana);\"><img id='bot_adelante' src=\"" +
            directorio +
            'chevron-right2.png" style=" height: 1.6em;" ></li> ';
    texto += boton2 + "</ol>";
    texto += "</div>";
    // ponemos ahora los botones.
    document.body.insertAdjacentHTML('beforeend', texto);
    var miarchivo = parseURL(window.location.href).file;
    if (typeof parcial != "undefined") {
        if (miarchivo != "ordinario.html" && miarchivo != "bendiciones.html")
            $("#parcial_" + parcial)
                .removeClass("novisibleb")
                .addClass("visibleb");
    }
    // }
    // arreglaCarga(mipestana)
    //navigator.app.exitApp();
}
function pon_pref(key, value) {
    //alert("pon hola77" + key)
    //console.log('Guardo: '+value + ' ... --> ... ' + key)
    window.localStorage.setItem(key, value);
}
function saveUltimo(pestana) {
    // console.log('embutidos al comienzo de saveUltimo '+embutidos)
    //console.log("La llamada a grabar el sitio es desde: " + arguments.callee.caller.toString())
    if (pestana == 'o' || puntero != 500)
        pon_pref("lh" + pestana + puntero, $("#tab_" + pestana).html());
    pon_pref("scroll_" + pestana + puntero, miposicion);
}
function carga_indice(pestanaloc, opcion) {
    if (opcion === void 0) { opcion = 0; }
    switch (pestanaloc) {
        case "o":
            return;
        case "t":
            pag_origen = "m_estructura/indices/m_estructura_indice_tiempos.html";
            break;
        case "s":
            pag_origen = "m_estructura/indices/m_estructura_indice_santos.html";
            break;
        case "c":
            pag_origen = "m_estructura/indices/m_estructura_indice_comunes.html";
            break;
        case "le":
            pag_origen = "m_estructura/indices/m_estructura_indice_lecturas.html";
            break;
        case "pf":
            pag_origen = "m_estructura/indices/m_estructura_indice_prefacios.html";
            break;
        case "pe":
            pag_origen = "m_estructura/indices/m_estructura_indice_pleg_euc.html";
            break;
        case "i":
            pag_origen = "m_estructura/indices/m_estructura_indice_ogmr.html";
            break;
    }
    carga_pagina(pag_origen).then(function (contenido) {
        // Aquí puedes hacer algo con el contenido si es necesario
        // Por ejemplo, asignarlo a un elemento específico
        $("#tab_" + pestanaloc).html(contenido);
        if (opcion == 0)
            pon_pref("lh" + pestanaloc + "_tope", 500);
        if (opcion == 0)
            pon_pref("lh" + pestanaloc + "_ultimo", 500);
        if (mipreferencia["fondo"] == 1) {
            $(" .boton ").each(function () {
                $(this).removeClass("boton").addClass("botonBueno");
            });
        }
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
        arreglaCarga(pestanaloc);
        puntero = 500;
        saveUltimo(pestanaloc);
        myScroll.refresh();
        myScroll.scrollTo(0, 0, 0, false);
    });
}
function ejecutarCargaYRecarga(origenURL) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, carga_comun(origenURL)];
                case 1:
                    _a.sent();
                    window.location.reload();
                    return [2 /*return*/];
            }
        });
    });
}
function carga_comun(origenURL) {
    return carga_pagina(origenURL).then(function (contenido) {
        $("#tab_c").html(contenido);
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
        ];
        for (var index = 0; index < partespos.length; ++index) {
            pon_pref("x_com_" + partespos[index], "nada");
        }
        pon_pref("lhc_ultimo", 501);
        pon_pref("lhc_tope", 501);
        pon_pref("lhc501", contenido);
        for (var index5 = 0; index5 < partespos.length; ++index5) {
            if ($("#tab_c .x_" + partespos[index5]).length) {
                var midiv2 = $("#tab_c .x_" + partespos[index5]).outerHTML();
                pon_pref("x_com_" + partespos[index5], midiv2);
                $("#x_com_" + partespos[index5]).html(midiv2);
            }
            else {
                pon_pref("x_com_" + partespos[index5], "nada");
            }
        }
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    });
}
function carga_lectura(origenURL, elemento, lugar) {
    carga_pagina(origenURL).then(function (contenido) {
        $("#" + lugar).html("<div>" + contenido + "</div>");
        $("." + elemento)
            .closest(".txt_" + elemento.substr(2))
            .removeClass("visibleb")
            .addClass("novisibleb");
        $(".cursores , .respuesta").remove();
        $(elemento).children(".dia").removeClass("novisibleb").addClass("visibleb");
        $("#" + lugar)
            .removeClass("novisibleb")
            .addClass("visibleb");
        $("#bot_" + elemento.substr(2) + "_res")
            .siblings(".noactivo")
            .removeClass("noactivo")
            .addClass("activo");
        $("#bot_" + elemento.substr(2) + "_res").addClass("noactivo");
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    });
}
function carga_prefacio(origenURL) {
    carga_pagina(origenURL).then(function (contenido) {
        $("#x_pf_prefacio").html(contenido);
        $(".cursores , .respuesta").remove();
        $("#x_prefacio")
            .children(".dia")
            .removeClass("novisibleb")
            .addClass("visibleb");
        $(".cursores").remove();
        $("#x_pf_prefacio h2").each(function () {
            $(this)
                .after("<h4>" + $(this).html() + "</h4>")
                .remove();
        });
        $("#x_pf_prefacio .dia").removeClass("novisibleb").addClass("visibleb");
        $("#bot_prefacio .bot_pf")
            .removeClass("noactivo")
            .addClass("activo")
            .trigger("touchend")
            .trigger("click");
        pon_pref("x_pf_prefacio", $("#x_pf_prefacio").outerHTML());
        if ($("#x_tmp_titulo .soy_octava_pascua").length > 0)
            $(".octava_pascua").addClass("visibleb");
        $("#x_pf_prefacio h2").each(function () {
            $(this)
                .after("<h4>" + $(this).html() + "</h4>")
                .remove();
        });
        if (mipestana == "o") {
            $(".meter_aqui, .santus148")
                .removeClass("visibleb")
                .addClass("novisibleb");
            ajusta_idiomas(nuevoidioma1, nuevoidioma2);
        }
    });
}
function carga_bendicion(origenURL, lugar, elemento) {
    carga_pagina(origenURL).then(function (contenido) {
        if (mipestana != "o") {
            contenido = "<br>" + contenido;
        }
        $(lugar).html("<div>" + contenido + "</div>");
        //$("#" + lugar + " ." + elemento).hide()
        //$(elemento).addClass("visibleb")
        ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    });
}
function cambia_a_pest(pestanaloc, destino) {
    if (destino === void 0) { destino = null; }
    contenedor.style.overflow = "hidden";
    saveUltimo(mipestana);
    contenedor.style.overflow = "";
    console.log("de " + mipestana + " " + miposicion);
    puntero = dime_pref("lh" + pestanaloc + "_ultimo", "noExiste");
    tope = dime_pref("lh" + pestanaloc + "_tope", 500);
    posicion = parseInt(dime_pref("scroll_" + pestanaloc + puntero, 1)) || 0;
    if (pestanaloc == "o") {
        $('#ic_indice').hide();
        inicia_ord();
    }
    else {
        $('#ic_indice').show();
    }
    $("#tab_" + mipestana).html("");
    if (puntero != 500) {
        $("#tab_" + pestanaloc).html(dime_pref("lh" + pestanaloc + puntero));
    }
    else {
        carga_indice(pestanaloc);
    }
    $("#bot_adelante").css("visibility", puntero == tope ? "hidden" : "visible");
    $("#bot_atras , #boton_atras2").css("visibility", puntero == 500 ? "hidden" : "visible");
    $("ul.pestanas").removeClass("tabnav_o tabnav_t tabnav_s tabnav_c tabnav_le tabnav_pf tabnav_pe");
    $(".cont_tab").css("display", "none");
    if (pestanaloc == mipestana) {
        setTimeout(function () { return toggle_pestanas(0); }, 20);
    }
    $("ul.pestanas").addClass("tabnav_" + pestanaloc);
    $("#tab_" + pestanaloc).css("display", "block");
    mipestana = pestanaloc;
    // Atualiza o visual do segmented tabs (novo estilo)
    if (typeof updateSegmentedActive === 'function') {
        updateSegmentedActive(pestanaloc);
    }
    arreglaCarga(mipestana);
    ajusta_idiomas(nuevoidioma1, nuevoidioma2);
    console.log("Ir a pestaña " + pestanaloc + " con scroll a: " + posicion);
    // Espera a que el contenido esté realmente cargado antes de intentar hacer scroll
    var esperarElemento = function (id, timeout) {
        if (timeout === void 0) { timeout = 2000; }
        return new Promise(function (resolve, reject) {
            var el = document.getElementById(id);
            if (el)
                return resolve(el);
            var contenedorTab = document.getElementById("tab_" + pestanaloc);
            if (!contenedorTab)
                return reject(new Error("Contenedor de pestaña no existe"));
            var observer = new MutationObserver(function () {
                var el2 = document.getElementById(id);
                if (el2) {
                    observer.disconnect();
                    resolve(el2);
                }
            });
            observer.observe(contenedorTab, {
                childList: true,
                subtree: true
            });
            setTimeout(function () {
                observer.disconnect();
                reject(new Error("Elemento no apareció: " + id));
            }, timeout);
        });
    };
    // Lanzar scroll cuando todo esté en su sitio
    setTimeout(function () {
        // cargado2 agora é chamado dentro de inicia_ord() após carregar o conteúdo
        // Removido aqui para evitar chamada duplicada
        var hacerScroll = function () {
            try {
                if (typeof myScroll !== 'undefined') {
                    myScroll.refresh();
                    if (destino) {
                        scrollAElementoManual(destino);
                    }
                    else {
                        myScroll.scrollTo(0, posicion, 0, false);
                    }
                }
                else {
                    console.warn("myScroll no está definido");
                }
            }
            catch (err) {
                var fullMessage = [
                    '🧨 Error atrapado en setTimeout',
                    "SO: ".concat(osInfo),
                    "Dispositivo: ".concat(deviceInfo),
                    "Mensaje: ".concat(err.message),
                    "Stack:\n".concat(err.stack || 'No hay stack disponible')
                ].join('\n');
                console.error(fullMessage);
                alert(fullMessage);
            }
        };
        // Espera un poco extra por seguridad antes de lanzar scroll
        setTimeout(hacerScroll, 300);
    }, 0);
    return;
}
function scrollAElementoManual(destinoId) {
    var el = document.getElementById(destinoId);
    var scroller = document.getElementById('scroller');
    if (!el || !scroller || typeof myScroll === 'undefined')
        return;
    var y = 0;
    var node = el;
    while (node && node !== scroller) {
        y += node.offsetTop;
        node = node.offsetParent;
    }
    myScroll.refresh();
    myScroll.scrollTo(0, -y, 300);
}
function sitioultimo(pestana) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            puntero = dime_pref("lh" + pestana + "_ultimo", "noExiste");
            tope = dime_pref("lh" + pestana + "_tope", 500);
            posicion = dime_pref("scroll_" + pestana + puntero, 1);
            //  vervariables = ''
            $("#tab_" + pestana).html(dime_pref("lh" + pestana + puntero));
            $("#tab_" + pestana).css("display", "block");
            if (puntero == tope) {
                $("#bot_adelante").css("visibility", "hidden");
            }
            else
                $("#bot_adelante").css("visibility", "visible");
            if (puntero == 500) {
                $("#bot_atras , #boton_atras2").css("visibility", "hidden");
            }
            else
                $("#bot_atras , #boton_atras2").css("visibility", "visible");
            arreglaCarga(pestana);
            myScroll.refresh();
            myScroll.scrollTo(0, posicion, 0, false);
            return [2 /*return*/];
        });
    });
}
function vete_a(miurl) {
    carga_pagina(miurl).then(function (contenido) {
        //alert(contenido)
        saveUltimo(mipestana);
        if (puntero < 510)
            puntero++;
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
function vete_a2(miurl) {
    cambia_a_pest("le");
    vete_a(miurl);
}
function muestraono(miId, siono) {
    //console.log('hola '+miId)
    $("#" + miId).removeClass("visibleb novisibleb");
    if (siono) {
        $("#" + miId)
            .removeClass("novisibleb")
            .addClass("visibleb");
    }
    else
        $("#" + miId)
            .removeClass("visibleb")
            .addClass("novisibleb");
    // ahora guardamos el nuevo estado de lo que hemos variado en la variable embutidos
    saveUltimo(mipestana);
    myScroll.refresh();
}
function embutir(miId, mivalor) {
    // no hace nada, pero la mantengo por compatibilidad
    //alert('embutidos :' + embutidos )
}
function cambia_tamanoletra(num) {
    $("body").css("font-size", num + "pt");
    maspeq = num - 1;
    masgrande = num + 1;
    $("#titulo002").html(mipreferencia["tamanotexto"] +
        "&nbsp;&#9654;&#xFE0E;&nbsp;<span style=' font-size: 120%; '>" +
        masgrande +
        "</span>");
    $("#titulo003").html(mipreferencia["tamanotexto"] +
        "&nbsp;&#9654;&#xFE0E;&nbsp;<span style=' font-size: 80%; '>" +
        maspeq +
        "</span>");
}
function sigTemp(elemento) {
    var siguienteTemporal = elemento.closest(".cursores").nextElementSibling;
    // Iterar hasta encontrar un siguiente hermano que sea visible
    while (siguienteTemporal && !esVisible(siguienteTemporal)) {
        siguienteTemporal = siguienteTemporal.nextElementSibling;
    }
    if (siguienteTemporal) {
        // Eliminar los elementos con clase 'boton'
        var botones_1 = siguienteTemporal.querySelectorAll(".botonBueno");
        botones_1.forEach(function (boton) { return boton.remove(); });
        // Devolver el contenido del elemento visible
        return siguienteTemporal.innerHTML;
    }
    else {
        return null; // Si no se encuentra un elemento visible
    }
}
// Función para verificar si un elemento es visible
function esVisible(elemento) {
    var estilo = getComputedStyle(elemento);
    return estilo.display !== "none" && estilo.visibility !== "hidden" && estilo.opacity !== "0";
}
function toggle_pestanas(valor) {
    if (mipreferencia["presentacionpestanas"] == 3) {
        if (valor == 1) {
            $('.pestanas').css("visibility", "visible");
            $("#cabecera_back").css("top", 0);
            $('#contenedor , #icono-sticky').css('top', "calc(".concat(margenSuperior, " + 2em)"));
            //    $('#cabecera').css('visibility','visible')
            pestanasactivas = 1;
            $("#cabecera_back").css("padding-top", margenSuperior);
            $("#cabecera_back").css("background", "black");
        }
        else {
            $('.pestanas').css("visibility", "hidden");
            $("#contenedor, #cabecera_back, #icono-sticky").css("top", margenSuperior);
            //    $('#cabecera').css('visibility','hidden')
            $("#cabecera_back").css("z-index", "50000");
            pestanasactivas = 0;
            $("#cabecera_back").css("background", "transparent");
        }
    }
}
function cambia_idiomas(idioma1, idioma2) {
    if (idioma1 == idioma2) {
        $("." + idiomas[idioma2]).attr("style", "float: left; width: 98%; display: block; ");
    }
    else {
        if (mipreferencia["presentaciontexto"] == 2) {
            cambia_pref("presentaciontexto", 1);
            $("." + idiomas[idioma2]).attr("style", "float: left; width: 47%; display: block; ");
            $("." + idiomas[idioma1]).attr("style", " float: right; display: block; width: 47%; margin-right: 1%; ");
        }
        else if (mipreferencia["presentaciontexto"] == 1) {
            cambia_pref("misal_pral", idioma1);
            cambia_pref("segundoidioma", idioma2);
            cambia_pref("presentaciontexto", 2);
            $("." + idiomas[idioma1]).attr("style", "float: left; width: 98%; display: block; ");
            $("." + idiomas[idioma2]).attr("style", " float: left; display: none; width: 98%; ");
            /*
            $(".misal_" + idiomas[idioma1]).attr(
              "style",
              "display: inline-block; margin: 1%; text-overflow: ellipsis; "
            ) */
            $(".misal_" + idiomas[idioma2]).hide();
            $(".misal_" + idiomas[idioma1]).show();
            nuevoidioma2 = mipreferencia["misal_pral"];
            nuevoidioma1 = mipreferencia["segundoidioma"];
            mimisal_1 = idiomas[idioma1];
            mimisal_2 = idiomas[idioma2];
        }
    }
}
function ajusta_idiomas(idioma1, idioma2) {
    // es como la anterior, sólo que no cambia los idiomas, sino que ajusta la presentación de las nuevas cargas
    if (idioma1 == idioma2) {
        $("." + idiomas[idioma2]).attr("style", "float: left; width: 98%; display: block; ");
    }
    else {
        if (mipreferencia["presentaciontexto"] == 1) {
            $("." + idiomas[idioma2]).attr("style", "float: left; width: 47%; display: block; ");
            $("." + idiomas[idioma1]).attr("style", " float: right; display: block; width: 47%; margin-right: 1%; ");
        }
        else if (mipreferencia["presentaciontexto"] == 2) {
            $("." + idiomas[idioma2]).attr("style", "float: left; width: 98%; display: block; ");
            $("." + idiomas[idioma1]).attr("style", " float: left; display: none; width: 98%; ");
            /*
            $(".misal_" + idiomas[idioma2]).attr(
              "style",
              "display: inline-block; margin: 1%;  text-overflow: ellipsis; "
            )*/
            $(".misal_" + idiomas[idioma1]).css("display", "none");
        }
    }
    if (mipreferencia["fondo"] == 1) {
        $(" .boton ").each(function () {
            $(this).removeClass("boton").addClass("botonBueno");
        });
    }
    var esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!esDispositivoMovil) {
        var elementos = document.querySelectorAll("[ontouchend]");
        elementos.forEach(function (elemento) {
            var contenido = elemento.getAttribute("ontouchend");
            elemento.removeAttribute("ontouchend");
            elemento.setAttribute("onclick", contenido);
        });
    }
    myScroll.refresh();
}
function cambia_fuente() {
    if (mipreferencia["tipoletra"] == 1) {
        $("body").css("font-family", "Times New Roman");
        nuevaletra = 0;
    }
    else {
        $("body").css("font-family", "Arial");
        nuevaletra = 1;
    }
}
function esperarCordova() {
    return new Promise(function (resolve) {
        if (!window.cordova) {
            console.log("[esperarCordova] Cordova no presente → navegador");
            return resolve();
        }
        var devicereadyHandler = function () {
            console.log("[esperarCordova] Cordova listo (deviceready)");
            resolve();
        };
        // Si ya está listo (en algunos dispositivos es instantáneo)
        if (document.readyState === "complete" || document.readyState === "interactive") {
            document.addEventListener("deviceready", devicereadyHandler, { once: true });
        }
        else {
            // Si todavía no está listo
            document.addEventListener("deviceready", devicereadyHandler, { once: true });
            document.addEventListener("DOMContentLoaded", function () {
                // Por si Cordova tarda más, esperamos unos ms adicionales
                setTimeout(function () {
                    if (!window.cordova.file) {
                        console.warn("[esperarCordova] Cordova sin plugins listos. Continuando igual.");
                    }
                    resolve();
                }, 1500); // Ajustable
            });
        }
    });
}
function carga_pagina(origenURL) {
    return __awaiter(this, void 0, void 0, function () {
        var misal_1, misal_2, partes, miPath, miArchivo, hash, idiomaUrl1, idiomaUrl2, estructuraData, idiomaData1, idiomaData2, safeGet, promesas, nuevoElemento, estructuraDom, resultado;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, esperarCordova()];
                case 1:
                    _a.sent();
                    misal_1 = mimisal_1;
                    misal_2 = mimisal_2;
                    partes = origenURL.split("/");
                    miPath = partes.slice(0, -1).join("/");
                    miArchivo = partes[partes.length - 1];
                    if (misal_1 == misal_2) {
                        if (misal_1 == 'cast') {
                            misal_2 = 'latin';
                        }
                        else
                            misal_2 = 'cast';
                    }
                    hash = origenURL.split("#")[1];
                    idiomaUrl1 = origenURL.replace(/estructura/gi, misal_1);
                    idiomaUrl2 = origenURL.replace(/estructura/gi, misal_2);
                    estructuraData = document.createElement("div");
                    idiomaData1 = document.createElement("div");
                    idiomaData2 = document.createElement("div");
                    safeGet = function (miurl, targetElement) {
                        return new Promise(function (resolve) {
                            var isIOS = window.cordova && cordova.platformId === "ios";
                            var isCordova = !!window.cordova;
                            var cleanUrl = miurl.split("#")[0];
                            var fallback = function () {
                                console.log("[safeGet] Fallback al navegador para", cleanUrl);
                                $.get(cleanUrl)
                                    .done(function (data) {
                                    $(targetElement).html(data);
                                    resolve(data);
                                })
                                    .fail(function () {
                                    console.warn("[safeGet] No se encontr\u00F3 (fallback): ".concat(cleanUrl));
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
                                        watchdog = setTimeout(function () {
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
                            }
                            else {
                                fallback();
                            }
                        });
                    };
                    if (!(miPath !== "m_estructura/indices")) return [3 /*break*/, 3];
                    promesas = [
                        safeGet(origenURL, estructuraData),
                        safeGet(idiomaUrl1, idiomaData1),
                        safeGet(idiomaUrl2, idiomaData2)
                    ];
                    // Esperar a que todas las promesas se completen sin fallar globalmente
                    return [4 /*yield*/, Promise.all(promesas)];
                case 2:
                    // Esperar a que todas las promesas se completen sin fallar globalmente
                    _a.sent();
                    if (hash) {
                        nuevoElemento = $(estructuraData).find("#" + hash).clone();
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
                        if (!match)
                            return; // Salta si no encuentra clase padre_xxx
                        var numero = match[1];
                        var hijoIdioma1 = $(idiomaData1).find(".hijo_" + numero);
                        if (hijoIdioma1.length > 0) {
                            $(this).append(hijoIdioma1);
                        }
                        var hijoIdioma2 = $(idiomaData2).find(".hijo_" + numero);
                        if (mimisal_1 !== mimisal_2 && hijoIdioma2.length > 0) {
                            $(this).append(hijoIdioma2);
                        }
                        $(this).removeClass("padre_" + numero);
                        // Eliminar clases "hijo" y "hijo_xxx" de los hijos recién añadidos
                        $(this).children().removeClass("hijo hijo_" + numero);
                    });
                    return [3 /*break*/, 5];
                case 3: 
                // Si estamos en "m_estructura/indices", solo cargamos origenURL
                return [4 /*yield*/, safeGet(origenURL, estructuraData)];
                case 4:
                    // Si estamos en "m_estructura/indices", solo cargamos origenURL
                    _a.sent();
                    _a.label = 5;
                case 5:
                    estructuraDom = $(estructuraData).get(0);
                    if (estructuraDom) {
                        estructuraDom.querySelectorAll("*").forEach(function (el) {
                            var removed = false;
                            el.classList.forEach(function (clase) {
                                if (clase.startsWith("hijo_")) {
                                    el.classList.remove(clase);
                                    removed = true;
                                }
                            });
                            if (removed) {
                                el.classList.remove("hijo");
                            }
                        });
                    }
                    else {
                        console.warn("estructuraData está vacío o no tiene elementos válidos:", origenURL);
                    }
                    resultado = $(estructuraData).html();
                    return [2 /*return*/, resultado];
            }
        });
    });
}
// -------------------------------------------------------- fin de funciones ------------------------------------------------------
var anterior = "";
var siguiente = "";
var puntero = 500;
var tope = 500;
var botonesactivos = 1;
var pestanasactivas = 0;
var mispestanas = "";
var pag_origen = "";
var miposicion = 0;
var hora_ant = new Array();
var hora = 0;
var mipreferencia = new Array();
var estoymac = dime_pref("estoymac", 0);
var esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes('Macintosh') && 'ontouchstart' in document);
if (!esIOS) {
    estoymac = false;
    $(".solo_android").css("display", "block");
    $(".solo_mac").css("display", "none");
}
else {
    estoymac = true;
    $(".solo_android").css("display", "none");
    $(".solo_mac").css("display", "block");
}
var embutidos = getUrlVars()["embutidos"];
var botones = "";
var colores = "";
if (typeof embutidos === "undefined" || embutidos == "undefined")
    embutidos = "";
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
mimisal_1 = idiomas[mipreferencia["misal_pral"]];
mimisal_2 = idiomas[mipreferencia["segundoidioma"]];
var midia = getUrlVars()["midia"];
if (typeof midia === "undefined")
    midia = 1;
var ayuda = 0;
var directorio2;
var myScroll;
var avancepantalla = mipreferencia["avance"];
// var respaldo_pref=preferencias
//var mipreferencia=preferencias['preferencia']
var ajuste = dime_pref("ajuste", 10);
var esperame = false;
if (window.cordova && cordova.platformId === "ios") {
    extras_ios = "#piedepantalla {padding-bottom: env(safe-area-inset-bottom);}body {padding-bottom: env(safe-area-inset-bottom);}#contenedor {bottom: -1.9em;}";
}
/*
window.addEventListener(
  "load",
  function () {
    setTimeout(loaded, ajuste * 20)
  },
  false
)
*/
