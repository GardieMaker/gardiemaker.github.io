// Variables globales
var groupInfo = [], groupList = [], hayFondo = false;
const URL_CLOTHES = "item/player/", URL_SKIN = "player/skin/", URL_MOUTH = "player/mouth/",URL_EYES = "player/eyes/", URL_HAIR = "player/hair/";
const URL_ICON = "icon/", URL_FULL ="web_full/", URL_PORTRAIT = "web_hd/";
var localization = "";

// --------------------------------------------------

$(document).ready(function () {
    //localization = $("#change-lang").attr("current-lang");
    localization = $("html").attr("lang");

	$.get("https://raw.githubusercontent.com/GardieMaker/data/master/status/activities", function(estado, success, xhr) {
		if (!(window.location.href).includes("/es/")) {
            estado = estado.replace("No hay nuevas actividades", nav_notification);
        }
        document.getElementsByClassName("news-latest")[0].innerHTML = estado;
	});

    var dir = "../";
    if ((window.location.href).includes("127") || (window.location.href).includes("192")) { dir = "../../"; }; // local

    const requestInfo = new XMLHttpRequest();requestInfo.open("GET", dir + "data/groupInfo.json");
    requestInfo.responseType = "json";requestInfo.send();requestInfo.onload = function() {

        const requestList = new XMLHttpRequest();requestList.open("GET", dir + "data/groupList.json");
        requestList.responseType = "json";requestList.send();requestList.onload = function() {
            
            groupList = requestList.response; groupInfo = requestInfo.response;

            // Comprobar si URL valida + comprobar si hay que cargar gardi

            if (checkURL()) {
                var gotoProfile = (window.location.href).replace("wardrobe", "profile");
                $("#link-profile").attr("href", gotoProfile);
                if (window.location.search != "") {
                    cargarLista(); cargarGuardiana();
                } else {cargarLista()};
            } else {window.location.href = "wardrobe"};
        };
    };
});


// Funciones de carga
function checkURL() {
    // Comprueba si la URL es válida

    var str = window.location.search;

    if (str != "") {
        if (str.includes("?s=") && (str != "?s=")) {

            var checkN = str.split("&");
            var valido = true;

            // Comprobar si es código antiguo
            var busca = [];
            if (checkN[1] != undefined) busca = groupList.filter(v => {return v.itemId == checkN[1]});

            if (busca.length == 1) {
                // Es código antiguo
                var mensaje = '<p>Hola, hemos actualizado nuestro sistema de carga de guardianas.</p><p>Si estás leyendo este mensaje, es probable que hayas utilizado un código de carga con el formato antiguo. '
                + 'Estos códigos pueden fallar, por lo que es recomendable dejar de usarlos.</p>'
                + '<p>Se intentará actualizar el código y se recargará la página. Si se presenta algún problema, intenta cargar el código desde el PERFIL o desde el HOME.</p>'
                + '<p>Gracias por su comprensión y disculpen las molestias.</p>';
                var buttonMsg = "ACEPTAR";

                if (!(window.location.href).includes("/es/")) {
                    mensaje = '<p>' + onload_formatMsg_one + '</p><p>' + onload_formatMsg_two + '</p><p>' + onload_formatMsg_three + '</p><p>' + onload_formatMsg_four + '</p>';
                    buttonMsg = formatMsg_button;
                };

                $("body").append('<div id="alert-code-format"><span>' + mensaje + '<p><a class="button" onclick="reloadNewCode()">' + buttonMsg + '</a></p></span></div>');

            } else if (checkN[0].includes("?s=")) {
                // Lo que contenga CheckN[1] debe quitarse de la URL
                if (checkN[1] != undefined) {
                    history.replaceState(null, "", checkN[0]);
                };

                checkN = checkN[0].slice(3);
                checkN = checkN.split("i");

                checkN.forEach((element, i) => {checkN[i] = parseInt(element)});

                for (e = 0; e < checkN.length; e++) {
                    var existe = groupList.filter(v => {return v.itemId == checkN[e]});
                    if (existe.length != 1) {
                        if ((window.location.href).includes("/es/")) {
                            alert("El código no es válido.\n El vestidor se reiniciará.");
                        } else {
                            alert(error_alert_load);
                        }
                        valido = false; break;
                    };
                };
            };

            if (valido) {return true} else {return false};

        } else {return false};
    } else {return true};
};

function reloadNewCode(code = "") {
    if (code == "") {
        code = window.location.search;
        code = code.replace(/&/g, "i");
        window.location.search = code;    
    } else {
        var code = $("#input-code").val()
        code = code.replace(/&/g, "i");
        window.location.search = "?s=" + code;
    };
};

function cargarGuardiana(p = 0, edit = false) {
    var img, img2; 
    var str = window.location.search;
    str = str.slice(3);
    var customArray = str.split("i");

    // Obtener y preparar datos
    var prenda = groupList.filter(function(v){return v.itemId == customArray[p]});
    var grupo = groupInfo.filter(function(v){return v.groupId == prenda[0].groupId});

    switch (grupo[0].category) {
        case "Pieles": img = URL_SRC + URL_SKIN + URL_FULL + prenda[0].itemURL; break;
        case "Bocas": img = URL_SRC + URL_MOUTH + URL_FULL + prenda[0].itemURL; break;
        case "Ojos": img = URL_SRC + URL_EYES + URL_FULL + prenda[0].itemURL; break;
        case "Cabello": img = URL_SRC + URL_HAIR + URL_FULL + prenda[0].itemURL; break;
        default: img = URL_SRC + URL_CLOTHES + URL_FULL + prenda[0].itemURL;
    };

    if (grupo[0].category == "Fondos") {
        if (edit == false) { $("#marketplace-avatar-background-preview").css("background-image", "url(" + img + ")");} 
        else { 
            $("#edit-clothes-popup").css("background-image", "url(" + img + ")"); 
            $("#edit-clothes-popup").attr("data-bgpreviewid", prenda[0].itemId);
        };
        hayFondo = true;
    } else {
        // Crear canvas
        var canvas = "";
        if (edit) {
            canvas = '<canvas class="canvas-preview" data-previewid="' + prenda[0].itemId + '" width="420" height="594"></canvas>';
            $("#edit-preview").append(canvas);
            canvas = document.getElementsByClassName("canvas-preview");
        } else {
            canvas = '<canvas width="420" height="594"></canvas>';
            $("#marketplace-avatar-preview").append(canvas);
            canvas = document.getElementsByTagName("canvas");
        }
        
        
        
        var ctx;
        
        hayFondo ? ctx = canvas[p-1].getContext("2d") : ctx = canvas[p].getContext("2d")

        img2 = new Image();
        img2.onload = function() {
            ctx.drawImage(img2, 0, 0);
        };img2.src = img;
    };
    
    // Cargar prenda siguiente
    p++;
    if (p < customArray.length) {edit ? cargarGuardiana(p, true) : cargarGuardiana(p);};
};

