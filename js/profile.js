const URL_CLOTHES = "item/player/", URL_SKIN = "player/skin/", URL_MOUTH = "player/mouth/", URL_EYES = "player/eyes/", URL_HAIR = "player/hair/";
const URL_ICON = "icon/", URL_FULL ="web_full/", URL_HD = "web_hd/", URL_PORTRAIT = "web_portrait/";
var REMOTE = "https://gardiemaker.github.io";

var groupInfo, groupList, groupPet, groupFriend;
var str, portraitMin = false;
var imgurl, galor;

//================================================================

$(document).ready(function () {
    $.get("https://raw.githubusercontent.com/GardieMaker/data/master/status/activities", function(estado, success, xhr) {
        if (!(window.location.href).includes("/es/")) {
            estado = estado.replace("No hay nuevas actividades", nav_notification);
        }
        document.getElementsByClassName("news-latest")[0].innerHTML = estado;
    });

    var dir = "../";
    if ((window.location.href).includes("127") || (window.location.href).includes("192")) { dir = "../../"; }; // local

    const requestInfo = new XMLHttpRequest(); requestInfo.open("GET", dir + "data/groupInfo.json");
    requestInfo.responseType = "json"; requestInfo.send(); requestInfo.onload = function() {

        const requestList = new XMLHttpRequest(); requestList.open("GET", dir + "data/groupList.json");
        requestList.responseType = "json"; requestList.send(); requestList.onload = function() {

            const requestPet = new XMLHttpRequest(); requestPet.open("GET", dir + "data/groupPet.json");
            requestPet.responseType = "json"; requestPet.send(); requestPet.onload = function() {

                const requestFriend = new XMLHttpRequest(); requestFriend.open("GET", dir + "data/groupFriend.json");
                requestFriend.responseType = "json"; requestFriend.send(); requestFriend.onload = function() {

                    groupInfo = requestInfo.response;
                    groupList = requestList.response;
                    groupPet = requestPet.response;
                    groupFriend = requestFriend.response;

                    getCustom(); optPet(); optFriend();
                };
            };
        };
    };
});

