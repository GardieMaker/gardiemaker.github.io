var groupInfo = "", groupList = "";

$(document).ready(function iniciaTodo() {
    $.get("https://raw.githubusercontent.com/GardieMaker/data/master/status/activities", function(estado, success, xhr) {
        if (!(window.location.href).includes("/es/")) {
            estado = estado.replace("No hay nuevas actividades", nav_notification);
        }
        document.getElementsByClassName("news-latest")[0].innerHTML = estado;
    });

    var dir = "../";
    if ((window.location.href).includes("127") || (window.location.href).includes("192")) { dir = "../../"; }; // local

    const gi = new XMLHttpRequest(); gi.open("GET", dir + "data/groupInfo.json");gi.responseType = "json"; gi.send();
    gi.onload = function() { groupInfo = gi.response;
        const gl = new XMLHttpRequest(); gl.open("GET", dir + "data/groupList.json");gl.responseType = "json"; gl.send();
        gl.onload = function() { groupList = gl.response;

            const gd = new XMLHttpRequest();gd.open("GET", dir + "data/usr/featured.json");gd.responseType = "json";gd.send();
            gd.onload = function() {
                const lista = new XMLHttpRequest();lista.open("GET", dir + "data/usr/entries.json");lista.responseType = "json";lista.send();
                lista.onload = function() {featured(gd.response, lista.response);};
            };
        };
    };

    $.get("https://raw.githubusercontent.com/GardieMaker/data/master/status/affiliates", function(afiliados, success, xhr) {
        if (!(window.location.href).includes("/es/")) {
            afiliados = afiliados.replace("Páginas amigas", nav_affiliates);
        }
        document.getElementById("footer-info").innerHTML = afiliados;
    });

});

function get(blogger) {
    // Obtener los tres últimos posts [ Fecha + Categoría + Título ]
    var entradas = 0, html = "", titulo, fecha, url;

    for (post = 0; post < blogger.feed.entry.length; post++) {
        if (entradas == 3) break;
        
        for (tag = 0; tag < blogger.feed.entry[post].category.length; tag++) {
            var categoria = blogger.feed.entry[post].category[tag].term;
            // Categorías [ anuncios, changelog, featured, updates, actividades ]

            if (categoria == "anuncios" || categoria == "changelog" || categoria == "featured" || categoria == "updates" || categoria == "actividades" ) {
                // Post válido
                switch (categoria) {
                    case "anuncios":titulo = "[ANUNCIO] ";break;
                    case "changelog":titulo = "[CHANGELOG] ";break;
                    case "featured":titulo = "[PORTADA] ";break;
                    case "updates":titulo = "[ACTUALIZACIÓN] ";break;
                    case "actividades":titulo = "[ACTIVIDAD] ";break;
                    default: titulo = "";
                };

                if (titulo != "") {
                    // Buscar titulo y fecha
                    titulo = titulo + blogger.feed.entry[post].link[4].title;
                    fecha = blogger.feed.entry[post].published.$t;
                    fecha = fecha.slice(8,10) + "/" + fecha.slice(5,7);
                    url = blogger.feed.entry[post].link[4].href;

                    html = html + '<div class="news"><div class="date">' + fecha
                                + '</div><div class="text"><a href="' + url
                                + '">' + titulo + '</a></div></div>';
                    entradas++;
                    break;
                };
            };
        };
    };

    $(document).ready(function () {
        document.getElementById("news-list").innerHTML = html;
    });
};

function featured(feat, entries) {

    // Buscar fondo en el código
    

    if (feat[0].entry[0] != "s") {
        var entry = entries.filter(function(v){return v.id == feat[0].entry});
        var fondo = buscaFondo(entry[0].info.code);

        document.getElementById("portrait").src = "https://docs.zoho.com/docs/orig/" + entry[0].info.png;

        document.getElementById("portrait").style.background = "url('" + fondo +  "') top center";

        if (entry[0].info.name == null) {
            document.getElementById("index-featured-title").innerHTML = 'ID : <a href="archive?e=' + entry[0].id + '">' + entry[0].id + '</a></div>'
        } else {
            document.getElementById("index-featured-title").innerHTML = '<a href="archive?e=' + entry[0].id + '">' + entry[0].info.name + '</a></div>'
        };

        if ((window.location.href).includes("/es/")) {
            document.getElementById("index-featured-info").innerHTML = 'De: <a href="archive?u=' + entry[0].alias + '">'
            + entry[0].alias + '</a><br><br>Abrir en: <a href="wardrobe?s='
            + entry[0].info.code + '">Vestidor</a> | <a href="profile?s='
            + entry[0].info.code + '">Perfil</a><br><br><a href="https://docs.zoho.com/docs/orig/'
            + entry[0].info.png + '" target="_blank">Ver en tamaño completo</a>';
        } else {
            document.getElementById("index-featured-info").innerHTML = featured_from + ': <a href="archive?u=' + entry[0].alias + '">'
            + entry[0].alias + '</a><br><br>' + featured_open + ': <a href="wardrobe?s='
            + entry[0].info.code + '">' + featured_open_wardrobe + '</a> | <a href="profile?s='
            + entry[0].info.code + '">' + featured_open_profile + '</a><br><br><a href="https://docs.zoho.com/docs/orig/'
            + entry[0].info.png + '" target="_blank">' + featured_open_full + '</a>';
        };

    } else {

        var fondo = buscaFondo(feat[0].entryInfo.code);
        $("#portrait").attr("src", "https://docs.zoho.com/docs/orig/" + feat[0].entryInfo.png);
        $("#portrait").css("background", "url(" + fondo + ")");
        $("#index-featured-title").html('<a href="archive?e=' + feat[0].entry + '">' + feat[0].entryInfo.field[0] + '</a></div>');

        $("#index-featured-info").html('Actividad: <a href="' + feat[0].postInfo.enlace + '" target="_blank">'
        + feat[0].postInfo.actividad + '</a><br><br>Abrir en: <a href="wardrobe?s='
        + feat[0].entryInfo.code + '">Vestidor</a> | <a href="profile?s='
        + feat[0].entryInfo.code + '">Perfil</a><br><br><a href="https://docs.zoho.com/docs/orig/'
        + feat[0].entryInfo.png + '" target="_blank">Ver en tamaño completo</a>');
        
    };
};

function newFormatCode() {
        var code = $("#input-code").val()
        code = code.replace(/&/g, "i");
        window.location.href = "profile?s=" + code;
}

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

$(function() { 
    $("#load-code").click(function() {
        var input = $("#input-code").val();

        if (input.includes("&")) {
            // Codigo viejo
            input = input.replace(/&/g, "i")
            var mensaje = '<p>Este código está desactualizado y se recomienda dejar de utilizarlo. Utiliza el botón \"Copiar código\" en el Perfil para obtener el código actualizado.</p>';
            var buttonOK = "CONTINUAR";
            if (!(window.location.href).includes("/es/")) {
                mensaje = '<p>' + load_formatMsg + '</p>';
                buttonOK = load_buttonOK;
            };
            $("body").append('<div id="alert-code-format"><span>' + mensaje + '<p><a class="button" onclick=\';newFormatCode("input");\'>' + buttonOK + '</a></p></span></div>');
        } else {
            window.location.href = "profile?s=" + input;    
        };
    });
});