function cargarLista(pag = 0, sub = 0, pagSub = null) {
    $("#marketplace-search-items").html("");
    $(".pagination").html("");

    const [categoria, especial, rareza, orden, buscador] = getFiltros();
    var info = [], prenda = [];

    // Preparar filtros
    if (sub == 0) {
        
        for (x = 0; x < groupList.length; x++) {prenda.push(groupList[x])};
        
        if (!esNumero(buscador) && !buscador.includes("#")) {
            // Filtrar desde groupInfo 
            for (g = 0; g < groupInfo.length; g++) {info.push(groupInfo[g])};

            if (categoria != "") {info = info.filter(v => {return v.category == categoria})};
            if (especial != "") {info = info.filter(v => {return v.especial == especial})};
            if (rareza != "") {info = info.filter(v => {return v.rarity == rareza})};
            if (orden == "newest") info.reverse();

            if (buscador != "") {
                if (!buscador.includes(":")) {
                    var nombre = normalize(buscador).toLowerCase();

                    if (localization == "es") {
                        info = info.filter(function(v){return (normalize(v.spanish).toLowerCase()).includes(nombre)});
                    } else if (localization == "en") {
                        info = info.filter(function(v){return (normalize(v.english).toLowerCase()).includes(nombre)});
                    } else if (localization == "fr") {
                        // Pendiente
                    } else if (localization == "pt_BR") {
                        info = info.filter(function(v){return (normalize(v.portuguese).toLowerCase()).includes(nombre)});
                    }

                } else {
                    // Búqueda por evento
                    var busca = buscador.split(":");
                    busca[0] = busca[0].toLowerCase();
                    var evento = "";

                    var lang = window.location.href;
                
                    if (!lang.includes("/es/")) {
                        if (lang.includes("/br/")) {
                            switch (busca[0]) {
                                case "a": busca[0] = "a"; break;
                                case "dn": busca[0] = "sv"; break;
                                case "p": busca[0] = "p"; break;
                                case "m": busca[0] = "m"; break;
                                case "je": busca[0] = "je"; break;
                                case "mo": busca[0] = "pm"; break;
                                case "v": busca[0] = "v"; break;
                                case "bf": busca[0] = "bf"; break;
                                case "h": busca[0] = "h"; break;
                                case "n": busca[0] = "n"; break;
                            };
                        };
                    };

                    switch (busca[0]) {
                        case "sv": evento = "San Valentín "; break;
                        case "a": evento = "1 de Abril "; break;
                        case "p": evento = "Pascua "; break;
                        case "m": evento = "Música "; break;
                        case "je": evento = "Japan Expo "; break;
                        case "pm": evento = "Pride Month "; break;
                        case "v": evento = "Verano "; break;
                        case "bf": evento = "Black Friday "; break;
                        case "h": evento = "Halloween "; break;
                        case "n": evento = "Navidad "; break;
                        default: evento = "";
                    };

                    evento += busca[1];
                    info = info.filter(v => {return v.note.includes(evento)});
                }
                
            };

            if ((window.location.href).includes("/es/")) {
                $("#footer-info").html("Mostrando " + info.length + " artículos de los " + groupList.length + " artículos disponibles.");    
            } else {
                var txt = item_counter.replace("$NUM0", info.length);
                txt = txt.replace("$NUM1", groupList.length);
                $("#footer-info").text(txt);
            };
            

        } else { // Busquedas manuales (25746, #shiny, #rainbow)
            // Filtrar desde groupList
            for (x = 0; x < groupInfo.length; x++) {info.push(groupInfo[x])};
            if (orden == "newest") prenda.reverse();

            if (esNumero(buscador)) {
                // Búsqueda por código (1 resultado)
                prenda = prenda.filter(v => {return v.itemId == buscador});

            } else if (buscador.includes("#")) {
                // Busqueda de opalos o arcoiris (>1 resultado)
                var color = buscador.slice(1);
                prenda = prenda.filter(v => {return v.color == color});
            };

            $("#footer-info").html("Mostrando " + prenda.length + " artículos de los " + groupList.length + " artículos disponibles.");
        };
    
    } else {
        // Cargar sublista
        info = groupInfo.filter(v => {return v.groupId == sub});
        prenda = groupList.filter(v => {return v.groupId == sub});

        if ((window.location.href).includes("/es/")) {
                $("#footer-info").html("Mostrando " + prenda.length + " artículos de los " + groupList.length + " artículos disponibles.");
            } else {
                var txt = item_counter.replace("$NUM0", prenda.length);
                txt = txt.replace("$NUM1", groupList.length);
                $("#footer-info").text(txt);
            };
    };

    // Dibujar DOM

    // Calcular items x pag segun tipo 
    var items = 7;

    if (sub == 0) {
        if (!esNumero(buscador) && !buscador.includes("#")) {
            pages = Math.ceil(info.length / items);
        } else {
            pages = Math.ceil(prenda.length / items); 
        };
        
        $("#filter-orderOptions").css("display", "inline-block");
    } else {
        items = 6; pages = Math.ceil(prenda.length / items);
        var txt = "", backText = "";
        if ((window.location.href).includes("/es/")) {
            txt = "Mostrando todas las variaciones de colores de ";
            backText = "Regresar";
        } else {
            txt = item_card_info;
            backText = item_card_back;
        };

        var regresa = '<div id="marketplace-search-title">' + txt + sub + '</div><div data-page="' + pag 
        + '" class="marketplace-abstract marketplace-search-back"><span class="marketplace-search-back-arrow"></span><p>' + backText + '</p></div>';
        $("#marketplace-search-items").append(regresa);

    };

    var elementoInicial = (sub == 0 ? pag * items : pagSub * items);
    var elementoFinal = elementoInicial + items;
    if (sub == 0 && !esNumero(buscador) && !buscador.includes("#")) {
        if (elementoFinal > info.length) elementoFinal = info.length;
    } else { // Filtros manuales
        if (elementoFinal > prenda.length) elementoFinal = prenda.length;
    }

    if (info.length == 0 || prenda.length == 0) {
        var dibujar = "";
        if ((window.location.href).includes("/es/")) {
            dibuja = '<span id="empty">No hay ningún objeto disponible en esta categoría.</span>';
        } else {
            dibuja = '<span id="empty">' + item_null + '</span>';
        }
        $("#marketplace-search-items").append(dibuja);
    }

    for (elementoInicial; elementoInicial < elementoFinal; elementoInicial++) {
        var currentGrupo = [], currentPrenda = [];

        // Información del loop actual 
        if (sub != 0) {
            currentGrupo = info.filter(v => {return v.groupId == sub});
            currentPrenda = prenda.filter(v => {return v.groupId == currentGrupo[0].groupId});
        } else if (sub == 0 ) {
            if (!esNumero(buscador) && !buscador.includes("#")) {
                currentGrupo.push(info[elementoInicial]);
                var temp = prenda.filter(v => {return v.groupId == currentGrupo[0].groupId});
                currentPrenda.push(temp[0]);
            } else {
                currentPrenda.push(prenda[elementoInicial]);
                var temp = info.filter(v => {return v.groupId == currentPrenda[0].groupId});
                currentGrupo.push(temp[0]);
            };
        };

        var img, rarity = currentGrupo[0].rarity;
        var looper = (sub == 0) ? 0 : elementoInicial;
        switch (currentGrupo[0].category) {
            case "Pieles": img = URL_SRC + URL_SKIN + URL_ICON + currentPrenda[looper].itemURL; break;
            case "Bocas": img = URL_SRC + URL_MOUTH + URL_ICON + currentPrenda[looper].itemURL; break;
            case "Ojos": img = URL_SRC + URL_EYES + URL_ICON + currentPrenda[looper].itemURL; break;
            case "Cabello": img = URL_SRC + URL_HAIR + URL_ICON + currentPrenda[looper].itemURL; break;
            default: img = URL_SRC + URL_CLOTHES + URL_ICON + currentPrenda[looper].itemURL;
        };

        if (currentPrenda[looper].rarity) rarity = currentPrenda[looper].rarity;

        switch(rarity) {
            case "Común": rarity = '<div class="rarity-marker-common"></div>'; break;
            case "Raro": rarity = '<div class="rarity-marker-rare"></div>'; break;
            case "Épico": rarity = '<div class="rarity-marker-epic"></div>'; break;
            case "Legendario": 
                if (currentGrupo[0].especial == "premios") {rarity = '<div class="anim-marker"></div>'} 
                else {rarity = '<div class="rarity-marker-legendary"></div>'} break;
            case "Evento": rarity = '<div class="rarity-marker-event"></div>';
        };

        if (currentGrupo[0].especial) {
            switch (currentGrupo[0].especial) {
                case "brillante":rarity += '<div class="tooltip guard-gem guard-1"></div>';break;
                case "obsidiana":rarity += '<div class="tooltip guard-gem guard-2"></div>';break;
                case "absenta":rarity += '<div class="tooltip guard-gem guard-3"></div>';break;
                case "sombra":rarity += '<div class="tooltip guard-gem guard-4"></div>';
            };
        };

        var leyenda = currentGrupo[0].note;
        if (currentPrenda[looper].note) leyenda = currentPrenda[looper].note;

        if (!(window.location.href).includes("/es/")) {
            leyenda = esToLang(leyenda);
        };

        var dibuja = '<li class="marketplace-abstract marketplace-search-item" data-groupid="' 
        + currentGrupo[0].groupId + '" data-itemid="' + currentPrenda[looper].itemId 
        + '"><div class="img-container"><img class="abstract-icon" src="' + img + '"/>' + rarity 
        + '</div><div class="abstract-container">'; 

        if (localization == "es") {
            var esp = currentGrupo[0].spanish;
            if (esp.includes("(x)")) { // No tiene traducción o no es oficial
                esp = esp.slice(3);
                dibuja+= '<div class="abstract-name undefined">' + esp;
            } else { // Disponible en español
                dibuja+= '<div class="abstract-name">' + currentGrupo[0].spanish;
            }
            
        } else if (localization == "en") {
            var eng = currentGrupo[0].english;
            if (eng.includes("(x)")) { // No tiene traducción o no es oficial
                eng = eng.slice(3);
                dibuja+= '<div class="abstract-name undefined">' + eng;
            } else { // Disponible en inglés
                dibuja+= '<div class="abstract-name">' + currentGrupo[0].english;
            }
        } else if (localization == "pt_BR") {
            var pt = currentGrupo[0].portuguese;
            if (pt.includes("(x)")) { // No tiene traducción o no es oficial
                pt = pt.slice(3);
                dibuja+= '<div class="abstract-name undefined">' + pt;
            } else { // Disponible en inglés
                dibuja+= '<div class="abstract-name">' + currentGrupo[0].portuguese;
            }
        }

        var grupoCat = currentGrupo[0].category;
        if (!(window.location.href).includes("/es/")) {
            grupoCat = esToLang(currentGrupo[0].category);
        };

        dibuja += '</div><div class="abstract-content"><div class="abstract-type">' + grupoCat 
        + '</div><div class="abstract-code"><div class="code-info"> COD. <span class="universal-code">'
        + currentPrenda[looper].itemId + '</span></div></div></div><div class="abstract-note">'
        + leyenda + '</div></div><div class="abstract-tags-container">';

        if (currentPrenda[looper].color != undefined) {
            dibuja += '<div class="abstract-tags">#' + currentPrenda[looper].color + '</div>';
        };
        var g_inc = "GRUPO INCOMPLETO";
        if (!(window.location.href).includes("/es/")) g_inc = card_tag_inclomplete;

        if (currentGrupo[0].tag == "incomplete") {dibuja += '<div class="abstract-tags incomplete">' + g_inc + '</div>'};
        
        if (subCheck(currentGrupo[0].groupId)) {
            var cuenta = groupList.filter(v => {return v.groupId == currentGrupo[0].groupId});
            cuenta = cuenta.length;
            var colores = "colores";
            if (!(window.location.href).includes("/es/")) {colores = card_tag_declinations;}

            dibuja += '<div class="abstract-tags">' + cuenta + ' ' + colores + '</div>';  
        };
        
        dibuja += '</div></li>';

        $("#marketplace-search-items").append(dibuja);
    };

    // Paginacion
    if (pages > 1) {
        (pagSub === null) ? pagination(pag, pages) : pagination(pagSub, pages);
    }
};