function getCustom() {
	str = window.location.search;


    if (str != "") {
        str = str.split("&");

        // Comprobar si es código antiguo
        var busca = [];
        if (str[1] != undefined) busca = groupList.filter(v => {return v.itemId == str[1]});

        if (busca.length == 1) {
            // Es código antiguo
            var mensaje = '<p>Hola, hemos actualizado nuestro sistema de carga de guardianas.</p><p>Si estás leyendo este mensaje, es probable que hayas utilizado un código de carga con el formato antiguo. '
            + 'Estos códigos pueden fallar, por lo que es recomendable dejar de usarlos.</p>'
            + '<p>Se intentará actualizar el código y se recargará la página. Si todo sale bien, utiliza el botón \"Copiar código\" para obtener el código actualizado. Si se presenta algún problema, intenta cargar el código desde el PERFIL o desde el HOME.</p>'
            + '<p>Gracias por su comprensión y disculpen las molestias.</p>';
            var buttonMsg = "ACEPTAR";

            if (!(window.location.href).includes("/es/")) {
                mensaje = '<p>' + onload_formatMsg_one + '</p><p>' + onload_formatMsg_two + '</p><p>' + onload_formatMsg_three + '</p><p>' + onload_formatMsg_four + '</p>';
                buttonsIMG = formatMsg_button;
            };

            $("body").append('<div id="alert-code-format"><span>' + mensaje + '<p><a class="button" onclick="reloadNewCode()">' + formatMsg_button + '</a></p></span></div>');

        } else if (str[0].includes("?s=")) {
            // Carga normal
            var gotoWardrobe = (window.location.href).replace("profile", "wardrobe");
            $("#edit-code").attr("href", gotoWardrobe);

            str = str[0]; str = str.slice(3);
            customArray = str.split("i");
            
            if (customArray.length == 1) {
                document.getElementById("player-display-draggable").style.display = "none";
                $("#reload").addClass("disabled");
                $("#submit-guardian").addClass("disabled");
                $("#get-code").addClass("disabled");
                $("#get-portrait").addClass("disabled");
            }
            if (checkArray()) cargarCanvas();
            $("#footer-info").html(customArray.length + " items en uso.");

            if (customArray.length > 1) {
                var submitLink = (window.location.search).replace("?s=", "");
                submitLink = "https://docs.google.com/forms/d/e/1FAIpQLSfycgchQuYlHzH74toiYmGlWR-x5jP5B680ilWMHs7w7qSJrA/viewform?usp=pp_url&entry.953998871=" + submitLink;
                $("#submit-guardian-link").attr("href", submitLink);
            }
        };

    } else {

        var gotoWardrobe = (window.location.href).replace("profile", "wardrobe");
        $("#edit-code").attr("href", gotoWardrobe);

        $("#footer-info").html("Ningún item en uso.");
        document.getElementById("player-display-draggable").style.display = "none";
        $("#reload").addClass("disabled");
        $("#submit-guardian").addClass("disabled");
        $("#get-code").addClass("disabled");
        $("#get-portrait").addClass("disabled");
    };

    dragGardienne('player-display-draggable');
    dragGardienne('friend-display-draggable');

    dragPet("player-display-pet");
    dragPet("friend-display-pet");


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

//=======================================
function preloadIMG(src) {
    return new Promise(resolve => {
        var img = new Image();
        img.src = src;
        img.onload = () => {resolve(img)}; 
    });
};
//=======================================

function checkArray() {
    var error = "";

    for (c = 0; c < customArray.length; c++) {
        try {
            var getLista = groupList.filter(function(v){return v.itemId == customArray[c]});
            (getLista.length == 0)?(error = "Código incorrecto"):("");
            var getInfo = groupInfo.filter(function(v){return v.groupId == getLista[0].groupId});
        } catch {

            if (error != "") {
                if (!(window.location.href).includes("/es/")) { alert(profile_alert_error);
                } else { alert("El código introducido no es correcto o está corrupto.") };

                document.getElementById("player-display-draggable").style.display = "none";
                $("#reload").addClass("disabled");
                $("#submit-guardian").addClass("disabled");
                $("#get-code").addClass("disabled");
                $("#get-portrait").addClass("disabled");

                return false;

            } else {
                if (!(window.location.href).includes("/es/")) { alert(profile_alert_error);
                } else { alert("Se ha producido un error, la página se actualizará."); };
                location.reload();
            };
        };
    };

    return true;
};

async function cargarCanvas() {

    // Buscar fondo 
    var iBG = null;
    for (f = 0; f < customArray.length; f++ ) {
        var item = groupList.filter(v => {return v.itemId == customArray[f]});
        var grupo = groupInfo.filter(v => {return v.groupId == item[0].groupId});

        if (grupo[0].category == "background") {
            var fondo = document.getElementsByClassName("player-element background-element")[0];
            fondo.style.background = "url('" + URL_SRC + URL_CLOTHES + URL_FULL + item[0].itemURL + "')";
            iBG = f;
        };
    };

    // Cargar canvas
    for (c = 0; c < customArray.length; c++) {
        if (c != iBG) {

            var getLista = groupList.filter(function(v){return v.itemId == customArray[c]});
            var getInfo = groupInfo.filter(function(v){return v.groupId == getLista[0].groupId});

            var newimg;

            switch (getInfo[0].category) {
                case "background": newimg = URL_SRC + URL_CLOTHES + URL_FULL + getLista[0].itemURL; break;
                case "skin": newimg = URL_SRC + URL_SKIN + URL_FULL + getLista[0].itemURL; break;
                case "mouth": newimg = URL_SRC + URL_MOUTH + URL_FULL + getLista[0].itemURL; break;
                case "eye": newimg = URL_SRC + URL_EYES + URL_FULL + getLista[0].itemURL; break;
                case "hair": newimg = URL_SRC + URL_HAIR + URL_FULL + getLista[0].itemURL; break;
                default: newimg = URL_SRC + URL_CLOTHES + URL_FULL + getLista[0].itemURL;
            };

            //*------------------
            var canvas = document.getElementsByTagName("canvas")[0];
            var ctx = canvas.getContext("2d");
            //var img = new Image();

            var ready = await preloadIMG(newimg);
            ctx.drawImage(ready, 0, 0);

        };
    };
};


function optPet() {

    for (s = 0; s < 2; s++) {

        var selP;
        (s == 0)?(selP = document.getElementById("select-player-pet")):(selP = document.getElementById("select-friend-pet"));
        
        var option = document.createElement("option");
        if ((window.location.href).includes("/es/")) { option.text = "Ninguno";
        } else { option.text = panel_left_input_defaults};
        option.value = "none";
        selP.add(option);

        for (p = 0; p < groupPet.length; p++) {
            option = document.createElement("option");
            option.text = groupPet[p][0];
            option.value = groupPet[p][0];
            selP.add(option);
        };
    };
};

function optFriend() {
    var nullSelect = "Ninguno";
    if (!(window.location.href).includes("/es/")) {
        nullSelect = panel_left_input_defaults;
    };

    $("#select-friend").append('<option value="none">' + nullSelect + '</option>');
    $("#select-friend").append('<optgroup id="friend-new-era" label="A New Era"></optgroup>');
    $("#select-friend").append('<optgroup id="friend-origins" label="The Origins"></optgroup>');

    for (f = 0; f < groupFriend.length; f++) {
        if (groupFriend[f].category == "origins") {
            $("#friend-origins").append('<option value="' + groupFriend[f].id + '">' + groupFriend[f].name + '</option>');
        } else {
            $("#friend-new-era").append('<option value="' + groupFriend[f].id + '">' + groupFriend[f].name + '</option>');
        };
    };

    var otherSelect = "Otro...";
    if (!(window.location.href).includes("/es/")) {
        otherSelect = panel_left_friend_other;
    };

    $("#select-friend").append('<option value="add-new">' + otherSelect + '</option>');
};

async function cargarPortrait() {

    for (c = 0; c < customArray.length; c++) {
        var getLista = groupList.filter(function(v){return v.itemId == customArray[c]});
        var getInfo = groupInfo.filter(function(v){return v.groupId == getLista[0].groupId});

        if (getInfo[0].category != "background") {
            var newimg;

            if (portraitMin == false) {

                switch (getInfo[0].category) {
                    case "background": newimg = URL_SRC + URL_CLOTHES + URL_HD + getLista[0].itemURL; break;
                    case "skin": newimg = URL_SRC + URL_SKIN + URL_HD + getLista[0].itemURL; break;
                    case "mouth": newimg = URL_SRC + URL_MOUTH + URL_HD + getLista[0].itemURL; break;
                    case "eye": newimg = URL_SRC + URL_EYES + URL_HD + getLista[0].itemURL; break;
                    case "hair": newimg = URL_SRC + URL_HAIR + URL_HD + getLista[0].itemURL; break;
                    default: newimg = URL_SRC + URL_CLOTHES + URL_HD + getLista[0].itemURL;
                };

            } else {

                switch (getInfo[0].category) {
                    case "background": newimg = URL_SRC + URL_CLOTHES + URL_FULL + getLista[0].itemURL; break;
                    case "skin": newimg = URL_SRC + URL_SKIN + URL_FULL + getLista[0].itemURL; break;
                    case "mouth": newimg = URL_SRC + URL_MOUTH + URL_FULL + getLista[0].itemURL; break;
                    case "eye": newimg = URL_SRC + URL_EYES + URL_FULL + getLista[0].itemURL; break;
                    case "hair": newimg = URL_SRC + URL_HAIR + URL_FULL + getLista[0].itemURL; break;
                    default: newimg = URL_SRC + URL_CLOTHES + URL_FULL + getLista[0].itemURL;
                };

            }

            var canvas = document.getElementById("portrait");
            var ctx = canvas.getContext("2d");
            var img = new Image();

            var ready = await preloadIMG(newimg);
            ctx.drawImage(ready, 0, 0);

        };
    };
};

function cargarPopUp() {

    var div = document.createElement("div");
    div.setAttribute("id","portraitbg");
    document.getElementsByTagName("body")[0].appendChild(div);

    div = document.createElement("div");
    div.setAttribute("id","portraitcontainer");
    document.getElementById("portraitbg").appendChild(div);

    // botón cierra portrait
    div = document.createElement("div");
    div.setAttribute("id", "buttonClose");
    div.setAttribute("onclick", "cierraPopUp()");
    document.getElementById("portraitcontainer").appendChild(div);

    // boton recargar
    div = document.createElement("div");
    div.setAttribute("id", "portrait-buttons");
    document.getElementById("portraitcontainer").appendChild(div);

    div = document.createElement("div");
    div.setAttribute("class", "button");
    div.setAttribute("id", "max-size");
    div.setAttribute("onclick", "maxSize()");
    //(portraitMin == false)?(div.innerHTML = "Volver a cargar"):(div.innerHTML = "Ver. 800x1132");
    (portraitMin == false)?(div.innerHTML = "Volver a cargar"):(div.innerHTML = "Ver. 630x891");
    document.getElementById("portrait-buttons").appendChild(div);

    div = document.createElement("div");
    div.setAttribute("class", "button");
    div.setAttribute("id", "min-size");
    div.setAttribute("onclick", "minSize()");
    (portraitMin == true)?(div.innerHTML = "Volver a cargar"):(div.innerHTML = "Ver. 420x594");
    document.getElementById("portrait-buttons").appendChild(div);

    document.getElementsByTagName("body")[0].setAttribute("style", "overflow:hidden");
};

function cierraPopUp() {
    $("div").remove("#portraitcontainer");
    $("div").remove("#portraitbg");
    document.getElementsByTagName("body")[0].removeAttribute("style");
};

function maxSize() {

    portraitMin = false;
    if ((window.location.href).includes("/es/")) { $("#max-size").text("Volver a cargar");
    } else { $("#max-size").text(profile_button_reload) };
    $("#min-size").text("Ver. 420x594");

    $("canvas").remove("#portrait");
    var portrait = document.createElement("canvas");
    portrait.setAttribute("id","portrait");
    portrait.setAttribute("width", "630");
    portrait.setAttribute("height", "891");
    document.getElementById("portraitcontainer").appendChild(portrait);

    if (checkArray()) cargarPortrait();
};

function minSize() {

    portraitMin = true;
    $("#max-size").text("Ver. 630x891");
    if ((window.location.href).includes("/es/")) { $("#min-size").text("Volver a cargar");
    } else { $("#min-size").text(profile_button_reload) };

    $("canvas").remove("#portrait");
    var portrait = document.createElement("canvas");
    portrait.setAttribute("id","portrait");
    portrait.setAttribute("width", "420");
    portrait.setAttribute("height", "594");
    document.getElementById("portraitcontainer").appendChild(portrait);

    if (checkArray()) cargarPortrait();
};

function cargarPet(select, check, owner) {

    var imagep;
    (owner == "player")?(imagep = document.getElementById("img-player-pet")):(imagep = document.getElementById("img-friend-pet"));

    var imgPet;

    if (select == "none") {
        if (owner == "player") {
            $("#check-player-span").hide();
        } else {
            $("#check-friend-span").hide();
        }

        imagep.src = "";

    } else {
        var fPet = groupPet.filter(function(v){return v[0] == select});

        if (fPet[0][1] === "none" || fPet[0][2] === "none") {
            
            if (owner == "player") {
                $("#check-player-span").hide();
            } else {
                $("#check-friend-span").hide();
            }

            (fPet[0][1] === "none")?(imgPet = fPet[0][2]):(imgPet = fPet[0][1]);

        } else {
            
            if (owner == "player") {
                $("#check-player-span").show();
            } else {
                $("#check-friend-span").show();
            }

            (check === false)?(imgPet = fPet[0][1]):(imgPet = fPet[0][2]);
        };

        imagep.src = "";
        imgPet.includes("eldarya") ? imagep.src = imgPet : imagep.src =  URL_PET + imgPet;
        
        if (select == "Galorze") {
            imagep.style.margin = "-300px 0 -200px -100px";
            galor = true;
        } else {
            
            imagep.style.margin = "0";

            if (galor == true) {
                var asda;
                (owner == "player")?(asda = document.getElementById("player-display-pet")):(asda = document.getElementById("friend-display-pet"));
                
                asda.setAttribute("style","position: absolute; inset: 100px auto auto 100px; width: auto; height: auto");
                galor = false;
            };   
        }  
    };
};

async function cargarFriend(nombre, i) {

    var img = document.getElementById("img-friend");

    if(i != "url") {
        var filtro = groupFriend.filter(function(v){return v.id == parseInt(nombre)});
        var temp = filtro[0].version[i - 1];
        var ready = await preloadIMG(temp);
        
        img.setAttribute("src", ready.src);
        img.style.height = filtro[0].altura;

        var cuenta = ((210 - img.clientWidth)/2);
        img.style.marginLeft = cuenta + "px";

    } else {
        var ready = await preloadIMG(nombre);
        img.setAttribute("src", ready.src);
        img.style.height = $("#input-height").val() + "px";

        var cuenta = ((210 - img.clientWidth)/2);
        img.style.marginLeft = cuenta + "px";

    };
};

function rellenaSelectPosicion() {

    var pet1 = $("#select-player-pet :selected").val();
    var friend = $("#select-friend").val();
    var pet2 = $("#select-friend-pet :selected").val();

    var select = document.getElementById("position-player");
    var gardie = document.getElementById("player-display-draggable");
    $('#position-player option').remove();

    if (gardie.style.display != "none") {
        var option = document.createElement("option");
        if ((window.location.href).includes("/es/")) { option.text = "Gardienne";
        } else { option.text = panel_left_position_gardienne };
        option.value = "gardienne";
        select.add(option);
    };

    if (pet1 != "none") {
        var option = document.createElement("option");
        if ((window.location.href).includes("/es/")) { option.text = "Familiar 1";
        } else { option.text = panel_left_position_pet + " 1"};
        option.value = "pet1";
        select.add(option);
    };

    if (friend != "none") {
        var option = document.createElement("option");
        if ((window.location.href).includes("/es/")) { option.text = "Compañero";
        } else { option.text = panel_left_position_friend};
        option.value = "friend";
        select.add(option);
    };

    if (pet2 != "none") {
        var option = document.createElement("option");
        if ((window.location.href).includes("/es/")) { option.text = "Familiar 2";
        } else { option.text = panel_left_position_pet + " 2"};
        option.value = "pet2";
        select.add(option);
    };

    
    if (select.length > 1) {
        document.getElementsByClassName("bonus-container")[2].style.display = "revert";
    } else {
        document.getElementsByClassName("bonus-container")[2].style.display = "none";
    };
};

function muevePosicion(mov) {
    var select = document.getElementById("position-player");
    var elmnt, z, uno, dos, tres, cuatro;
    var opcion = $("#position-player :selected").val();

    // Obtiene elemento que cambia de posición
    if (opcion == "gardienne") {
        elmnt = document.getElementById("player-display-draggable");
    } else if (opcion == "pet1") {
        elmnt = document.getElementById("player-display-pet");
    } else if (opcion == "friend") {
        elmnt = document.getElementById("friend-display-draggable");
    } else if (opcion == "pet2") {
        elmnt = document.getElementById("friend-display-pet");
    };

    z = elmnt.style.zIndex;

    // Obtiene todos los elementos para obtener posicion
    uno = document.getElementById("player-display-draggable");
    dos = document.getElementById("player-display-pet");
    tres = document.getElementById("friend-display-draggable");
    cuatro = document.getElementById("friend-display-draggable");

    var zUno = uno.style.zIndex;
    var zDos = dos.style.zIndex;
    var zTres = tres.style.zIndex;
    var zCuatro = cuatro.style.zIndex;

    // Fija nueva ubicación
    (mov == "sube")?(z++):(z--);

    // Busca elemento con misma posición de z
    if (mov == "sube") {
        if (z < 5) {
            (zUno == z)?(zUno--):(zDos == z)?(zDos--):(zTres == z)?(zTres--):(zCuatro--);
        };
    } else {
        if (z > 0) {
            (zUno == z)?(zUno++):(zDos == z)?(zDos++):(zTres == z)?(zTres++):(zCuatro++);
        };
    };

    // Fija nuevos posiciones finales
    uno.style.zIndex = zUno;
    dos.style.zIndex = zDos;
    tres.style.zIndex = zTres;
    cuatro.style.zIndex = zCuatro;

    // Solo cambia el valor si z se encuentra dentro del rango
    if (z < 5 && z > 0) {
        elmnt.style.zIndex = z;
    }
}

// ------------------------------------

function dragGardienne(pj) {
    //var elmnt = document.getElementById("player-display-draggable");
    var elmnt = document.getElementById(pj);
    var pos1 = 0, pos3 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    };

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos3 = e.clientX;
        // set the element's new position:
        var val = elmnt.offsetLeft - pos1;

        if (val >= 0 && val <= 590) {
        	elmnt.style.left = (val) + "px";
        } else {
        	(val < 0)?(val = 0):(val = 590);
        	elmnt.style.left = (val) + "px";
        };
    };

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    };
};

