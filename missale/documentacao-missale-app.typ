#set document(title: "Documentação Técnica - Missale App", author: "Análise de Estrutura")
#set page(paper: "a4", margin: (x: 2cm, y: 2cm))
#set text(font: "Linux Libertine", size: 11pt, lang: "pt")
#set heading(numbering: "1.1.")
#set par(justify: true, leading: 0.65em)

#align(center)[
  #text(size: 24pt, weight: "bold")[Documentação Técnica]
  #v(0.3em)
  #text(size: 18pt)[Missale App - TEMPORA]
  #v(0.5em)
  #text(size: 12pt, style: "italic")[Análise Completa da Estrutura e Funcionamento]
  #v(1em)
  #line(length: 60%, stroke: 0.5pt)
]

#v(2em)

= Visão Geral do Aplicativo

O *Missale App* (também chamado *TEMPORA*) é um aplicativo híbrido desenvolvido com *Apache Cordova* para exibir o Missal Romano em múltiplos idiomas. O app funciona como uma WebView que renderiza conteúdo HTML/CSS/JavaScript, permitindo seu uso tanto em dispositivos móveis (Android/iOS) quanto em navegadores web.

== Tecnologias Utilizadas

- *Framework*: Apache Cordova (aplicativo híbrido)
- *Frontend*: HTML5, CSS3, JavaScript (ES6)
- *Bibliotecas JavaScript*: jQuery, jQueryUI, iScroll-lite
- *Calendário*: JSCalendar (biblioteca customizada)
- *Armazenamento*: LocalStorage para preferências do usuário
- *Plugins Cordova*:
  - `cordova-plugin-device`: Informações do dispositivo
  - `cordova-plugin-file`: Acesso ao sistema de arquivos
  - `cordova-plugin-globalization`: Internacionalização
  - `cordova-plugin-insomnia`: Manter tela ligada
  - `cordova-plugin-wkwebview-engine`: Motor WebKit para iOS

#pagebreak()

= Estrutura de Diretórios

A pasta `/www` contém todo o código-fonte da aplicação web:

```
www/
├── index.html              # Ponto de entrada (redireciona)
├── cordova.js              # Framework Cordova
├── cordova_plugins.js      # Registro dos plugins
├── jquery.js               # Biblioteca jQuery
├── jqueryui.js             # Biblioteca jQueryUI
├── jqueryui.css            # Estilos do jQueryUI
├── iscroll-lite.js         # Biblioteca de scroll suave
├── autocolumn.js           # Layout em colunas
├── ayudaweb.html           # Ajuda para versão web
├── css/
│   └── index.css           # Estilos iniciais
├── js/
│   └── index.js            # JavaScript inicial do Cordova
├── plugins/                # Plugins nativos do Cordova
│   ├── cordova-plugin-device/
│   ├── cordova-plugin-file/
│   ├── cordova-plugin-globalization/
│   └── cordova-plugin-insomnia/
└── misal_v2/               # CONTEÚDO PRINCIPAL DO APP
```

== Estrutura da Pasta `misal_v2/`

Esta é a pasta mais importante, contendo todo o conteúdo litúrgico:

```
misal_v2/
├── feria_actual.html           # Página principal (calendário)
├── misal_todo.html             # Visualização completa do missal
├── preferencias.html           # Configurações do usuário
├── devocionario.html           # Devocionário
├── ayuda.html                  # Ajuda
├── politica_misal.html         # Política de privacidade
├── misal.css                   # Estilos principais
├── devoc.css                   # Estilos do devocionário
├── mis_funciones_misal.js      # Funções principais (3691 linhas)
├── mis_funciones_devoc.js      # Funções do devocionário
├── jscalendar/                 # Biblioteca de calendário
├── igmr/                       # Instrução Geral do Missal Romano
├── sacerdotale/                # Orações do sacerdote
├── m_estructura/               # Estrutura base (template)
├── m_cast/                     # Conteúdo em Castelhano
├── m_latin/                    # Conteúdo em Latim
├── m_port/                     # Conteúdo em Português
├── m_engl/                     # Conteúdo em Inglês
├── m_fran/                     # Conteúdo em Francês
├── m_ital/                     # Conteúdo em Italiano
└── m_germ/                     # Conteúdo em Alemão
```

#pagebreak()

= Fluxo de Inicialização