function pagination(activa, paginas) {
    var pagination = [];

    // Necesita truncation ?
    if (paginas < 12) {
        // No
        for (s = 0; s < paginas; s++) {
            var num = s + 1;
            if (s == activa) {
                pagination.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
            } else {
                pagination.push('<div class="page" page-number="' + num + '">' + num + '</div>');
            };
        };

    } else {
        // Requiere truncation
        if (activa < 7) {
            // Al inicio
            for (i = 0; i < paginas; i++) {
                var num = i + 1;
                if (i != 9) {
                    if (i == activa) {
                        pagination.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
                    } else {
                        pagination.push('<div class="page" page-number="' + num + '">' + num + '</div>');
                    };

                } else {
                    pagination.push('<span class="truncation">...</span>');
                    i = (paginas - 3);
                };
            };

        } else if ((paginas - 7) > activa && activa > 6) {
            // Al medio
            for (m = 0; m < paginas; m++) {
                var num = m + 1;
                if (m == 2 || m == (paginas - 3)) {
                    
                    pagination.push('<span class="truncation">...</span>');
                    if (m == 2) m = (parseInt(activa) - 4);
                } else {
                    if (m == activa) {
                        pagination.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
                    } else if (m == (parseInt(activa) + 4)) {
                        m = paginas - 4;
                    } else {
                        pagination.push('<div class="page" page-number="' + num + '">' + num + '</div>');
                    };
                };
            };

        } else if (activa >= paginas - 7) {
            // Al final
            for (f = 0; f < paginas; f++) {
                var num = f + 1;
                if (f == 2) {
                    pagination.push('<span class="truncation">...</span>');
                    f = (paginas - 10);
                } else {
                    if (f == activa) {
                        pagination.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
                    } else {
                        pagination.push('<div class="page" page-number="' + num + '">' + num + '</div>');
                    };
                };
            };
        };
    };

    var html = pagination.join("");
    $(".pagination").html(html);
};

