// Variables globales
var users, entrys, feat;
var groupInfo = "", groupList = "";

$(document).ready(function () {
    // Cargar status
    $.get("https://raw.githubusercontent.com/GardieMaker/data/master/status/activities", function(estado, success, xhr) {
        if (!(window.location.href).includes("/es/")) {
            estado = estado.replace("No hay nuevas actividades", nav_notification);
        }
        document.getElementsByClassName("news-latest")[0].innerHTML = estado;
    });

    // Cargar afiliados
    $.get("https://raw.githubusercontent.com/GardieMaker/data/master/status/affiliates", function(afiliados, success, xhr) {
        if (!(window.location.href).includes("/es/")) {
            afiliados = afiliados.replace("Páginas amigas", nav_affiliates);
        }
        document.getElementById("footer-info").innerHTML = afiliados;
    });

    var dir = "../";
    if ((window.location.href).includes("127")) { dir = "../../"; }; // local

    const gi = new XMLHttpRequest(); gi.open("GET", dir + "data/groupInfo.json");gi.responseType = "json"; gi.send();
    gi.onload = function() { groupInfo = gi.response;
        const gl = new XMLHttpRequest(); gl.open("GET", dir + "data/groupList.json");gl.responseType = "json"; gl.send();
        gl.onload = function() { groupList = gl.response;

            // Cargar usuarios, entradas y destacadas
            const u = new XMLHttpRequest();u.open("GET", dir + "data/usr/users.json");
            u.responseType = "json";u.send();u.onload = function() {

                const e = new XMLHttpRequest();e.open("GET", dir + "data/usr/entries.json");
                e.responseType = "json";e.send();e.onload = function() {
            
                    const f = new XMLHttpRequest();f.open("GET", dir + "data/usr/featured.json");
                    f.responseType = "json";f.send();f.onload = function() {

                        users = u.response; entrys = e.response; feat = f.response;
                        normalizeURL();
                        cargarSelect(users);
                        cargarRanking();
                        cargarListas(0);
                    };
                };
            };
        };
    };
});

// Preparación de la interfaz
function cargarSelect(user) {
    var texto = "<option hidden selected>Filtrar por usuario...</option>";
    if (!(window.location.href).includes("/es/")) {
        texto = texto.replace("Filtrar por usuario...", menu_left_filter_default);
    };

    for (i = 0; i < user.length; i++) {
        var p = entrys.filter(v => {return v.alias == user[i].alias});
        p = p.length;
        texto += "<option value='" + user[i].alias + "'>" + user[i].alias + " (" + p + ")</option>";
    }
    
    $("#menu-user").html(texto);
}

function normalizeURL() {
    var str = window.location.search;
    
	if (str != "") {

        if (str.includes("?p=") || str.includes("?u=") || str.includes("?v=") || str.includes("?e=")) {

            // asignar atributos si no tienen valor
            if (str == "?p=" || str == "?u=" || str == "?v=" || str == "?v=") {

                switch (str) {
                    case "?v=":str = "?v=true";break;
                    case "?p=":case "?u=":str = "?p=featured";break;
                }

                history.pushState(null, "", str);
            }

		} else {
			window.location.href = "archive?p=featured";
		};
	} else {
        str="?p=featured";
        history.pushState(null, "", str);
    };

    selectMenu(str.slice(1,2), str.slice(3));
}

function cargarRanking() {
    var top1 = ["", 0], top2 = ["", 0], top3 = ["", 0];

    for (a = 0; a < users.length; a++) {
        if (users[a].alias != "Zunay") {
            var p = entrys.filter(v => {return v.alias == users[a].alias});
            p = p.filter(v => {return v.type != "cosplay"});
            p = p.length;
    
            if (top1[1] < p) {
                top3[0] = top2[0];
                top3[1] = top2[1];
        
                top2[0] = top1[0];
                top2[1] = top1[1];
        
                top1[0] = users[a].alias;
                top1[1] = p;
    
            } else if (top2[1] < p) {
                top3[0] = top2[0];
                top3[1] = top2[1];
        
                top2[0] = users[a].alias;
                top2[1] = p;
    
            } else if (top3[1] < p) {
                top3[0] = users[a].alias;
                top3[1] = p;
            };
        };
    };

    $("#top1").html('<a href="?u=' + top1[0] + '">' + top1[0] + '</a><span class="top-number">' + top1[1] + '</span>');
    $("#top2").html('<a href="?u=' + top2[0] + '">' + top2[0] + '</a><span class="top-number">' + top2[1] + '</span>');
    $("#top3").html('<a href="?u=' + top3[0] + '">' + top3[0] + '</a><span class="top-number">' + top3[1] + '</span>');

};