O aplicativo segue este fluxo de inicialização:

#figure(
  rect(width: 100%, stroke: 0.5pt)[
    #set align(center)
    #set text(size: 10pt)
    #v(0.5em)
    `index.html` → Redirecionamento imediato
    #v(0.3em)
    ↓
    #v(0.3em)
    `misal_v2/feria_actual.html` → Página principal
    #v(0.3em)
    ↓
    #v(0.3em)
    Aguarda `deviceready` (Cordova) ou simula ambiente
    #v(0.3em)
    ↓
    #v(0.3em)
    Carrega preferências do `localStorage`
    #v(0.3em)
    ↓
    #v(0.3em)
    Inicializa `iScroll` para scroll suave
    #v(0.3em)
    ↓
    #v(0.3em)
    Calcula data litúrgica atual
    #v(0.3em)
    ↓
    #v(0.3em)
    Carrega conteúdo do Ordinário da Missa
    #v(0.5em)
  ],
  caption: [Fluxo de inicialização do aplicativo]
)

== Arquivo `index.html`

Este é o ponto de entrada do Cordova, mas apenas redireciona:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Iniciando Missal...</title>
    <script>
        window.location.href = "misal_v2/feria_actual.html";
    </script>
</head>
<body></body>
</html>
```

#pagebreak()

= Arquivo Principal: `feria_actual.html`

Este arquivo (6339 linhas) é o coração do aplicativo, contendo:

== Estrutura HTML

```html
<body>
  <!-- Cabeçalho fixo com título -->
  <div id="header">
    <div id="cabecera">
      <h1>TEMPORA</h1>
      <nav class="navbar">...</nav>
    </div>
  </div>
  
  <!-- Container principal com scroll -->
  <div id="contenedor">
    <div id="scroller">
      <!-- Conteúdo dinâmico carregado aqui -->
      <div id="tab_o">...</div>  <!-- Ordinário -->
      <div id="tab_t">...</div>  <!-- Tempo litúrgico -->
      <!-- Outras abas -->
    </div>
  </div>
  
  <!-- Rodapé fixo com navegação -->
  <div id="piedepantalla">
    <div class="navbar">...</div>
  </div>
</body>
```

== Simulação de Ambiente Móvel

Para funcionar em navegadores, o arquivo simula o ambiente Cordova:

```javascript
var esDispositivoMovil = false;
window.cordova = undefined;

// Simula plugins
window.plugins = { insomnia: { keepAwake: function(){} } };
navigator.app = { exitApp: function(){ console.log("Sair"); } };

// Simula informações do dispositivo
if (!window.device) {
    window.device = {
        platform: 'Browser',
        version: '1.0',
        manufacturer: 'PC',
        model: 'Chrome'
    };
}
```

#pagebreak()

= Sistema de Calendário Litúrgico

O app implementa um complexo sistema de cálculo do calendário litúrgico católico:

== Funções de Cálculo de Datas

```javascript
// Calcula a data da Páscoa (algoritmo de Gauss)
function domingo_pascua(anio) { ... }

// Calcula datas relacionadas à Páscoa
var fpascua = domingo_pascua(mifecha0.anio);
var fbautismo = bautismo(mifecha0.anio);
var fdom1adv = prim_adviento(mifecha0.anio);
var framos = suma_dias_a_fecha(fpascua, -7);
var fceniza = suma_dias_a_fecha(fpascua, -46);
var fascension = suma_dias_a_fecha(fpascua, 40);
var fpentecostes = suma_dias_a_fecha(fpascua, 49);
var ftrinidad = suma_dias_a_fecha(fpascua, 56);
var fcorpus = suma_dias_a_fecha(fpascua, 63);
```

== Ciclos Litúrgicos

O sistema calcula automaticamente o ciclo litúrgico (A, B ou C):

```javascript
var ciclos = ['A', 'B', 'C'];
var tiposanio = ['I', 'II'];  // Anos pares/ímpares

if (DiferenciaFechas(CadenaFecha, fdom1adv) >= 0) {
    aniociclo = eval(mifecha0.anio) + 1;
} else {
    aniociclo = mifecha0.anio;
}