/*
    1  2  3  4  5  6  7  8  9 10 11 12
    1  2  3  4  5  6  7 (8)  9 .. xx xx
    1  2  .. x (x)  x  x  x  x xx xx xx
    1  2  .. 4  5  6 (7)  8  9 10 .. 12 13
*/


// Funciones de interaccion (cargas y clasificaciones de prendas)
function checkPrenda(nuevaPrenda, nuevoGrupo) {
    var str = window.location.search;
    str = str.slice(3); var checkArray = str.split("i");

    var temp = groupInfo.filter(v => {return v.groupId == nuevoGrupo});
    var nuevaCategoria = temp[0].category;
    var temporalCanvas = false;

    if (str != "") {
        // Comprobar!
        var arrayGrupo = "", arrayCategoria = "";
        var cuentaVueltas = 0;

        for (c = 0; c < checkArray.length; c++) {
            cuentaVueltas++;
            // Obtener grupo > obtener categoria
            temp = groupList.filter(v => {return v.itemId == checkArray[c]});
            arrayGrupo = temp[0].groupId;
            temp = groupInfo.filter(v => {return v.groupId == arrayGrupo});
            arrayCategoria = temp[0].category;

            if (arrayGrupo == nuevoGrupo) {
                // Mismo grupo, misma prenda ?
                if (nuevaPrenda == checkArray[c]) {
                    //console.log("Misma prenda, quitar prenda");
                    if ((window.location.href).includes("/es/")) { $(".button.marketplace-itemDetail-set").text("QUITAR");
                    } else { $(".button.marketplace-itemDetail-set").text(canvas_button_remove); };
                    temporalCanvas = mostrarPrenda("remove", nuevaPrenda, nuevaCategoria, c);
                    break;

                } else {
                    //console.log("Mismo grupo, reemplaza color");
                    if ((window.location.href).includes("/es/")) { $(".button.marketplace-itemDetail-set").text("REEMPLAZAR");
                    } else { $(".button.marketplace-itemDetail-set").text(canvas_button_replace); };
                    temporalCanvas = mostrarPrenda("replace", nuevaPrenda, nuevaCategoria, c, checkArray[c]);
                    break;
                };

            } else if (arrayCategoria == nuevaCategoria) {

                if (nuevaCategoria == "Pieles" || nuevaCategoria == "Cabello" || nuevaCategoria == "Ojos" || nuevaCategoria == "Bocas" || nuevaCategoria == "Ropa interior" || nuevaCategoria == "Fondos") {
                    // Comprobar si es piel, cabello, ojos, boca, ropa interior, fondo

                    // Solo puede haber 1 de estos grupos, si existe en array reemplazar en ubicación correspondiente (c)
                    //console.log("Solo se permite una prenda por categoría. Reemplazar");
                    if ((window.location.href).includes("/es/")) { $(".button.marketplace-itemDetail-set").text("REEMPLAZAR");
                    } else { $(".button.marketplace-itemDetail-set").text(canvas_button_replace); };
                    temporalCanvas = mostrarPrenda("replace", nuevaPrenda, nuevaCategoria, c, checkArray[c]);
                    break;
                };
            };
        };

        if (temporalCanvas == false) {
            //console.log("Nueva prenda, agregar. (CON ARRAY)");
            if ((window.location.href).includes("/es/")) {
                $(".button.marketplace-itemDetail-set").text("FIJAR");
            } else {
                $(".button.marketplace-itemDetail-set").text(canvas_button_set);
            }
            
            temporalCanvas = mostrarPrenda("set", nuevaPrenda, nuevaCategoria, cuentaVueltas);
        };

    } else {
        //console.log("Nueva prenda, agregar. (SIN ARRAY)");
        if ((window.location.href).includes("/es/")) {
            $(".button.marketplace-itemDetail-set").text("FIJAR");
        } else {
            $(".button.marketplace-itemDetail-set").text(canvas_button_set);
        }
        temporalCanvas = mostrarPrenda("set", nuevaPrenda, nuevaCategoria, 0);
    };
};

function mostrarPrenda(tipo, prenda, categoria, c, cambio = null) {
    // TIPO = remove, replace, set
    $("#marketplace-itemDetail").show();
    $("#edit-clothes").hide();
    $("#config-buttons-container").hide();
    var img, img2;

    var imageName = groupList.filter(v => {return v.itemId == prenda});
    imageName = imageName[0].itemURL;

    switch (categoria) {
        case "Pieles": img = URL_SRC + URL_SKIN + URL_FULL + imageName; break;
        case "Bocas": img = URL_SRC + URL_MOUTH + URL_FULL + imageName; break;
        case "Ojos": img = URL_SRC + URL_EYES + URL_FULL + imageName; break;
        case "Cabello": img = URL_SRC + URL_HAIR + URL_FULL + imageName; break;
        default: img = URL_SRC + URL_CLOTHES + URL_FULL + imageName;
    }

    if (tipo == "set") {

        if ($(".temporal-canvas").length) {
            // Comprobar si el temporal pertenece al mismo grupo 
            var existeTemp = groupList.filter(v => {return v.itemId == $(".temporal-canvas").attr("temporal-dataid")});
            var nuevoTemp = groupList.filter(v => {return v.itemId == prenda});

            if (existeTemp[0].groupId == nuevoTemp[0].groupId) {
                c = $(".temporal-canvas").index();
            } else {limpiarTemporales();};
        };

        if (categoria == "Fondos") { 
            $("#marketplace-avatar-background-preview").attr("style", "background-image:url('" + img + "')");
            $("#marketplace-avatar-background-preview").addClass("temporal-background");
            $("#marketplace-avatar-background-preview").attr("temporal-dataid", prenda);
        } else {
            if ($(".temporal-canvas").length) {
                // Usar canvas existente
                $(".temporal-canvas").attr("temporal-dataid", prenda);
                canvas = document.getElementsByTagName("canvas");
            
                var ctx = ctx = canvas[c].getContext("2d")
                ctx.clearRect(0, 0, 420, 594);

                img2 = new Image(); img2.onload = function() {
                    ctx.drawImage(img2, 0, 0);
                };img2.src = img;

            } else {
                // Limpiar temporales y crear nuevo canvas
                limpiarTemporales();
                var canvas = '<canvas class="temporal-canvas" temporal-dataid="' + prenda + '" width="420" height="594"></canvas>';
                $("#marketplace-avatar-preview").append(canvas);
                canvas = document.getElementsByTagName("canvas");
                
                var ctx; 
                hayFondo ? ctx = canvas[c-1].getContext("2d") : ctx = canvas[c].getContext("2d");
    
                img2 = new Image(); img2.onload = function() {
                    ctx.drawImage(img2, 0, 0);
                };img2.src = img;
            };

        } return true;

    } else if (tipo == "remove") {
        // Marcar
        limpiarTemporales();
        if (categoria == "Fondos") {
            $("#marketplace-avatar-background-preview").attr("temporal-dataid", prenda);
            $("#marketplace-avatar-background-preview").attr("class", "temporal-background-remove");
        } else {
            $("canvas").eq(c).addClass("temporal-remove");
            $("canvas").eq(c).attr("temporal-dataid", prenda);
        };
        
        return true;

    } else if (tipo == "replace") {
        // Marcar
        if (categoria == "Fondos") {
            limpiarTemporales();
            $("#marketplace-avatar-background-preview").attr("style", "background-image:url('" + img + "')");
            $("#marketplace-avatar-background-preview").attr("original-dataid", cambio);
            $("#marketplace-avatar-background-preview").attr("temporal-dataid", prenda);
            $("#marketplace-avatar-background-preview").addClass("temporal-background-replace");;
        } else {

            canvas = document.getElementsByTagName("canvas");
            var ctx = canvas[c].getContext("2d");

            if ($(".temporal-replace").length) {
                // Verificar si es el mismo grupo
                var temporalIndex = $(".temporal-replace").index();
                if (temporalIndex == c ) {
                    ctx.clearRect(0, 0, 420, 594);
                    $("canvas").eq(c).attr("temporal-dataid", prenda);

                } else {
                    limpiarTemporales();
                    $("canvas").eq(c).addClass("temporal-replace");
                    $("canvas").eq(c).attr("original-dataid", cambio);
                    $("canvas").eq(c).attr("temporal-dataid", prenda);
                    ctx.clearRect(0, 0, 420, 594);
                };

            } else {
                limpiarTemporales();
                $("canvas").eq(c).addClass("temporal-replace");
                $("canvas").eq(c).attr("original-dataid", cambio);
                $("canvas").eq(c).attr("temporal-dataid", prenda);
                ctx.clearRect(0, 0, 420, 594);
            };

            img2 = new Image(); img2.onload = function() {
                ctx.drawImage(img2, 0, 0);
            };img2.src = img;

        }; 
        return true;
    };
};

