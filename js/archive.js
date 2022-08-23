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
    if ((window.location.href).includes("127") || (window.location.href).includes("192")) { dir = "../../"; }; // local

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
    $("#menu-user").append(texto);

    for (i = 0; i < user.length; i++) {
        var p = entrys.filter(v => {return v.alias == user[i].alias});
        p = p.length;
        $("#menu-user").append("<option value='" + user[i].alias + "'>" + user[i].alias + " (" + p + ")</option>");
    }

    var usuario = window.location.search;
    if ((window.location.search).includes("?u=")) {
        usuario = usuario.slice(3);
        $("#menu-user").val(unescape(decodeURIComponent(usuario)));
    };
};

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
    var ranks = 3; // cantidad de rankings
    /* 
        rank0 = total
        rank1 = original
        rank2 = cosplay
    */

    for (r = 0; r < ranks; r++) {
        
        for (a = 0; a < users.length; a++) {
            if (users[a].alias != "Zunay") {
                var p = entrys.filter(v => {return v.alias == users[a].alias});
                
                if (r == 1) { p = p.filter(v => {return v.type == "guardian"});
                } else if (r == 2) { p = p.filter(v => {return v.type == "cosplay"}); };
                
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

        if (r == 0) {
            $(".rt.top1").html('<a href="?u=' + top1[0] + '">' + top1[0] + '</a><span class="top-number">' + top1[1] + '</span>');
            $(".rt.top2").html('<a href="?u=' + top2[0] + '">' + top2[0] + '</a><span class="top-number">' + top2[1] + '</span>');
            $(".rt.top3").html('<a href="?u=' + top3[0] + '">' + top3[0] + '</a><span class="top-number">' + top3[1] + '</span>');

        } else if (r == 1) {
            $(".rg.top1").html('<a href="?u=' + top1[0] + '">' + top1[0] + '</a><span class="top-number">' + top1[1] + '</span>');
            $(".rg.top2").html('<a href="?u=' + top2[0] + '">' + top2[0] + '</a><span class="top-number">' + top2[1] + '</span>');
            $(".rg.top3").html('<a href="?u=' + top3[0] + '">' + top3[0] + '</a><span class="top-number">' + top3[1] + '</span>');

        } else if (r == 2) {
            $(".rc.top1").html('<a href="?u=' + top1[0] + '">' + top1[0] + '</a><span class="top-number">' + top1[1] + '</span>');
            $(".rc.top2").html('<a href="?u=' + top2[0] + '">' + top2[0] + '</a><span class="top-number">' + top2[1] + '</span>');
            $(".rc.top3").html('<a href="?u=' + top3[0] + '">' + top3[0] + '</a><span class="top-number">' + top3[1] + '</span>');
        };

        top1 = ["", 0], top2 = ["", 0], top3 = ["", 0];
    };

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

    $("#filter-search").val("");
};

// Carga de entradas
function cargarListas(pag, busca = null) {

    if (busca == null) {      
        var dataurl = window.location.search;
        var uCAT = dataurl.slice(1,2);
        var uVAL = dataurl.slice(3);
        uVAL = unescape(decodeURIComponent(uVAL));
        uVALP = "";

        // Hay POPUP ?
        var popo = [];
        if (uCAT == "e") {
            if (uVAL[0] != "s" && !uVAL.includes("deleted")) {
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
                    //entry = feat; // Cargar post desde featuredDB

                    console.log(feat.length)
                    entry = feat.filter(v => {return Date.parse(v.date) <= Date.parse(currentDate())})
                    console.log(entry.length)
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

    } else {
        // Buscar categoria
        var entry = [];
        var categ = window.location.search;

        if (categ.includes("guardians")) {
            entry = entrys.filter(v => {return v.type == "guardian"});

        } else if (categ.includes("featured")) {
            // Comprobar fechas!!!
            //entry = feat;
            console.log(feat.length)
            entry = feat.filter(v => {return Date.parse(v.date) <= Date.parse(currentDate())})
            console.log(entry.length)

        } else if (categ.includes("cosplay")) {
            entry = entrys.filter(v => {return v.type == "cosplay"});

        } else if (categ.includes("?u=")) {
            var user = $("#menu-user").val();
            entry = entrys.filter(v => {return v.alias == user});

        } else if (categ.includes("all")) {
            entry = entrys;
        }


        // Filtro 
        busca = normalize(busca).toLowerCase();
        entry = entry.filter(v => {return v.info.name != null});

        entry = entry.filter(function(v){return (normalize(v.info.name).toLowerCase()).includes(busca)});
        
        if (entry.length > 0) {
            dibujaTabla(entry, uVAL, pag);
        } else {

            $("#archive-thumbnail-content table").remove();
            $(".null-search").remove();
            $("#pagination").remove();

            var null_search = "Ningún aporte coincide con la búsqueda";
            if (!(window.location.href).includes("/es/")) {
                null_search = search_preview_null;
            }
            $("#archive-thumbnail-content").append('<span class="null-search">' + null_search + '.</span>');
        }
    };
};

function dibujaTabla(entry, uVAL, pag) {

    $("#archive-thumbnail-content").html("");

    // Si es perfil, mostrar titulo de filtro
    var str = window.location.search;
    if (str.includes("?u=")) {
        str = str.slice(3);
        if ((window.location.href).includes("/es/")) {
            str = '<p>Mostrando todos los aportes de <b>' + unescape(decodeURIComponent(str)) + '</b>.</p>';
        } else {
            var nick = filter_user_info.replace("$NICKNAME", '<b>' + unescape(decodeURIComponent(str))) + '</b>.';
            str = '<p>' + nick + '</p>';
        }
        $("#archive-thumbnail-content").append(str);
    };

    var tabla = "<table>";
    var filtroP = [];
    
    // Cuadros por páginas 12
    var pages = Math.ceil(entry.length / 12);

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

                    tabla += "<td><div id='" + entry[suma].id;
                    if (entry[suma].info.name != null) { tabla += "' title='" + entry[suma].info.name };
                    tabla += "' class='abstract-thumbnail";

                    var searchFeatured = feat.filter(v => {return v.entry == entry[suma].id});
                    // COMPROBAR FECHA
                    if (searchFeatured.length == 1 && (Date.parse(currentDate()) >= Date.parse(searchFeatured[0].date))) {
                        tabla += " featured' style='background-image:url(" + bg 
                        + ")'><span class='feat'>DESTACADA</span>";
                    } else if (entry[suma].type == "cosplay") {
                        tabla += " cosplay'><span class='cplay'>COSPLAY</span>";
                    } else {tabla += "'>";};
                    tabla += "<img src='https://files-accl.zohoexternal.com/public/workdrive-external/previewdata/" + entry[suma].info.png + "?orig=true'></div></td>";
                } else {
                    tabla += "<td></td>";
                }
                    
            } else {

                //if (feat[c + startPage]) {
                if (entry[c + startPage]) {
                    // DESTACADAS

                    var entrada = "";
                    
                    if ((entry[suma].entry[0]) == "s" || (entry[suma].entry[0]) == "d") { // Entradas por actividad / especiales
                        entrada = entry[suma].entryInfo;

                    } else { // Entradas normales
                        entrada = entrys.filter(function(v){return v.id == entry[c + startPage].entry});
                        entrada = entrada[0].info;
                    };

                    // Fondo pequeño
                    var bg = buscaFondo(entrada.code);
                    bg = bg.replace("web_full", "icon");

                    // Mostrar lista de featured
                    tabla += "<td><div id='" + entry[suma].entry;
                    if (entrada.name != null) { tabla += "' title='" + entrada.name };
                    tabla += "' class='abstract-thumbnail";

                    var preview_title = entry[suma].title;

                    if (!(window.location.href).includes("/es/")) {
                        if (preview_title.includes("Semana")) {
                            var num_week = (entry[suma].title).replace("Semana ", "");
                            preview_title = icon_featured_title.replace("$NUM0", num_week);
                        }
                    };

                    tabla += "' class='abstract-thumbnail feat-page'"
                    + " style='background-image:url(" + bg + ")'><span class='feat-title'>" + preview_title + 
                    "</span><img src='https://files-accl.zohoexternal.com/public/workdrive-external/previewdata/" + entrada.png + "?orig=true'></div></td>";
                    
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
    if (pages > 1) hacerPagination(pag, pages);
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
        for (s = 0; s < paginas; s++) {
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
            for (i = 0; i < paginas; i++) {
                var num = i + 1;
                if (i != 11){
                    if (i == activa) {
                        truncation.push('<div class="page selected" page-number="' + num + '">' + num + '</div>');
                    } else {
                        truncation.push('<div class="page" page-number="' + num + '">' + num + '</div>');
                    };
                } else {
                    truncation.push('<span class="truncation">...</span>');
                    i = (paginas - 3);
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
            for (f = 0; f < paginas; f++) {
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
            var busca = $("#filter-search").val();
            if (busca == "") {
                cargarListas(pagina);
            } else {
                cargarListas(pagina, busca);
            };
        }
    });

    $("body").on("click", ".button-container.config", function () {
        if ($("#guardian-config-container").length == 0) {
            var g_editar = "Solicitar cambios";
            var g_borrar = "Solicitar eliminación";
            var g_cancel = "Cancelar";

            if (!(window.location.href).includes("/es/")) {
                g_editar = guardian_config_edit;
                g_borrar = guardian_config_delete;
                g_cancel = guardian_config_cancel;
            };

            var editID = $("#entry-info-container").attr("entry-dataid");
            var deleteID = "https://docs.google.com/forms/d/e/1FAIpQLSdKbNorlvZ4NTXn0v8hqG_nkePF_0-uMkD6Lp_0HdEe435DlA/viewform?usp=pp_url&entry.805338632=" + editID;
            editID = "https://docs.google.com/forms/d/e/1FAIpQLSeZqI2pT0W4I5_gJfNm8i85h3uZ_qDOfeRuQCLISsyAK-6__Q/viewform?usp=pp_url&entry.805338632=" + editID;


            $("#entry-info-container").append('<div id="guardian-config-container"></div>');
            $("#guardian-config-container").append('<div id="config-edit" class="guardian-config-button"><a href="' + editID + '" target="_blank"><div class="button">' + g_editar + '</div></a></div>');
            $("#guardian-config-container").append('<div id="config-delete" class="guardian-config-button"><a href="' + deleteID + '" target="_blank"><div class="button">' + g_borrar + '</div></a></div>');
            $("#guardian-config-container").append('<div id="config-cancel" class="guardian-config-button"><div class="button">' + g_cancel + '</div></div>');
        };
        $("#guardian-config-container").fadeIn(200);
    });

    $("body").on("click", "#config-cancel", function() {
        $("#guardian-config-container").fadeOut(200);
    });


    $("#filter-search").on("input", function() {
        // NUEVO BUSCADOR
        if ($(this).val() != "") {
            cargarListas(0, $(this).val());
        } else {
            cargarListas(0);
        };
    });
});

function buscaFondo(code) {
    var enlace = "";
    var code = code.split("i");
    for (a = 0; a < code.length; a++) {
        var check = groupInfo.filter(v => {return v.groupId == code[a]});
        if (check.length == 1) {
            if (check[0].category == "background") {
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
    $("body").append('<div id="popupBG"><a class="nav-box-prev"></a><div id="popupW"></div><a class="nav-box-next"></a></div>');
    $("#popupW").append('<div id="button-close" onclick="cierraPopup()"></div>');


    var entry = "";
    if (elmnt[0] == "s" || elmnt[0] == "d") { // Siempre son destacadas
        entry = feat.filter(v => {return v.entry == elmnt});
        var fondo = buscaFondo(entry[0].entryInfo.code);

        // Div principal
        $("#popupW").append('<div id="entry-info-container" entry-dataid="' + entry[0].entry + '" style="background-image: url(' + fondo + ')"></div>');

        // Gardienne + nombre || id
        $("#entry-info-container").append('<img src="https://files-accl.zohoexternal.com/public/workdrive-external/previewdata/' + entry[0].entryInfo.png + '?orig=true">');
        $("#entry-info-container").append('<div id="entry-info-menu"></div>');
        $("#entry-info-menu").append('<div id="entry-info-quote"></div>');

        // Cuadro blanco
        if (elmnt[0] == "s") {
            $("#entry-info-quote").append('<h2>' + entry[0].entryInfo.field[0] + '</h2>');

            for (a = 1; a < entry[0].entryInfo.field.length; a++) {
                $("#entry-info-quote").append('<p>' + entry[0].entryInfo.field[a] + '</p>');
            };
        } else {
            if (entry[0].entryInfo.name == null) {
                $("#entry-info-quote").append('<h2>' + entry[0].entry + '</h2>');
            } else {
                $("#entry-info-quote").append('<h2>' + entry[0].entryInfo.name + '</h2>');
            }


            // Estado e info de cuenta

            if ((window.location.href).includes("/es/")) {
                if (elmnt[0] == "d") {
                    $("#entry-info-quote").append('<p>Enviada por: <i style="color: #ca3636;">' + entry[0].alias + '</i></p>');
                } else {
                    $("#entry-info-quote").append('<p>Enviada por: <a href="?u=' + entry[0].alias + '">' + entry[0].alias);
                };

                $("#entry-info-quote").append('<p>Fecha: ' + entry[0].entryInfo.date +'</p><p>Abrir en: <a href="profile?s=' + entry[0].entryInfo.code + '"> Perfil</a> | <a href="wardrobe?s=' + entry[0].entryInfo.code + '">Vestidor</a></p>');

            } else {
                if (elmnt[0] == "d") {
                    $("#entry-info-quote").append('<p>' + guardian_info_author + ': <i style="color: #ca3636;">' + entry[0].alias + '</i></p>');
                } else {
                    $("#entry-info-quote").append('<p>' + guardian_info_author + ': <a href="?u=' + entry[0].alias + '">' + entry[0].alias + '</a></p>');
                };

                $("#entry-info-quote").append('<p>' + guardian_info_date + ': ' + entry[0].entryInfo.date + '</p><p>' + guardian_info_open + ': <a href="profile?s=' + entry[0].entryInfo.code + '"> ' + guardian_info_open_profile + '</a> | <a href="wardrobe?s=' + entry[0].entryInfo.code + '">' + guardian_info_open_wardrobe + '</a></p>');
            };
        };

    } else {
        entry = entrys.filter(function(v) {return v.id == elmnt});
        var fondo = buscaFondo(entry[0].info.code);

        // Div principal
        $("#popupW").append('<div id="entry-info-container" entry-dataid="' + entry[0].id + '" style="background-image: url(' + fondo + ')"></div>');

        // Gardienne + nombre || id
        $("#entry-info-container").append('<img src="https://files-accl.zohoexternal.com/public/workdrive-external/previewdata/' + entry[0].info.png + '?orig=true">');
        $("#entry-info-container").append('<div id="entry-info-menu"></div>');
        $("#entry-info-menu").append('<div id="entry-info-quote"></div>');

        if (entry[0].type == "cosplay") {
            if ((window.location.href).includes("/es/")) {
                $("#entry-info-quote").append('<span id="entry-info-cosplay">COSPLAY</span>');
            } else {
                $("#entry-info-quote").append('<span id="entry-info-cosplay">' + icon_cosplay_title.toUpperCase() + '</span>');
            };
        };

        if (entry[0].info.name) {$("#entry-info-quote").append('<h2>' + entry[0].info.name + '</h2><p>ID: ' + entry[0].id + '</p>')} 
        else {$("#entry-info-quote").append('<h2>ID: ' + entry[0].id + '</h2>')};

        // Estado e info de cuenta
        var user = users.filter(function(v) {return v.alias == entry[0].alias});


        var edited = "";
        var buscarEdit = entrys.filter(v => {return v.id == elmnt});
        if (buscarEdit[0].info.edited != undefined) {
            edited = '<span title="Última edición: ' + buscarEdit[0].info.edited + '" class="edited fas fa-pen-square"></span>';
            if (!(window.location.href).includes("/es/")) {
                edited = edited.replace("Última edición", guardian_info_edited);
            };
        };

        if ((window.location.href).includes("/es/")) {
            var account_status = '<span class="s-verified" title="Cuenta verificada"></span>';
            if (!user[0].verified) account_status = '<span class="s-pending" title="Cuenta sin verificar"></span>';

            $("#entry-info-quote").append('<p>Enviada por: <a href="?u=' + entry[0].alias + '">' + entry[0].alias + '</a>' + account_status + '</p>');
            $("#entry-info-quote").append('<p>Fecha: ' + entry[0].info.date + edited +'</p><p>Abrir en: <a href="profile?s=' + entry[0].info.code + '"> Perfil</a> | <a href="wardrobe?s=' + entry[0].info.code + '">Vestidor</a></p>');

        } else {
            var account_status = '<span class="s-verified" title="' + account_status_OK + '"></span>';
            if (!user[0].verified) account_status = '<span class="s-pending" title="' + account_status_bad + '"></span>';

            $("#entry-info-quote").append('<p>' + guardian_info_author + ': <a href="?u=' + entry[0].alias + '">' + entry[0].alias + '</a>' + account_status + '</p>');
            $("#entry-info-quote").append('<p>' + guardian_info_date + ': ' + entry[0].info.date + edited + '</p><p>' + guardian_info_open + ': <a href="profile?s=' + entry[0].info.code + '"> ' + guardian_info_open_profile + '</a> | <a href="wardrobe?s=' + entry[0].info.code + '">' + guardian_info_open_wardrobe + '</a></p>');
        };
    };
    

    // Destacada ? comprobar fecha
    var checkFeat = feat.filter(v => {return v.entry == elmnt});

    if (checkFeat.length == 1 && (Date.parse(currentDate()) >= Date.parse(checkFeat[0].date))) {
        $("#entry-info-menu").append('<div id="entry-info-featured"></div>');

        if ((window.location.href).includes("/es/")) { $("#entry-info-featured").append('<h2>★ Guardiana Destacada ★</h2>');
        } else { $("#entry-info-featured").append('<h2>★ ' + featured_guardian_title + ' ★</h2>') };
        var titulo = "";

        if (checkFeat[0].entry[0] == "s") {
            if ((window.location.href).includes("/es/")) {
                $("#entry-info-featured").append("<p><i>Por actividad: <a href='" + checkFeat[0].postInfo.enlace + "' target='_blank'>" + checkFeat[0].postInfo.actividad + "</a>.</i></p>");
                $("#entry-info-featured").append('<p>Fecha: ' + checkFeat[0].date + '</p>');
            } else {
                $("#entry-info-featured").append('<p><i>' + featured_guardian_info_activity + ": <a href='" + checkFeat[0].postInfo.enlace + "' target='_blank'>" + checkFeat[0].postInfo.actividad + "</a>.</i></p>");
                $("#entry-info-featured").append('<p>' + guardian_info_date + ': ' + checkFeat[0].date + '</p>');
            }
        } else if (checkFeat[0].entry[0] == "d") {
            var titulo = checkFeat[0].title;
            if ((window.location.href).includes("/es/")) {
                $("#entry-info-featured").append("<p><i>En portada durante la " + titulo.replace("Semana", "semana") + "</i></p>");
                $("#entry-info-featured").append('<p>Fecha: ' + checkFeat[0].date + '</p>');
            } else {
                var num = titulo.replace("Semana", "");
                $("#entry-info-featured").append("<p><i>" + featured_guardian_info.replace("$NUM0", num) + "</i></p>");
                $("#entry-info-featured").append('<p>' + guardian_info_date + ': ' + checkFeat[0].date + '</p>');
            };

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

            $("#entry-info-featured").append('<p><i>' + titulo + '.</i></p>');

            if ((window.location.href).includes("/es/")) {
                $("#entry-info-featured").append('<p>Fecha: ' + ft[0].date + '</p>');
            } else {
                $("#entry-info-featured").append('<p>' + guardian_info_date + ': ' + ft[0].date + '</p>');
            }
            //"entry-info-featured"
        }

    }

    // Cierre + flechas

    //$("body").append(html);

    var enlace = "https://docs.google.com/forms/d/e/1FAIpQLScHNJ91Bn3QSDk6IsK0J_ZB9Ja5ieWh8s1FdPIYX3HzF7Hwuw/viewform?usp=pp_url&entry.952360021=";
    if (elmnt[0] == "s") {
        enlace += checkFeat[0].entry;
    } else {
        enlace += entry[0].id;
    }

    var cosplayReport = "Notificar cosplay";
    var configGuardian = "Opciones";
    if (!(window.location.href).includes("/es/")) {
        cosplayReport = cosplay_report;
        configGuardian = config_guardian;
    }
    if (entry[0].featured != true) {
        // Edición de aportes
        $("#entry-info-container").append('<div id="buttons-container"><div class="button-container config"><div title="' + configGuardian + '" class="button-icon"><span class="fas fa-bars"></span></div></div></div>');
    };
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