miciclo = ciclos[(aniociclo - 1969) % 3];
mitipoanio = tiposanio[aniociclo % 2];
```

== Tempos Litúrgicos

O calendário identifica os seguintes períodos:
- *Advento*: 4 semanas antes do Natal
- *Natal*: 25 de dezembro até Batismo do Senhor
- *Tempo Ordinário I*: Após Batismo até Quaresma
- *Quaresma*: Quarta-feira de Cinzas até Páscoa
- *Tríduo Pascal*: Quinta, Sexta e Sábado Santos
- *Páscoa*: Domingo de Páscoa até Pentecostes
- *Tempo Ordinário II*: Após Pentecostes até Advento

#pagebreak()

= Sistema de Idiomas

O aplicativo suporta 8 idiomas, cada um em sua própria pasta:

#table(
  columns: (1fr, 2fr, 2fr),
  inset: 8pt,
  align: (center, left, left),
  [*Código*], [*Idioma*], [*Pasta*],
  [`cast`], [Castelhano (Espanhol)], [`m_cast/`],
  [`latin`], [Latim], [`m_latin/`],
  [`port`], [Português], [`m_port/`],
  [`engl`], [Inglês], [`m_engl/`],
  [`fran`], [Francês], [`m_fran/`],
  [`ital`], [Italiano], [`m_ital/`],
  [`germ`], [Alemão], [`m_germ/`],
  [`estructura`], [Template/Estrutura], [`m_estructura/`],
)

== Estrutura de Cada Pasta de Idioma

Cada pasta de idioma segue a mesma estrutura:

```
m_cast/  (exemplo para Castelhano)
├── ordinario/
│   ├── m_cast_ordinario.html         # Ordinário da Missa
│   ├── m_cast_bendiciones.html       # Bênçãos
│   ├── m_cast_oracion_fieles.html    # Oração dos Fiéis
│   └── m_cast_oraciones_pueblo.html  # Respostas do povo
├── tiempos/
│   ├── m_cast_tiempos_advnav.html    # Advento e Natal
│   ├── m_cast_tiempos_cuaresma.html  # Quaresma
│   ├── m_cast_tiempos_pascua.html    # Páscoa
│   ├── m_cast_tiempos_ordinario.html # Tempo Ordinário
│   └── m_cast_tiempos_semanasta*.html # Semana Santa
├── lecturas/                          # Leituras (~90 arquivos)
├── santos/                            # Santos por mês (12+ arquivos)
├── plegarias_euc/                     # Orações Eucarísticas
├── prefacios/                         # Prefácios
└── comunes_votivas/                   # Missas comuns e votivas
```

#pagebreak()

= Sistema de Carregamento Dinâmico

O conteúdo é carregado dinamicamente via AJAX:

== Função `carga_pagina()`

```javascript
function carga_pagina(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            dataType: 'html',
            success: function(data) {
                resolve(data);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}
```

== Exemplo de Uso

```javascript
// Carrega o Ordinário da Missa
carga_pagina("m_estructura/ordinario/m_estructura_ordinario.html")
    .then((contenido) => {
        $("#tab_o").html(contenido);
        arreglaCarga("o");
    });
```

== Ajuste de Idiomas

Após carregar o conteúdo, os idiomas são ajustados:

```javascript
function ajusta_idiomas(idioma1, idioma2) {
    // Mostra o idioma principal
    $("." + idioma1).css("display", "block");
    
    // Oculta ou mostra o segundo idioma
    if (idioma1 !== idioma2) {
        $("." + idioma2).css("display", "block");
    } else {
        $("." + idioma2).css("display", "none");
    }
}
```

#pagebreak()

= Estrutura do Conteúdo HTML

== Sistema de Classes CSS

O conteúdo utiliza um sistema de classes para identificar elementos:

```html
<!-- Estrutura no template (m_estructura) -->
<div class="padre padre_1">
    <!-- Container para inserir conteúdo -->
</div>

<!-- Conteúdo no idioma específico (m_cast) -->
<div class="cast hijo hijo_1" ontouchend="cambialengua(this)">
    <h1>ORDINARIO DE LA MISA</h1>
</div>
```

== Elementos de Interação

```html
<!-- Botão para expandir/colapsar seções -->
<div class="boton_mas">
    <span class="boton" ontouchend="muestraono('ritos_iniciais', true);">
        +
    </span>
</div>

<!-- Botão de opções litúrgicas -->
<div class="div-botones">
    <div class="bot_ord" ontouchend="activa_bot(this,'ord','global');">
        Ord
    </div>
    <div class="bot_tmp" ontouchend="activa_bot(this,'tmp','global');">
        Tmp
    </div>
</div>
```

== Rubricas e Formatação

As rubricas (instruções em vermelho) são identificadas por classes:

```html
<!-- Texto vermelho (rubrica) -->
<span class="red">El sacerdote dice:</span>

<!-- Texto do celebrante -->
<span class="cap">E</span>n el nombre del Padre...

<!-- Cruz vermelha -->
<span class="cruzroja">✠</span>
```

#pagebreak()

= Arquivo `mis_funciones_misal.js`

Este arquivo (3691 linhas) contém as funções principais:

== Funções de Preferências

```javascript
// Lê preferência do localStorage
function dime_pref(key, defecto) {
    var resultado = window.localStorage.getItem(key);
    if (resultado == null) resultado = defecto;
    return resultado;
}

// Salva preferência com tratamento de erro
function pon_pref(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        limpiarLocalStorageInteligente();
        try {
            localStorage.setItem(key, value);
        } catch (e2) {
            alert("Erro ao salvar preferência");
        }
    }
}
```

== Inicialização do iScroll

```javascript
myScroll = new iScroll("contenedor", {
    hScrollbar: false,
    vScrollbar: false,
    bounce: false,
    hideScrollbar: true,
    momentum: true,
    onBeforeScrollMove: function(e) {
        // Detecta swipe horizontal para "virar página"
        if (this.distX > 40 && this.absDistX > this.absDistY) {
            myScroll.scrollTo(0, -paginaAltura, 300, true);
        }
    },
    onScrollEnd: function() {
        // Salva posição do scroll
        pon_pref("scroll_" + mipestana + puntero, myScroll.y);
    }
});
```

== Sistema de Navegação por Abas

```javascript
function toggle_pestanas(indice) {
    // Oculta todas as abas
    $('[id^="tab_"]').css("display", "none");
    
    // Mostra a aba selecionada
    var abas = ['o', 't', 's', 'pf', 'pe', 'l'];
    var aba = abas[indice];
    $("#tab_" + aba).css("display", "block");
    
    // Atualiza indicador visual
    $(".navbar a").removeClass("active");
    $(".navbar a").eq(indice).addClass("active");
}
```

#pagebreak()

= Arquivo `mis_funciones_devoc.js`

Este arquivo (543 linhas) contém funções auxiliares e do devocionário:

== Função de Troca de Idioma

```javascript
function cambialengua(objeto) {
    // Alterna entre idioma principal e secundário ao tocar
    if (objeto.className == mimisal_2) {
        // Mostra idioma 1, oculta idioma 2
        $(padre).children("." + mimisal_1).css("display", "block");
        $(padre).children("." + mimisal_2).css("display", "none");
    } else if (objeto.className == mimisal_1) {
        // Mostra idioma 2, oculta idioma 1
        $(padre).children("." + mimisal_2).css("display", "block");
        $(padre).children("." + mimisal_1).css("display", "none");
    }
}
```

== Ajuste de Margens de Segurança (iOS)

```javascript
function getSafeAreaTop() {
    let testDiv = document.createElement("div");
    testDiv.style.cssText = 
        "position: absolute; top: 0; " +
        "height: env(safe-area-inset-top); visibility: hidden;";
    document.body.appendChild(testDiv);
    let safeAreaTop = testDiv.offsetHeight;
    document.body.removeChild(testDiv);
    return safeAreaTop || 0;
}