function limpiarTemporales(excepcion = null) {

    // Eliminar todos los temporales

    // Temporales nuevos

    if (excepcion != ".temporal-remove") {
        if ($(".temporal-remove").length) {
            $(".temporal-remove").removeAttr("temporal-dataid");
            $(".temporal-remove").removeAttr("class");
        };
    };
    
    if (excepcion != ".temporal-canvas") {
        if ($(".temporal-canvas").length) $(".temporal-canvas").remove();
    }

    if (excepcion != ".temporal-background") {
        if ($(".temporal-background").length) {
            $(".temporal-background").removeAttr("style");
            $(".temporal-background").removeAttr("temporal-dataid");
            $(".temporal-background").removeAttr("original-dataid");
            $(".temporal-background").removeClass("temporal-background");
        };
    };

    if (excepcion != ".temporal-background-remove") {
        if ($(".temporal-background-remove").length) {
            $(".temporal-background-remove").removeAttr("temporal-dataid");
            $(".temporal-background-remove").removeAttr("class");
            $(".temporal-remove").removeAttr("class");
        };
    };

    // Temporales reemplazos

    if (excepcion != ".temporal-replace") {
        if ($(".temporal-replace").length) {
            recuperaPrenda(".temporal-replace");
            $(".temporal-replace").removeAttr("original-dataid");
            $(".temporal-replace").removeAttr("temporal-dataid");
            $(".temporal-replace").removeAttr("class");
        };
    };

    if (excepcion != ".temporal-background-replace") {
        if ($(".temporal-background-replace").length) {
            recuperaPrenda(".temporal-background-replace");
            $(".temporal-background-replace").removeAttr("original-dataid");
            $(".temporal-background-replace").removeAttr("temporal-dataid");
            $(".temporal-background-replace").removeAttr("class");
        };
    };
};

function reposicionarCanvas() {
    // Reposicionar si es necesario
    var desplazar = null, nodo;

    if ($(".temporal-replace").attr("original-place")) {
        desplazar = $(".temporal-replace").attr("original-place");
        nodo = document.getElementsByClassName("temporal-replace")[0];
        $(".temporal-replace").removeAttr("temporal-dataid");
        $(".temporal-replace").removeAttr("original-place");

    } else if ($(".temporal-remove").attr("original-place")) {
        desplazar = $(".temporal-remove").attr("original-place");
        nodo = document.getElementsByClassName("temporal-remove")[0];
        $(".temporal-remove").removeAttr("temporal-dataid");
        $(".temporal-remove").removeAttr("original-place");
    };
   
    if (desplazar != null) {
        var padre = document.getElementById("marketplace-avatar-preview");
        var cont = document.getElementsByTagName("canvas");
        nodo.parentNode.removeChild(nodo);
        padre.insertBefore(nodo, cont[desplazar]);
    };
};

function recuperaPrenda(elmnt) {

    var originalID = $(elmnt).attr("original-dataid");
    var original = groupList.filter(v => {return v.itemId == originalID});
    original = original[0].itemURL;

    if (elmnt.includes("background")) {
        // Fondo
        original = URL_SRC + URL_CLOTHES + URL_FULL + original;
        $(elmnt).css("background-image", "url('" + original + "')");

    } else {
        // Canvas
        var elmnto = elmnt.slice(1);
        var canvas = document.getElementsByClassName(elmnto);

        var categoria = groupList.filter(v => {return v.itemId == originalID});
        var image = categoria[0].itemURL;
        categoria = groupInfo.filter(v => {return v.groupId == categoria[0].groupId});
        categoria = categoria[0].category;

        switch (categoria) {
            case "Pieles": image = URL_SRC + URL_SKIN + URL_FULL + image; break;
            case "Bocas": image = URL_SRC + URL_MOUTH + URL_FULL + image; break;
            case "Ojos": image = URL_SRC + URL_EYES + URL_FULL + image; break;
            case "Cabello": image = URL_SRC + URL_HAIR + URL_FULL + image; break;
            default: image = URL_SRC + URL_CLOTHES + URL_FULL + image;
        }
        
        var ctx = canvas[0].getContext("2d");
        ctx.clearRect(0, 0, 420, 594);

        var img2 = new Image(); 
        img2.onload = function() {
            ctx.drawImage(img2, 0, 0);
        };img2.src = image;
    };
};

function buttonsIMG() {
    var link = $(".marketplace-abstract.marketplace-search-item.selected img").attr("src");
    $("#img-s").attr("href", link);
    link = link.replace("icon", "web_full");
    $("#img-m").attr("href", link);
    link = link.replace("web_full", "web_hd");
    $("#img-l").attr("href", link);
    $("#button-img-link-container").css("display", "block");
}

// Funciones de edición de guardiana (mover, fijar, reemplazar, quitar)
function moverPrenda(place) {
    // Identificar elemento y obtenerlo
    var nodo, tipo = null;

    if ($(".temporal-canvas").length) {
        nodo = document.getElementsByClassName("temporal-canvas")[0];

    } else if ($(".temporal-remove").length) {
        nodo = document.getElementsByClassName("temporal-remove")[0];
        if (!$(".temporal-remove").attr("original-place")) {
            $(".temporal-remove").attr("original-place", $(".temporal-remove").index());
        };

    }  else if ($(".temporal-replace").length) {
        nodo = document.getElementsByClassName("temporal-replace")[0];
        if (!$(".temporal-replace").attr("original-place")) {
            $(".temporal-replace").attr("original-place", $(".temporal-replace").index());
        };
    };

    if (!($(".temporal-background").length) && !($(".temporal-background-replace").length)) {

        var padre = document.getElementById("marketplace-avatar-preview");
        var cont = document.getElementsByTagName("canvas");
        var index = $(nodo).index()

        if (place == "prev") {
            if (index > 0) {
                nodo.parentNode.removeChild(nodo); index--;
                padre.insertBefore(nodo, cont[index]);
            };

        } else if (place == "next") {
            var max;
            hayFondo ? max = cont.length - 1 : max = cont.length;
            if (index < max) {
                nodo.parentNode.removeChild(nodo); index++;
                padre.insertBefore(nodo, cont[index]);
            };
        };  
    };
};