function selectMenu(cat, val) {
    var str = "?" + cat + "=" + val;
    history.pushState(null, "", str);

    if (document.getElementsByClassName("on")[0])
    document.getElementsByClassName("on")[0].removeAttribute("class")

    if (cat != "v" && cat != "e") {
        var q = "#menu-" + val + " > li";
        
        if (cat != "u") {
            document.querySelector(q).setAttribute("class", "on");
            if ((window.location.href).includes("/es/")) { $("#menu-user").val("Filtrar por usuario...");
            } else { $("#menu-user").val(menu_left_filter_default); };
        };
    } else {
        if ((window.location.href).includes("/es/")) { $("#menu-user").val("Filtrar por usuario...");
        } else { $("#menu-user").val(menu_left_filter_default); };
        if (cat == "e") document.querySelector("#menu-all > li").setAttribute("class", "on");
    };
};

// Carga de entradas
function cargarListas(pag) {

    var dataurl = window.location.search;
    var uCAT = dataurl.slice(1,2);
    var uVAL = dataurl.slice(3);
    uVAL = unescape(uVAL);
    uVALP = "";

    // Hay POPUP ?
    var popo = [];
    if (uCAT == "e") {
        if (uVAL[0] != "s") {
            popo = entrys.filter(function(v){return v.id == uVAL});
        } else {
            popo = feat.filter(function(v){return v.entry == uVAL});
        };
        
        history.pushState(null, "", "?p=all");
        uVALP = uVAL; uCAT = "p"; uVAL = "all";
    };

    // Cargar todas las entradas
    var entry = [];

    switch (uCAT) {
        case "u":entry = entrys.filter(function(v){return v.alias == uVAL});break;
        case "v":/*Pendiente*/break;
        case "p":
            if (uVAL == "featured") {
                uVAL = toBoolean(uVAL);
                //entry = entrys.filter(function(v){return v.featured === uVAL});
                entry = feat; // Cargar post desde featuredDB
            } else {
                if (uVAL == "guardians") {
                    entry = entrys.filter(function(v){return v.type != "cosplay"});
                } else if (uVAL == "cosplay") {
                    entry = entrys.filter(function(v){return v.type == "cosplay"});
                } else {
                    for (i = 0; i < entrys.length; i ++) {
                        entry.push(entrys[i]);
                    };
                };           
            };
            break;
    };

    // Cargar posts en tablas segun paginacion
    dibujaTabla(entry, uVAL, pag);

    // Abre popup
    if (popo.length == 1) abrirPopup(uVALP);

}

function dibujaTabla(entry, uVAL, pag) {

    $("#archive-thumbnail-content").html("");

    // Si es perfil, mostrar titulo de filtro
    var str = window.location.search;
    if (str.includes("?u=")) {
        str = str.slice(3);
        if ((window.location.href).includes("/es/")) {
            str = '<p>Mostrando todos los aportes de <b>' + unescape(str) + '</b>.</p>';
        } else {
            var nick = filter_user_info.replace("$NICKNAME", '<b>' + unescape(str)) + '</b>.';
            str = '<p>' + nick + '</p>';
        }
        $("#archive-thumbnail-content").append(str);
    };

    var tabla = "<table>";
    var filtroP = [];
    
    // Cuadros por páginas 12
    var pages = Math.floor(entry.length / 12);

    // Elemento inicial
    var startPage = pag * 12;
    
    var endPage = startPage + 12;
    for (startPage; startPage < endPage; startPage += 4) {
        tabla += "<tr>";

        // c = starpage ??
        for (c = 0; c < 4; c++) {
            var suma = c + startPage;

            if (uVAL != true) {
                if(entry[suma]) {
                    
                    // Fondo pequeño
                    var bg = buscaFondo(entry[suma].info.code);
                    bg = bg.replace("web_full", "icon");

                    tabla += "<td><div id='" + entry[suma].id + "' class='abstract-thumbnail"

                    if (entry[suma].featured === true) {
                        tabla += " featured' style='background-image:url(" + bg 
                        + ")'><span class='feat'>DESTACADA</span>";
                    } else if (entry[suma].type == "cosplay") {
                        tabla += " cosplay'><span class='cplay'>COSPLAY</span>";
                    } else {tabla += "'>";};
                    tabla += "<img src='https://docs.zoho.com/docs/orig/" + entry[suma].info.png + "'></div></td>"
                } else {
                    tabla += "<td></td>";
                }
                    
            } else {

                if (feat[c + startPage]) {

                    var entrada = "";
                    
                    if ((feat[suma].entry[0]) == "s") { // Entradas por actividad / especiales
                        entrada = feat[suma].entryInfo;

                    } else { // Entradas normales
                        entrada = entrys.filter(function(v){return v.id == feat[c + startPage].entry});
                        entrada = entrada[0].info;
                    };

                    // Fondo pequeño
                    var bg = buscaFondo(entrada.code);
                    bg = bg.replace("web_full", "icon");

                    // Mostrar lista de featured
                    tabla += "<td><div id='" + feat[suma].entry + "' class='abstract-thumbnail feat-page'"
                    + " style='background-image:url(" + bg + ")'><span class='feat-title'>" + feat[suma].title + 
                    "</span><img src='https://docs.zoho.com/docs/orig/" + entrada.png + "'></div></td>";
                    
                } else {
                    tabla += "<td></td>";
                }
            }
        };

        tabla += "</tr>";
    };

    tabla += "</table>";
    $("#archive-thumbnail-content").append(tabla);

    // Pagination    
    //var pagesTEST = 14; // PRUEBAS TRUNCATION PAGES
    if (pages > 0) hacerPagination(pag, pages);
}