function arregla_top() {
    let safeAreaTop = getSafeAreaTop();
    $('#header').css('padding-top', 
        (parseInt(dime_pref('margen_superior_defecto', 0)) + safeAreaTop) + 'px'
    );
    $("#contenedor").css("top", $("#header").outerHeight(true) + "px");
}
```

== Função de Scroll para Elemento

```javascript
function scrollToElementWithOffset(element, offsetEm = 0) {
    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    
    const parent = document.getElementById('contenedor');
    const fontSize = parseFloat(getComputedStyle(element).fontSize);
    const offset = -offsetEm * fontSize;
    
    // Aplica offset adicional após o scroll terminar
    setTimeout(() => {
        parent.scrollBy({ top: offset, behavior: "smooth" });
    }, 100);
}
```

#pagebreak()

= Arquivo CSS: `misal.css`

O arquivo de estilos (1311 linhas) define toda a aparência:

== Classes de Formatação Litúrgica

```css
/* Texto em vermelho (rubricas) */
.red, .re { color: red; }

/* Negrito vermelho */
.rebo { color: red; font-weight: bold; }

/* Centralizado vermelho */
.rece { color: red; text-align: center; }

/* Cruz vermelha */
.cruzroja { color: red; font-size: 1.2em; }

/* Versaletes (inicial maiúscula) */
.cap { font-variant: small-caps; font-size: 1.2em; }