function fijarPrenda() {
    var tipo = $(".button.marketplace-itemDetail-set").eq(0).text();
    
    if ($(".temporal-canvas").length) tipo = ".temporal-canvas";
    if ($(".temporal-replace").length) tipo = ".temporal-replace";
    if ($(".temporal-remove").length) tipo = ".temporal-remove";
    if ($(".temporal-background").length) tipo = ".temporal-background";
    if ($(".temporal-background-replace").length) tipo = ".temporal-background-replace";
    if ($(".temporal-background-remove").length) tipo = ".temporal-background-remove";

    var code = $(tipo).attr("temporal-dataid");
    var posicion = null, canvas = $("canvas");
    for (x = 0; x < canvas.length; x++) {
        if ($(canvas).eq(x).attr("temporal-dataid")) {
            posicion = x;break;
        };
    };

    var temp = window.location.search, customArray = [];
    if (temp != "") {
        temp = temp.slice(3); customArray = temp.split("i");
    };

    if (tipo == ".temporal-canvas") {
        if (!code.includes("--")) {
            customArray.splice(posicion, 0, code);
			temp = "?s=";

			for (i = 0; i < customArray.length; i++) {
				(i == 0)? (temp = temp + customArray[i]):(temp = temp + "i" + customArray[i]);
            };

        } else {
            if ((window.location.href).includes("/es/")) {
                alert("No se puede añadir este elemento.");
            } else {
                alert(error_alert_set);
            }
        };

    } else if (tipo == ".temporal-replace") {

        if (!code.includes("--")) {

            if ($(tipo).attr("original-place")) {
                // Eliminar prenda reemplazada en posicion original
                customArray.splice( $(tipo).attr("original-place"), 1);
                // Añadir nueva prenda en nueva posicion
                customArray.splice(posicion, 0, code);
            } else {
                // Elimina y añade en posicion original
                customArray.splice(posicion, 1, code);
            };
          
			temp = "?s=";

			for (i = 0; i < customArray.length; i++) {
				(i == 0)? (temp = temp + customArray[i]):(temp = temp + "i" + customArray[i]);
            };

        } else {
            if ((window.location.href).includes("/es/")) { alert("No se puede añadir este elemento.");
            } else { alert(error_alert_set); };
        };

    } else if (tipo == ".temporal-remove") {

            customArray.splice(posicion, 1);
			temp = "?s=";

            if (customArray.length != 0) {
                for (i = 0; i < customArray.length; i++) {
                    (i == 0)? (temp = temp + customArray[i]):(temp = temp + "i" + customArray[i]);
                };
            } else {
                temp = "wardrobe";
            };

    } else {
        // Fondos
        if (tipo.includes("replace")) {customArray.splice(customArray.length - 1, 1, code);} 
        else if (tipo.includes("remove")) {customArray.splice(customArray.length - 1, 1);} 
        else {customArray.push(code);};

        temp = "?s=";

		if (customArray.length != 0) {
            for (i = 0; i < customArray.length; i++) {
                (i == 0)? (temp = temp + customArray[i]):(temp = temp + "i" + customArray[i]);
            };
        } else {
            temp = "wardrobe";
        };
    };

    if (!code.includes("--")) {
        history.replaceState(null, "", temp);
        if (!tipo.includes("background-remove")) {
            hayFondo = false;
            $("canvas").remove();
            if (temp != "wardrobe") {limpiarTemporales(); cargarGuardiana()};
        } else {
            $("#marketplace-avatar-background-preview").removeAttr("style");
            $("#marketplace-avatar-background-preview").removeAttr("class");
        };

        if ($(".marketplace-search-item.selected").length) {$(".marketplace-search-item").removeClass("selected")};
        $("#marketplace-itemDetail").hide();
        $("#edit-clothes").show();
        $("#config-buttons-container").show();
        $("#button-img-link-container").css("display", "none");
        var gotoProfile = (window.location.href).replace("wardrobe", "profile");
        $("#link-profile").attr("href", gotoProfile);
    };
};

function changeLang() {
    for (i = 0; i < $(".marketplace-search-item").length; i++) {
        // Obtener grupo
        var temp = $(".marketplace-search-item").eq(i).attr("data-groupid");
        temp = groupInfo.filter(v => {return v.groupId == temp});

        if (localization == "es") {    
            temp = temp[0].spanish;

            if (temp.includes("(x)")) {
                $(".abstract-name").eq(i).attr("class", "abstract-name undefined");
                temp = temp.slice(3);
                $(".abstract-name").eq(i).text(temp);

            } else {
                $(".abstract-name").eq(i).attr("class", "abstract-name");
                $(".abstract-name").eq(i).text(temp);
            }

        } else if (localization == "en") {
            temp = temp[0].english;

            if (temp.includes("(x)")) {
                $(".abstract-name").eq(i).attr("class", "abstract-name undefined");
                temp = temp.slice(3);
                $(".abstract-name").eq(i).text(temp);

            } else {
                $(".abstract-name").eq(i).attr("class", "abstract-name");
                $(".abstract-name").eq(i).text(temp);
            };
        };
    };
};