/*
    1  2  3  4  5  6  7  8  9 10 11 12
    1  2  3  4  5  6  7  8  9 .. xx xx
    1  2  .. x  x  x  x  x  x xx xx xx
    1  2  .. 4  5  6  7  8  9 10 .. 12 13
/*
    !!! CATALOGO !!!
    1  2  3  4  5  6  7  8  9 10 11 12 13 14
    1  2  3  4  5  6  7  8  9 (10) 11 .. xx xx
    1  2  .. 4  5  6  7 (8) 9 10 11 12 .. 14 15

    1  2  .. x (x)  x  x  x  x xx xx xx xx xx
            -10 -9 -8 -7 -6 -5 -4 -3 -2 -1  L
    

*/


function hacerPagination(activa, paginas) {

    var truncation = [];
    truncation.push('<div id="pagination">');

    // Necesita truncation ?
    if (paginas < 14) {
        // Sin truncation
        for (s = 0; s <=paginas; s++) {
            var num = s + 1;
            if (s == activa) {
                truncation.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
            } else {
                truncation.push('<div class="page" page-number="' + num + '">' + num + '</div>');
            };
        };
        
    } else { 
        // Si necesita truncation
        // Comprobar de qué tipo segun pag activa

        if (activa < 9 ) {
            // Inicio
            for (i = 0; i <= paginas; i++) {
                var num = i + 1;
                if (i != 11){
                    if (i == activa) {
                        truncation.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
                    } else {
                        truncation.push('<div class="page" page-number="' + num + '">' + num + '</div>');
                    };
                } else {
                    truncation.push('<span class="truncation">...</span>');
                    i = (paginas - 2);
                };
            };

        } else if ((paginas - 8) > activa && activa > 8) {
            // Medio 
            for (m = 0; m <= paginas; m++) {
                var num = m + 1;
                if (m == 2 || m == (paginas - 2)) {
                    truncation.push('<span class="truncation">...</span>');
                    if (m == 2) m = (activa - 5) ;
                } else {
                    if (m == activa) {
                        truncation.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
                    } else if (m == (activa + 5)) {
                        m = paginas - 3;

                    } else {
                        truncation.push('<div class="page" page-number="' + num + '">' + num + '</div>');
                    };
                }
            }


            // PENDIENTE
        } else if (activa >= paginas - 8) {
            // Fin
            for (f = 0; f <= paginas; f++) {
                var num = f + 1;
                if (f == 2) {
                    truncation.push('<span class="truncation">...</span>');
                    f = (paginas - 11);
                } else {
                    if (f == activa) {
                        truncation.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
                    } else {
                        truncation.push('<div class="page" page-number="' + num + '">' + num + '</div>');
                    }
                };
            }
        }
    }
/*
    !!! CATALOGO !!!
    1  2  3  4  5  6  7  8  9 10 11 12 13 14
    1  2  3  4  5  6  7  8  9 (10) 11 .. xx xx
    1  2  .. 4  5  6  7 (8) 9 10 11 12 .. 14 15

    1  2  .. x (x)  x  x  x  x xx xx xx xx xx
            -10 -9 -8 -7 -6 -5 -4 -3 -2 -1  L
    

*/

    truncation.push("</div>");
    var code = truncation.join("");
    $("#archive-thumbnail-content").append(code);
}