function dragPet(id) {
	var pet = document.getElementById(id);
	//var petContainer = document.getElementById("player-pet-containment");
	var pp1 = 0, pp2 = 0, pp3 = 0, pp4 = 0;
	if (document.getElementById(pet.id + "header")) {
		/* if present, the header is where you move the DIV from:*/
		document.getElementById(pet.id + "header").onmousedown = dragMouseDown;
	} else {
		/* otherwise, move the DIV from anywhere inside the DIV:*/
		pet.onmousedown = dragMouseDown;
  	};

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pp3 = e.clientX;
		pp4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	 };

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pp1 = pp3 - e.clientX;
        pp2 = pp4 - e.clientY;
        pp3 = e.clientX;
        pp4 = e.clientY;
        // set the element's new position:

        var vTop = pet.offsetTop - pp2;
        var vLeft = pet.offsetLeft - pp1;

        var petHeight = $("#player-display-pet").height();
        var petWidth = $("#player-display-pet").width();

        if (vLeft >= -182.4 && vLeft <= (982.4 - petWidth)) {
        	pet.style.left = (vLeft) + "px";
        } else {
        	(vLeft < -182.4)?(vLeft = -182.4):(vLeft = (982.4 - petWidth));
        	pet.style.left = (vLeft) + "px";
        };

        if (vTop >= -132 && vTop <= (732 - petHeight)) {
        	pet.style.top = (vTop) + "px";
        } else {
        	(vTop < -132)?(vTop = -132):(vTop = (732 - petHeight));
        	pet.style.top = (vTop) + "px";
        };
    };

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    };
};