function obtenerListaPreview() {
    var arrayPreview = [];
    var canvas = $(".canvas-preview");

    if (canvas.length != 0) {

        for (c = 0; c < canvas.length; c++) {
            arrayPreview.push(parseInt(canvas.eq(c).attr("data-previewid")));
        };

        arrayPreview.reverse();   

        for (e = 0; e < arrayPreview.length; e++) {
            $("#edit-menu-list").append('<div class="draggable-preview"></div>');
            $(".draggable-preview").eq(e).attr("data-previewid", arrayPreview[e]);

            // Obtener imagen 
            var url = groupList.filter(v => {return v.itemId == arrayPreview[e]});
            var grupo = groupInfo.filter(v => {return v.groupId == url[0].groupId});
            url = url[0].itemURL;

            switch (grupo[0].category) {
                case "Pieles": url = URL_SRC + URL_SKIN + URL_ICON + url; break;
                case "Bocas": url = URL_SRC + URL_MOUTH + URL_ICON + url; break;
                case "Ojos": url = URL_SRC + URL_EYES + URL_ICON + url; break;
                case "Cabello": url = URL_SRC + URL_HAIR + URL_ICON + url; break;
                default: url = URL_SRC + URL_CLOTHES + URL_ICON + url;
            };

            $(".draggable-preview").eq(e).append('<img class="draggable-preview-icon"><div class="draggable-preview-info"></div>');
            $(".draggable-preview-icon").eq(e).attr("src", url);

            if (localization == "es") {
                var esp = grupo[0].spanish;
                if (esp.includes("(x)")) { // No tiene traducción o no es oficial
                    esp = esp.slice(3);
                    $(".draggable-preview-info").eq(e).append('<div class="draggable-preview-name undefined">' + esp + '</div>');
                } else { // Disponible en español
                    $(".draggable-preview-info").eq(e).append('<div class="draggable-preview-name">' + esp + '</div>');
                };
            } else if (localization == "en") {
                var eng = grupo[0].english;
                if (eng.includes("(x)")) { // No tiene traducción o no es oficial
                    eng = eng.slice(3);
                    $(".draggable-preview-info").eq(e).append('<div class="draggable-preview-name undefined">' + eng + '</div>');
                } else { // Disponible en inglés
                    $(".draggable-preview-info").eq(e).append('<div class="draggable-preview-name">' + eng + '</div>');
                }
            } else if (localization == "pt_BR") {
                var pt = grupo[0].portuguese;
                if (pt.includes("(x)")) { // No tiene traducción o no es oficial
                    pt = pt.slice(3);
                    $(".draggable-preview-info").eq(e).append('<div class="draggable-preview-name undefined">' + pt + '</div>');
                } else { // Disponible en inglés
                    $(".draggable-preview-info").eq(e).append('<div class="draggable-preview-name">' + pt + '</div>');
                }
            };

            // Botones para mover
            $(".draggable-preview-info").eq(e).append('<div class="draggable-move-buttons"></div>');
            if (e == 0 && arrayPreview.length != 1) {
                // Boton bajar
                $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda bajar-prenda button" data-position="' + e +'"><span class="fas fa-chevron-down"></span></div>');

            } else if (e == (arrayPreview.length - 1) && arrayPreview.length != 1) {
                // Boton subir
                $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda subir-prenda button" data-position="' + e +'"><span class="fas fa-chevron-up"></span></div>');

            } else if (arrayPreview.length != 1) {
                // Ambos botones
                $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda subir-prenda button" data-position="' + e +'"><span class="fas fa-chevron-up"></span></div>');
                $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda bajar-prenda button" data-position="' + e +'"><span class="fas fa-chevron-down"></span></div>');
            };

            $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda quitar-prenda button" data-position="' + e +'"><span class="fas fa-times"></span></div>');
        };

    } else {
        var nullMsg = "No hay ningún elemento fijado.";
        if (!(window.location.href).includes("/es/")) {
            nullMsg = edit_panel_empty;
        }
        $("#edit-menu-list").append('<span style="text-align: center;width: calc(100% - 20px);display: inline-block;margin: 20px 10px;color: #d5bbaf;"><i>' + nullMsg + '</i></span>');
        $("#editOK").remove();
    };
};

function actualizaBotonesPreview() {
    $(".draggable-move-buttons").remove();

    if ($(".draggable-preview").length != 0) {

        for (e = 0; e < $(".draggable-preview").length; e++) {

            $(".draggable-preview-info").eq(e).append('<div class="draggable-move-buttons"></div>');
            if (e == 0 && ($(".draggable-preview").length != 1)) {
                // Boton bajar
                $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda bajar-prenda button" data-position="' + e +'"><span class="fas fa-chevron-down"></span></div>');

            } else if ((e == ($(".draggable-preview").length - 1)) && ($(".draggable-preview").length != 1)) {
                // Boton subir
                $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda subir-prenda button" data-position="' + e +'"><span class="fas fa-chevron-up"></span></div>');

            } else if ($(".draggable-preview").length != 1) {
                // Ambos botones
                $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda subir-prenda button" data-position="' + e +'"><span class="fas fa-chevron-up"></span></div>');
                $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda bajar-prenda button" data-position="' + e +'"><span class="fas fa-chevron-down"></span></div>');
            };

            $(".draggable-move-buttons").eq(e).append('<div class="mueve-prenda quitar-prenda button" data-position="' + e +'"><span class="fas fa-times"></span></div>');

        };
    } else {
        var txtLang = "Se han quitado todas las prendas.";
        if (!(window.location.href).includes("/es/")) {txtLang = edit_panel_removed;};
        $("#edit-menu-list").append('<span style="text-align: center;width: calc(100% - 20px);display: inline-block;margin: 20px 10px;color: #d5bbaf;"><i>' + txtLang + '</i></span>');
    };
};

function editarPreview(tipo, index) {
    // Cuenta canvas 
    var numCanvas = $(".canvas-preview").length - 1;
    var posicionCanvas = numCanvas - index; // Index del canvas
    var nuevo = "", nuevoPCanvas = "";
        
    if (tipo == "subir") {
        nuevo = index - 1; // Nueva posición en la lista / Posición en lista
        nuevoPCanvas = posicionCanvas + 2; // Nueva posición en canvas

    } else if (tipo == "bajar") {
        nuevo = index + 2;
        nuevoPCanvas = posicionCanvas - 1;

    } else if (tipo == "quitar") {
        posicionCanvas = numCanvas - index;
        $(".draggable-preview").eq(index).remove();
        $(".canvas-preview").eq(posicionCanvas).remove();
        actualizaBotonesPreview();
    };


    if (tipo != "quitar") {

        // Actualizar lista
        var nodo = document.getElementsByClassName("draggable-preview")[index];
        var padre = document.getElementById("edit-menu-list");
        var cont = document.getElementsByClassName("draggable-preview");
        padre.insertBefore(nodo, cont[nuevo]);
        actualizaBotonesPreview();

        // Actualizar canvas
        nodo = document.getElementsByClassName("canvas-preview")[posicionCanvas];
        padre = document.getElementById("edit-preview");
        cont = document.getElementsByClassName("canvas-preview");
        padre.insertBefore(nodo, cont[nuevoPCanvas]);

    };
};