$(function() { 
    $("#menu-featured").click(function(){
        selectMenu("p","featured");
        cargarListas(0);
    });

    $("#menu-all").click(function(){
        selectMenu("p","all");
        cargarListas(0);
    });

    $("#menu-guardians").click(function(){
        selectMenu("p","guardians");
        cargarListas(0);
    });

    $("#menu-cosplay").click(function(){
        selectMenu("p","cosplay");
        cargarListas(0);
    });
    
    $("#menu-user").change(function() {
        selectMenu("u", $("#menu-user").val() );
        if ($("#archive-menu-user")) $("div").remove("#archive-menu-user");
        cargarListas(0);
    });

    $("#archive-thumbnail-content").on("click", ".abstract-thumbnail", function(){
        abrirPopup($(this).attr("id"));
    });

    $("#archive-thumbnail-content").on("click", ".page", function() {
        if ($(this).attr("class") != "page selected") {
            var pagina = parseInt($(this).attr("page-number")) - 1;
            cargarListas(pagina);
        }
    });

});

function buscaFondo(code) {
    var enlace = "";
    var code = code.split("i");
    for (a = 0; a < code.length; a++) {
        var check = groupInfo.filter(v => {return v.groupId == code[a]});
        if (check.length == 1) {
            if (check[0].category == "Fondos") {
                check = groupList.filter(v => {return v.itemId == code[a]});
                enlace = URL_BGFULL + check[0].itemURL;
                break;
            };
        };
    };

    if (enlace == "") {
        enlace = URL_BGFULL + "ebe3cacec9acff9a1ae9d9554a3192c0.jpg";
    };
    
    return enlace;
};