// ------------------------------------

$(function() { 
    $("#reload").click(function() { 

        var child = document.getElementsByTagName("canvas")[0];
        var parent = document.getElementsByClassName("playerProfileAvatar")[0];

        parent.removeChild(child);

        var canvas =document.createElement("canvas");
        canvas.width = 420;
        canvas.height = 594;
        parent.appendChild(canvas);

        if (checkArray()) cargarCanvas();
    });

    $("#select-corner-style").change(function() {
        var corner = $(this).val();
        if (corner == "rounded") {
            $("#player-display").css("border-radius", "10px");
        } else if (corner == "straight") {
            $("#player-display").css("border-radius", 0);
        };
    });

    $("#get-portrait").click(function() {
        cargarPopUp();

        if (portraitMin == false) {
            maxSize();
        } else {
            minSize();
        }
    });

    $("#get-code").click(function() {
        var aux = document.createElement("input");
        aux.setAttribute("value",str);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);

        if (!(window.location.href).includes("/es/")) { alert(profile_alert_code);
        } else { alert("Se ha copiado el código.") };
    });

    $("#select-player-pet").change(function() {
        var a = $("#select-player-pet :selected").val();
        var b = $("#check-player-pet").prop('checked');
        var c = "player";
        cargarPet(a,b,c);
        rellenaSelectPosicion();
    });
    $("#check-player-pet").change(function() {
        var a = $("#select-player-pet :selected").val();
        var b = $("#check-player-pet").prop('checked');
        var c = "player";
        cargarPet(a,b,c);
    });

    $("#select-friend-pet").change(function() {
        var a = $("#select-friend-pet :selected").val();
        var b = $("#check-friend-pet").prop('checked');
        var c = "friend";
        cargarPet(a,b,c);
        rellenaSelectPosicion();
    });
    $("#check-friend-pet").change(function() {
        var a = $("#select-friend-pet :selected").val();
        var b = $("#check-friend-pet").prop('checked');
        var c = "friend";
        cargarPet(a,b,c);
    });

    $("#select-friend").change(function() {

        document.getElementById("img-friend").setAttribute("src","");
        $('#select-version option').remove();
        var a = $("#select-friend").val();
        var selV = document.getElementById("select-version");
        document.getElementById("otro-container").style.display = "none";

        if(a != "none"){
            document.getElementById("button-centrar").style.display = "revert";
        } else {
            document.getElementById("button-centrar").style.display = "none";
        };

        if(a != "none" && a != "add-new") {
            document.getElementById("friend-display-draggable").style.display = "block";
            var filtro = groupFriend.filter(function(v){return v.id == parseInt(a)}); // MODIFICAR AQUI

            for (f = 1; f <= filtro[0].version.length; f++) {
                option = document.createElement("option");
                option.text = f;
                selV.add(option);
            };

            selV.style.display = "revert";
            var b = $("#select-version :selected").text();

            cargarFriend(a,b);

        } else if (a == "add-new") {

            selV.style.display = "none";
            document.getElementById("friend-display-draggable").style.display = "none";
            document.getElementById("otro-container").style.display = "block";

        } else {
            document.getElementById("friend-display-draggable").style.display = "none";
            selV.style.display = "none";
        };

        rellenaSelectPosicion();
    });
    $("#select-version").change(function() {
        document.getElementById("img-friend").setAttribute("src","");
        var a = $("#select-friend").val();
        var b = $("#select-version :selected").text();
        cargarFriend(a,b);
    });

    $("#button-centrar").click(function() {
        var img = document.getElementById("img-friend");
        var cuenta = ((210 - img.clientWidth)/2);
        img.style.marginLeft = cuenta + "px";
    });

    $("#load-url").click(function() {
        document.getElementById("friend-display-draggable").style.display = "block";
        var url = $("#input-url").val();
        cargarFriend(url, "url");
        rellenaSelectPosicion();
    });
    
    $("#position-bajar").click(function() {
        muevePosicion("baja");
    });
    $("#position-subir").click(function() {
        muevePosicion("sube");
    });

    $("#load-code").click(function() {
        var inCode = $("#input-code").val();
        if (inCode.includes("&")) {
            // Este es un código formato antiguo
            var mensaje = '<p>Este código está desactualizado y se recomienda dejar de utilizarlo. Utiliza el botón \"Copiar código\" para obtener el código actualizado.</p>'
            var buttonOK = "CONTINUAR";

            if (!(window.location.href).includes("/es/")) { 
                mensaje = '<p>' + load_formatMsg + '</p>';
                buttonOK = load_buttonOK;
            };
            $("body").append('<div id="alert-code-format"><span>' + mensaje + '<p><a class="button" onclick=\'$("#alert-code-format").fadeOut(300);reloadNewCode("input");\'>' + buttonOK + '</a></p></span></div>');

        } else {
            window.location.search = "?s=" + inCode;
        };
    });
});