/* Texto do povo (respostas) */
.pueblo { font-weight: bold; }
```

== Classes de Layout

```css
/* Container principal */
#contenedor {
    position: absolute;
    top: 2.1em;
    bottom: -2em;
    left: 0;
    width: 100vw;
    overflow: auto;
}

/* Scroller interno */
#scroller {
    flex: 1;
    padding-top: 1em;
    touch-action: pan-y;
}

/* Texto incluído (citações) */
.texto_incluido {
    background-color: whitesmoke;
    padding: 0.5em;
    border-left: 3px solid maroon;
}
```

== Modo Noturno

```css
.noche {
    background-color: #121212;
    color: white;
}

.noche .texto_incluido {
    background-color: DarkSlateGray;
}
```

#pagebreak()

= Sistema de Preferências

O app armazena diversas preferências no `localStorage`:

#table(
  columns: (2fr, 3fr, 1fr),
  inset: 8pt,
  align: (left, left, center),
  [*Chave*], [*Descrição*], [*Padrão*],
  [`valor_noche`], [Modo noturno (0/1)], [`0`],
  [`mimisal_1`], [Idioma principal], [`cast`],
  [`mimisal_2`], [Idioma secundário], [`latin`],
  [`tamano_letra`], [Tamanho da fonte (%)], [`100`],
  [`margen_superior_defecto`], [Margem superior (px)], [`0`],
  [`margen_inferior_defecto`], [Margem inferior (px)], [`0`],
  [`pasarpagina_defecto`], [Virar página com swipe], [`1`],
  [`misintenciones`], [Intenções pessoais], [`---`],
  [`scroll_o*`], [Posição de scroll por aba], [`0`],
)

== Página de Preferências

O arquivo `preferencias.html` permite configurar:

- Idioma principal e secundário
- Tamanho da fonte
- Modo noturno
- Margens de segurança
- País/região litúrgica (Argentina, Brasil, etc.)
- Configurações de exibição de texto

#pagebreak()

= Plugins Cordova

== `cordova-plugin-device`

Fornece informações sobre o dispositivo:

```javascript
// Após deviceready
console.log(device.platform);     // 'Android', 'iOS', 'Browser'
console.log(device.version);      // '10.0'
console.log(device.manufacturer); // 'Samsung'
console.log(device.model);        // 'SM-G950F'
```

== `cordova-plugin-insomnia`

Mantém a tela ligada durante a leitura:

```javascript
window.plugins.insomnia.keepAwake();
// ou
window.plugins.insomnia.allowSleepAgain();
```

== `cordova-plugin-file`

Acesso ao sistema de arquivos (para cache offline):

```javascript
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    function(fs) {
        // Acesso ao sistema de arquivos
    }
);
```

== `cordova-plugin-globalization`

Internacionalização:

```javascript
navigator.globalization.getLocaleName(
    function(locale) {
        console.log('locale: ' + locale.value);
    }
);
```

#pagebreak()

= Biblioteca JSCalendar

O app utiliza uma versão customizada do JSCalendar para exibir o calendário litúrgico:

== Arquivos Principais

```
jscalendar/
├── calendar.js             # Lógica do calendário
├── calendar-setup.js       # Inicialização
├── calendar-brown.css      # Tema marrom (usado)
├── lang/
│   ├── calendar-lat.js     # Latim (padrão)
│   ├── calendar-es.js      # Espanhol
│   ├── calendar-pt.js      # Português
│   └── ...                 # Outros idiomas
└── skins/
    └── aqua/               # Tema alternativo