$(function() {
    $("#change-lang").click(function() {
        var lang = $(this).attr("current-lang");
        if (lang == "en") {
            // Cambiar a español
            $(this).removeClass("active");
            $(this).attr("current-lang", "es");
            localization = "es";

        } else if (lang == "es") {
            // Cambiar a inglés
            $(this).addClass("active");
            $(this).attr("current-lang", "en");
            localization = "en";
        }
        changeLang();
    });

    // Abre y cierra popup
    $("#filter-help").click(function() {$("#popup-bg").fadeIn(300);});
    $("#close-popup").click(function() {$("#popup-bg").fadeOut(200);});

    $("#filter-bodyLocationOptions").change(function() {
        $("#filter-guardOptions").val("");
		$("#filter-rarityOptions").val("");
		$("#filter-itemName").val("");
        cargarLista();
    });
    $("#filter-guardOptions").change(function() {cargarLista()});
    $("#filter-rarityOptions").change(function() {cargarLista()});
    $("#filter-orderOptions").change(function() {cargarLista()});

    // Selecciona las prendas
    $("#marketplace-search-items").on("click", ".marketplace-search-item", function() {
        // Obtener pagina
        
        var grupo = $(this).attr("data-groupid");
        var code = $(this).attr("data-itemid");
        var tieneSub = subCheck(grupo);
        var page = parseInt($(".page.selected").attr("page-number"));
        page--;
        if (isNaN(page)) page = 0;
        
        if (tieneSub) {
            // Cargar sublista
            $("#filter-orderOptions").css("display", "none");
            cargarLista(page, grupo, 0);
        } else {
            // Nueva prenda o reemplazo
            reposicionarCanvas();

            var clase = $(this).attr("class");
            if ($(".marketplace-search-item.selected").length) {
                $(".marketplace-search-item").removeClass("selected");
            };

            if (!(clase.includes("selected"))) {
                $(this).addClass("selected");
                buttonsIMG();
                checkPrenda(code, grupo);
                
            } else {
                $("#marketplace-itemDetail").hide();
                $("#edit-clothes").show();
                $("#config-buttons-container").show();
                $("#button-img-link-container").css("display", "none");
                limpiarTemporales();
                
            };
        };
    });

    // Selecciona página
    $(".pagination").on("click", ".page", function() {
        if ($(this).attr("class") != "page selected") {
            var pagina = parseInt($(this).attr("page-number")) - 1;

            // Si existe es sublista, si no es lista
            if ($(".marketplace-search-back").length == 1) {
                var pag = $(".marketplace-search-back").attr("data-page");
                var code = $(".marketplace-search-item").eq(0).attr("data-groupid");

                cargarLista(pag, code, pagina);
            } else {
                cargarLista(pagina);
            };         
        };
    });

    // Salir del submenu
    $("#marketplace-search-items").on("click", ".marketplace-search-back", function() {
        $("#filter-orderOptions").css("display", "inline-block");
        var pagina = $(this).attr("data-page");
        if (pagina < 0) pagina = 0;
        cargarLista(pagina);
    });


    // POPUPEDIT - Carga
    $("#edit-clothes").click(function() {
        $(".marketplace-container").eq(0).append('<div id="edit-clothes-layout"><div id="edit-clothes-popup"></div></div>');

        // Cargar guardiana
        $("#edit-clothes-popup").append('<div id="edit-preview"></div>');
        if (window.location.search != "") {
            hayFondo = false;
            cargarGuardiana(0, true);    
        };

        // Cargar menu y obtener lista
        $("#edit-clothes-popup").append('<div id="edit-menu-container"></div>');
        $("#edit-menu-container").append('<div id="edit-menu-list"></div>');
        var txtBTN = ["APLICAR", "CANCELAR"];
        if (!(window.location.href).includes("/es/")) {
            txtBTN = [edit_panel_button_confirm, edit_panel_button_cancel];
        }
        $("#edit-menu-container").append('<div id="edit-menu-buttons"><div id="editOK" class="button">' + txtBTN[0] + '</div><div id="editNO" class="button">' + txtBTN[1] + '</div></div>');
        obtenerListaPreview();

    });

    // POPUPEDIT - Función de los botones

    $(".marketplace-container").on("click", ".subir-prenda", function() {
        var index = parseInt($(this).attr("data-position"));
        editarPreview("subir", index);
    });
    $(".marketplace-container").on("click", ".bajar-prenda", function() {
        var index = parseInt($(this).attr("data-position"));
        editarPreview("bajar", index);
    });
    $(".marketplace-container").on("click", ".quitar-prenda", function() {
        var index = parseInt($(this).attr("data-position"));
        editarPreview("quitar", index);
    });


    $(".marketplace-container").on("click", "#editNO", function() {
        // Cancelar cambios
        $("#edit-clothes-layout").remove();
    });

    $(".marketplace-container").on("click", "#editOK", function() {
        // Aplicar cambios
        var newArray = [];
        // Obtener CODES
        for (c = 0; c < $(".canvas-preview").length; c++) {
            newArray.push(parseInt($(".canvas-preview").eq(c).attr("data-previewid")));
        };

        var cadena = "";

        if (newArray.length != 0) {
            cadena = "wardrobe?s=" + newArray.join("i");
        } else {
            cadena = "wardrobe";
        }

        // Obtener BG
        var bgPreview = $("#edit-clothes-popup").attr("data-bgpreviewid");
        if (bgPreview != undefined ) {
            if (cadena.includes("?s=")) {cadena += ("i" + bgPreview)}
            else {cadena += "?s=" + bgPreview};
        };

        history.replaceState(null, "", cadena);
        $("#edit-clothes-layout").remove();
        $("canvas").remove();
        $("#marketplace-avatar-background-preview").removeAttr("style");
        hayFondo = false;

        if (cadena != "wardrobe") {limpiarTemporales(); cargarGuardiana()};

        var gotoProfile = (window.location.href).replace("wardrobe", "profile");
        $("#link-profile").attr("href", gotoProfile);
    });


    $("#config-load-base").click(function() {
        $("canvas").remove();
        var toDelete = window.location.search;
        var loadBase = "?s=691i692i5161i323i693";
        if (toDelete == loadBase) {
            loadBase = "?s=691i692i5161i323i726";
        };

        history.replaceState(null, "", loadBase);
        cargarGuardiana();

        var changelink = (window.location.href).replace("wardrobe", "profile");
        $("#link-profile").attr("href", changelink);
    });

    $("#config-clean-all").click(function() {
        $("canvas").remove();
        $("#marketplace-avatar-background-preview").removeAttr("style");
        
        var cleanPage = window.location.href;
        cleanPage = cleanPage.replace(window.location.search, "");

        history.replaceState(null, "", cleanPage);

        var changelink = (window.location.href).replace("wardrobe", "profile");
        $("#link-profile").attr("href", changelink);
    });
});




// Utilidades
function getFiltros() {
    var a = $("#filter-bodyLocationOptions").val();
    var b = $("#filter-guardOptions").val();
    var c = $("#filter-rarityOptions").val();
    switch (c) {
        case "common": c = "Común"; break;
        case "rare": c = "Raro"; break;
        case "epic": c = "Épico"; break;
        case "legendary": c = "Legendario"; break;
        case "event": c = "Evento"; break;
        default: c = "";
    };
    var d = $("#filter-orderOptions").val();
    var e = $("#filter-itemName").val();

    return [a, b, c, d, e];
};

function subCheck(grupo) {
    if ($(".marketplace-search-back").length == 0) {
        var busca = $("#filter-itemName").val();
        if (esNumero(busca) || busca.includes("#")) {return false};
        var check = groupList.filter(v => {return v.groupId == grupo});
        if (check.length > 1) {return true};
    } return false;
};

var normalize = (function() {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
        to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};
   
    for(var i = 0, j = from.length; i < j; i++ )
        mapping[ from.charAt( i ) ] = to.charAt( i );
   
    return function( str ) {
        var ret = [];
        for( var i = 0, j = str.length; i < j; i++ ) {
            var c = str.charAt( i );
            if( mapping.hasOwnProperty( str.charAt( i ) ) )
                ret.push( mapping[ c ] );
            else
                ret.push( c );
        }      
        return ret.join( '' );
    }
})();

function esNumero(s) {
    if (s == "") return false;
    if (!isNaN(s)) return true;
    return false;
};