function abrirPopup(elmnt) {

    $("body").css("overflow", "hidden");

    // Cargar elemento

    // Contenedor de fondo > Contenedor de ventana + botón de cierre
    var html = '<div id="popupBG"><a class="nav-box-prev"></a><div id="popupW"><div id="button-close" onclick="cierraPopup()"></div>';

    var entry = "";
    if (elmnt[0] == "s") { // Siempre son destacadas
        entry = feat.filter(v => {return v.entry == elmnt});
        var fondo = buscaFondo(entry[0].entryInfo.code);

        // Div principal
        html += '<div id="entry-info-container" entry-dataid="' + entry[0].entry + '" style="background-image: url(' + fondo + ')">';

        // Gardienne + nombre || id
        html += '<img src="https://docs.zoho.com/docs/orig/' + entry[0].entryInfo.png + '"><div id="entry-info-menu"><div id="entry-info-quote">';

        // Cuadro blanco
        html += '<h2>' + entry[0].entryInfo.field[0] + '</h2>';
        for (a = 1; a < entry[0].entryInfo.field.length; a++) {
            html += '<p>' + entry[0].entryInfo.field[a] + '</p>';
        };

        if ((window.location.href).includes("/es/")) {
            html += '<p>Abrir en: <a href="profile?s=' + entry[0].entryInfo.code + '"> Perfil</a> | <a href="wardrobe?s=' + entry[0].entryInfo.code + '">Vestidor</a></p></div>';
        } else {
            html += '<p>' + guardian_info_open + ' <a href="profile?s=' + entry[0].entryInfo.code + '"> ' + guardian_info_open_profile + '</a> | <a href="wardrobe?s=' + entry[0].entryInfo.code + '">' + guardian_info_open_wardrobe + '</a></p></div>';
        }
        

    } else {
        entry = entrys.filter(function(v) {return v.id == elmnt});
        var fondo = buscaFondo(entry[0].info.code);

        // Div principal
        html += '<div id="entry-info-container" entry-dataid="' + entry[0].id + '" style="background-image: url(' + fondo + ')">';

        // Gardienne + nombre || id
        html += '<img src="https://docs.zoho.com/docs/orig/' + entry[0].info.png + '"><div id="entry-info-menu"><div id="entry-info-quote">';

        if (entry[0].type == "cosplay") {
            if ((window.location.href).includes("/es/")) {
                html += '<span id="entry-info-cosplay">COSPLAY</span>';
            } else {
                html += '<span id="entry-info-cosplay">' + icon_cosplay_title.toUpperCase() + '</span>';
            }
        };

        if (entry[0].info.name) {html += '<h2>' + entry[0].info.name + '</h2><p>ID: ' + entry[0].id + '</p>'} 
        else {html += '<h2>ID: ' + entry[0].id + '</h2>'};

        // Estado e info de cuenta
        var user = users.filter(function(v) {return v.alias == entry[0].alias});
        if ((window.location.href).includes("/es/")) {
            html += '<p> Enviada por: <a href="?u=' + entry[0].alias + '">' + entry[0].alias + '</a><span class="';
            user[0].verified ? html += 's-verified" title="Cuenta verificada"></span></p>' : html += 's-pending" title="Cuenta sin verificar"></span></p>';
            html += '<p>Fecha: ' + entry[0].info.date + '</p><p>Abrir en: <a href="profile?s=' + entry[0].info.code + '"> Perfil</a> | <a href="wardrobe?s=' + entry[0].info.code + '">Vestidor</a></p></div>';
        } else {
            html += '<p> ' + guardian_info_author + ' <a href="?u=' + entry[0].alias + '">' + entry[0].alias + '</a><span class="';
            user[0].verified ? html += 's-verified" title="' + account_status_OK + '"></span></p>' : html += 's-pending" title="' + account_status_bad + '"></span></p>';
            html += '<p>' + guardian_info_date + ' ' + entry[0].info.date + '</p><p>' + guardian_info_open + ' <a href="profile?s=' + entry[0].info.code + '"> ' + guardian_info_open_profile + '</a> | <a href="wardrobe?s=' + entry[0].info.code + '">' + guardian_info_open_wardrobe + '</a></p></div>';
        };
    };
    

    // Destacada ?
    var checkFeat = feat.filter(v => {return v.entry == elmnt});

    if (checkFeat.length == 1) {
        if ((window.location.href).includes("/es/")) { html += '<div id="entry-info-featured"><h2>★ Guardiana Destacada ★</h2>';
        } else { html += '<div id="entry-info-featured"><h2>★ ' + featured_guardian_title + ' ★</h2>' };
        var titulo = "";

        if (checkFeat[0].entry[0] == "s") {
            if ((window.location.href).includes("/es/")) {
                titulo = "Por actividad: <a href='" + checkFeat[0].postInfo.enlace + "' target='_blank'>" + checkFeat[0].postInfo.actividad + "</a>"
                html += '<p><i>' + titulo + '.</i></p>'
                + '<p>Fecha: ' + checkFeat[0].date + '</p>';
            } else {
                titulo = featured_guardian_info_activity + " <a href='" + checkFeat[0].postInfo.enlace + "' target='_blank'>" + checkFeat[0].postInfo.actividad + "</a>"
                html += '<p><i>' + titulo + '.</i></p>'
                + '<p>' + guardian_info_date + ' ' + checkFeat[0].date + '</p>';
            }
            
        } else {
            var ft = feat.filter(function(v){return v.entry == entry[0].id});
            var titulo = ft[0].title;
            if ((titulo).includes("Semana")) {
                if ((window.location.href).includes("/es/")) {
                    titulo = "En portada durante la " + titulo.replace("Semana", "semana");
                } else {
                    var num = titulo.replace("Semana", "");
                    titulo = featured_guardian_info.replace("$NUM0", num);
                };

            } else {
                if ((window.location.href).includes("/es/")) {
                    titulo = "Portada especial: " + titulo.replace("Semana", "semana");
                } else {
                    titulo = featured_guardian_info_special + ': ' + titulo;
                };
            }

            if ((window.location.href).includes("/es/")) {
                html += '<p><i>' + titulo + '.</i></p>'
                + '<p>Fecha: ' + ft[0].date + '</p>';
            } else {
                html += '<p><i>' + titulo + '.</i></p>'
                + '<p>' + guardian_info_date + ' ' + ft[0].date + '</p>';
            }
            //"entry-info-featured"
        }

    }

    // Cierre + flechas
    html += '</div></div></div></div><a class="nav-box-next"></a></div>';

    $("body").append(html);

    var enlace = "https://docs.google.com/forms/d/e/1FAIpQLScHNJ91Bn3QSDk6IsK0J_ZB9Ja5ieWh8s1FdPIYX3HzF7Hwuw/viewform?usp=pp_url&entry.952360021=";
    if (elmnt[0] == "s") {
        enlace += checkFeat[0].entry;
    } else {
        enlace += entry[0].id;
    }

    var cosplayReport = "Notificar cosplay";
    if (!(window.location.href).includes("/es/")) {
        cosplayReport = cosplay_report;
    }
    
    if (entry[0].type != "cosplay") {$("#entry-info-container").append('<span class="cosplay-report"><a href="' + enlace + '" target="_blank">' + cosplayReport + '</a></span>')};
    $("#popupBG").fadeIn(300);
}

function cierraPopup() {
    $("body").css("overflow", "auto");
    $("div").remove("#popupBG");
    $("a").remove(".nav-box-prev");
    $("a").remove(".nav-box-next");
}

// Funciones extras
function toBoolean(b) {
    if (b == "featured") return true 
    else return false;
}