```

== Inicialização

```javascript
Calendar.setup({
    inputField: "fecha",
    button: "trigger",
    ifFormat: "%d.%m.%Y",
    daFormat: "%Y/%m/%d",
    onSelect: function(calendar, date) {
        // Callback quando data é selecionada
        actualizaFecha(date);
    }
});
```

#pagebreak()

= Tratamento de Erros

O app implementa um sistema global de captura de erros:

```javascript
function initGlobalErrorHandler() {
    let osInfo = 'SO desconocido';
    let deviceInfo = 'Dispositivo desconocido';
    
    document.addEventListener('deviceready', function() {
        if (window.device) {
            osInfo = `${device.platform} ${device.version}`;
            deviceInfo = `${device.manufacturer} ${device.model}`;
        }
    });
    
    // Captura erros JavaScript
    window.addEventListener('error', function(event) {
        const fullMessage = [
            '🛑 Error de JavaScript',
            `SO: ${osInfo}`,
            `Dispositivo: ${deviceInfo}`,
            `Mensaje: ${event.message}`,
            `Archivo: ${event.filename}`,
            `Línea: ${event.lineno}`
        ].join('\n');
        
        console.error(fullMessage);
        alert(fullMessage);
    });
    
    // Captura erros em Promises
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Promise rejeitada:', event.reason);
        alert('Erro em promise: ' + event.reason);
    });
}
```

#pagebreak()

= Fluxo de Exibição do Conteúdo

Quando o usuário seleciona uma data, o seguinte fluxo ocorre:

#figure(
  rect(width: 100%, stroke: 0.5pt)[
    #set align(left)
    #set text(size: 9pt)
    #v(0.5em)
    *1. Seleção da Data*
    #v(0.2em)
    `Calendar.onSelect()` → `actualizaFecha(date)`
    #v(0.5em)
    *2. Cálculo Litúrgico*
    #v(0.2em)
    Determina: tempo litúrgico, ciclo, santos do dia
    #v(0.5em)
    *3. Montagem dos Links*
    #v(0.2em)
    ```javascript
    mienlace_misa["dia"] = "m_estructura/tiempos/...#A123"
    mienlace_lecturas["dia"] = "m_estructura/lecturas/...#A123"
    ```
    #v(0.5em)
    *4. Carregamento Dinâmico*
    #v(0.2em)
    ```javascript
    carga_pagina(mienlace_misa["dia"]).then(...)
    ```
    #v(0.5em)
    *5. Ajuste de Idiomas*
    #v(0.2em)
    `ajusta_idiomas(mimisal_1, mimisal_2)`
    #v(0.5em)
    *6. Refresh do Scroll*
    #v(0.2em)
    `myScroll.refresh()`
    #v(0.5em)
  ],
  caption: [Fluxo de carregamento de conteúdo]
)

#pagebreak()

= Resumo da Arquitetura

#figure(
  rect(width: 100%, stroke: 0.5pt, inset: 15pt)[
    #set text(size: 10pt)
    #align(center)[
      #text(weight: "bold")[CAMADA DE APRESENTAÇÃO]
      #v(0.3em)
      HTML + CSS + iScroll
      #v(0.5em)
      ↕
      #v(0.5em)
      #text(weight: "bold")[CAMADA DE LÓGICA]
      #v(0.3em)
      JavaScript (jQuery + funções customizadas)
      #v(0.5em)
      ↕
      #v(0.5em)
      #text(weight: "bold")[CAMADA DE DADOS]
      #v(0.3em)
      LocalStorage + Arquivos HTML estáticos
      #v(0.5em)
      ↕
      #v(0.5em)
      #text(weight: "bold")[CAMADA NATIVA]
      #v(0.3em)
      Cordova + Plugins (Device, File, Insomnia)
    ]
  ],
  caption: [Arquitetura em camadas do aplicativo]
)

== Pontos Fortes

- *Conteúdo offline*: Todo o missal está embutido no app
- *Multi-idioma*: 8 idiomas suportados
- *Calendário completo*: Cálculo automático de todas as festas
- *Personalização*: Diversas preferências do usuário
- *Compatibilidade*: Funciona em mobile e navegador

== Pontos de Atenção

- *Tamanho*: Aproximadamente 63MB de conteúdo HTML
- *Manutenção*: Código legado com muita duplicação
- *Performance*: Carregamento síncrono em algumas partes
- *LocalStorage*: Limite de ~5MB pode ser atingido

#v(2em)
#align(center)[
  #line(length: 60%, stroke: 0.5pt)
  #v(0.5em)
  #text(style: "italic", size: 10pt)[
    Documentação gerada em dezembro de 2025
  ]
]
