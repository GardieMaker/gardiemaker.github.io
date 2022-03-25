var str;

$(document).ready(function(){

	$.get("https://raw.githubusercontent.com/GardieMaker/data/master/status/activities", function(estado, success, xhr) {
		if (!(window.location.href).includes("/es/")) {
            estado = estado.replace("No hay nuevas actividades", nav_notification);
        }
        document.getElementsByClassName("news-latest")[0].innerHTML = estado;
	});

    $.get("https://raw.githubusercontent.com/GardieMaker/data/master/status/affiliates", function(afiliados, success, xhr) {
        if (!(window.location.href).includes("/es/")) {
            afiliados = afiliados.replace("Páginas amigas", nav_affiliates);
        }
        document.getElementById("footer-info").innerHTML = afiliados;
    });

	str = window.location.search;

	if (str.includes("general")) {
		document.querySelector("#menu-general > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoGeneral);
		} else { cargarContent(infoGeneralT) };
	} else if (str.includes("wardrobe")) {
		document.querySelector("#menu-wardrobe > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoWardrobe);
		} else { cargarContent(infoWardrobeT) };
	} else if (str.includes("profile")) {
		document.querySelector("#menu-profile > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoProfile);
		} else { cargarContent(infoProfileT) };
	} else if (str.includes("contests")) {
		document.querySelector("#menu-contests > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoContests);
		} else { cargarContent(infoContestsT) };
	} else {
		str="?general";
		history.pushState(null, "", "?general");
		document.querySelector("#menu-general > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoGeneral);
		} else { cargarContent(infoGeneralT) };
	};

	if (str.includes("q1")) {
		abrePregunta(1);
	} else if (str.includes("q2")) {
		abrePregunta(2);
	} else if (str.includes("q3")) {
		abrePregunta(3);
	} else if (str.includes("q4")) {
		abrePregunta(4);
	} else if (str.includes("q5")) {
		abrePregunta(5);
	} else if (str.includes("q6")) {
		abrePregunta(6);
	} else if (str.includes("q7")) {
		abrePregunta(7);
	} else if (str.includes("q8")) {
		abrePregunta(8);
	};

	if (str.includes("general")) {
		str = "?general";
	} else if (str.includes("wardrobe")) {
		str = "?wardrobe";
	} else if (str.includes("profile")) {
		str = "?profile";
	} else if (str.includes("contests")) {
		str = "?contests";
	};
});

$(function() {
	$("#menu-general").click(function(){
		str = "?general";
		document.getElementsByClassName("on")[0].removeAttribute("class");
		document.querySelector("#menu-general > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoGeneral);
		} else { cargarContent(infoGeneralT); };
	});

	$("#menu-wardrobe").click(function(){
		str = "?wardrobe";
		document.getElementsByClassName("on")[0].removeAttribute("class");
		document.querySelector("#menu-wardrobe > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoWardrobe);
		} else { cargarContent(infoWardrobeT); };
	});

	$("#menu-profile").click(function(){
		str = "?profile";
		document.getElementsByClassName("on")[0].removeAttribute("class");
		document.querySelector("#menu-profile > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoProfile);
		} else { cargarContent(infoProfileT); };
	});

	$("#menu-contests").click(function(){
		str = "?contests";
		document.getElementsByClassName("on")[0].removeAttribute("class");
		document.querySelector("#menu-contests > li").setAttribute("class", "on");
		if ((window.location.href).includes("/es/")) { cargarContent(infoContests);
		} else { cargarContent(infoContestsT); };
	});


	$("#support-category-content").on("click", "#q1", function(){
		history.pushState(null, "", str + "=q" + 1);
		abrePregunta(1);
	});

	$("#support-category-content").on("click", "#q2", function(){
		history.pushState(null, "", str + "=q" + 2);
		abrePregunta(2);
	});

	$("#support-category-content").on("click", "#q3", function(){
		history.pushState(null, "", str + "=q" + 3);
		abrePregunta(3);
	});

	$("#support-category-content").on("click", "#q4", function(){
		history.pushState(null, "", str + "=q" + 4);
		abrePregunta(4);
	});

	$("#support-category-content").on("click", "#q5", function(){
		history.pushState(null, "", str + "=q" + 5);
		abrePregunta(5);
	});

	$("#support-category-content").on("click", "#q6", function(){
		history.pushState(null, "", str + "=q" + 6);
		abrePregunta(6);
	});

	$("#support-category-content").on("click", "#q7", function(){
		history.pushState(null, "", str + "=q" + 7);
		abrePregunta(7);
	});

	$("#support-category-content").on("click", "#q8", function(){
		history.pushState(null, "", str + "=q" + 8);
		abrePregunta(8);
	});

});


function abrePregunta(num) {
	if (document.getElementsByClassName("question")[num - 1].getAttribute("class") != "question active") {
		cierraActivo();
		document.getElementsByClassName("question")[num - 1].setAttribute("class", "question active");
		document.getElementsByClassName("answer")[num - 1].style.display = "block";

	} else {
		cierraActivo();
	};
}

function cargarContent(info) {
	history.pushState(null, "", str);
	$("div").remove(".question");
	var contenedor = document.getElementById("support-category-content");

	for (i = 0; i < info.length; i++) {
		var div = document.createElement("div");
		div.setAttribute("class", "question");
		contenedor.appendChild(div);

		var question = document.getElementsByClassName("question");

		div = document.createElement("div");
		div.setAttribute("id", "q" + (i + 1));
		div.innerHTML = info[i].question;
		question[i].appendChild(div);

		div = document.createElement("div");
		div.setAttribute("class", "answer");
		div.innerHTML = info[i].answer;
		question[i].appendChild(div);
	};
};

function cierraActivo() {
	var activo = document.getElementsByClassName("question active");
	if (activo.length > 0) {
		activo[0].setAttribute("class", "question");
		var answer = document.getElementsByClassName("answer");
		for (i = 0; i < answer.length; i ++) {
			if (answer[i].style.display == "block") {
				answer[i].style.display = "none";
				break;
			};
		};
	};
};

var infoGeneral = [
	{'question':'¿Qué es GardieMaker?',
	'answer':'GardieMaker es una aplicación web que cree con la finalidad de juntar la mayor cantidad posible de prendas que están disponibles en Eldarya. Mi objetivo era crear un vestidor gigante y libre de limitaciones en el cual puedes crear y vestir a tu guardiana como siempre has querido hacerlo; teniendo acceso, además, a items exclusivos de eventos pasados y del servidor francés. Este es un proyecto ambicioso en el cual trabajo día a día con la intención de superarme y mejorar poco a poco todo esto.<br><br>Este proyecto fue realizado por mí con fines de aprendizaje, sin fines de lucro y con la mera intención de entretener. Las imagenes y los diseños utilizados son propiedad de Beemoov y en ningún momento pretendo apropiarme de los mismos.'},
	{'question':'¿Cómo reportar?', 
	'answer':'Para reportar algún error o problema que encuentres en el funcionamiento del vestidor o del perfil, puedes dejar un <a href="https://gardiemaker.blogspot.com/p/reportar-un-problema.html">comentario aquí</a> o enviar un email a <a href="mailto:gardiemaker@gmail.com">gardiemaker@gmail.com</a> con el asunto "Reporte". Ten en cuenta que, si se trata de un error de funcionamiento, es necesario que detalles el contexto que te llevó a dicho error (si quitaste una prenda, cambiaste algún filtro, etc) y cual es el error (no cargó, cargó mal algo, etc).'},
	{'question':'Páginas amigas / Afiliaciones', 
	'answer':'<h4>¿Qué es una afiliación?</h4>Se le llama afiliación (también conocido como “páginas amigas”) a un acuerdo amistoso entre dos personas o dos grupos de personas, en el cual ambos acuerdan promocionar el blog/página de la otra persona a cambio de que la otra persona promocione el blog/página propio, con la única finalidad de publicitarse mutuamente.<br><br><h4>¿Cómo podemos afiliarnos?</h4>Es muy sencillo, solo tienes que enviarme un email a <a href="mailto:gardiemaker@gmail.com">gardiemaker@gmail.com</a> con el asunto "Afiliación" y envíame el link de tu blog/página + un banner/botón para que yo pueda promocionarte aquí. Por supuesto, la afiliación deberá ser mutua, así que verificaré que cuentes con algún banner mío antes de agregar el tuyo.<br><br><h4>Banners de GardieMaker</h4><a href="https://64.media.tumblr.com/a4026aa525a63eaf98bd34ca36f98ce0/tumblr_inline_qcf3hrcRaT1wxxmsr_500.png" target="_blank" title="70x70"><img src="https://64.media.tumblr.com/a4026aa525a63eaf98bd34ca36f98ce0/tumblr_inline_qcf3hrcRaT1wxxmsr_500.png"></a> <a href="https://64.media.tumblr.com/da8dd9efb4fd8c6376ad00a1c84c437e/tumblr_inline_qcf3i6GPJE1wxxmsr_500.png" target="_blank" title="150x70"><img src="https://64.media.tumblr.com/da8dd9efb4fd8c6376ad00a1c84c437e/tumblr_inline_qcf3i6GPJE1wxxmsr_500.png"></a><br><br><u>NOTA:</u> Si vas afiliarme, por favor utiliza el enlace limpio (https://gardiemaker.github.io).'},
	{'question':'Servidores / Traducciones (en-US / fr-FR)',
	'answer':'Me encantaría traducir GardieMaker a otros idiomas pero me es imposible hacerlo yo misma. Si estás interesado y te gustaría ayudar a traducir GardieMaker al idioma de tu servidor, envía un correo electrónico a <a href="mailto:gardiemaker@gmail.com">gardiemaker@gmail.com</a> (español o inglés si es posible) haciéndomelo saber.<br></br><b>Servidor FR:</b> Traducido por <a href="https://www.eldarya.fr/player/profile/Elk%C3%B6" target="_blank">Elkö</a>.<br><br><b>Servidor BR:</b> Traducido por Becky ( <a href="https://www.twitter.com/seiyanoir" target="_blank">Twitter</a> / <a href="https://www.facebook.com/starfightersimp" target="_blank">Facebook</a> ).<br><br><b>Otros servidores:</b> Necesito ayuda para traducir la interfaz y la totalidad de los nombres de la ropa.<br></br><b>IMPORTANTE</b><br>No está demás decir que a menudo cambio algún que otro texto de la interfaz, por lo que deberás estar realmente comprometido a mantener las traducciones al día.'},
	{'question':'¿Dudas?',
	'answer':'Cualquier inquietud, idea o sugerencia que tengas sobre cualquier cosa, puedes dejar tu mensaje en <a href="https://znfaq.tumblr.com/" target="_blank">ESTE BLOG</a>, o también puedes escribirme un mail a <a href="mailto:gardiemaker@gmail.com">gardiemaker@gmail.com</a>.'}
]

var infoWardrobe = [
	{'question':'No hay ninguna Gardienne para vestir.',
	'answer':'¡Tú tienes que crearla! La idea de no poner un Gardienne de base es para que tú puedas crearla como a ti te guste.'},
	{'question':'No puedo elegir ninguna prenda.',
	'answer':'El vestidor se maneja con códigos que son ubicados en el enlace. Si no puedes cargar ninguna prenda comprueba que el enlace en el que te encuentres no esté corrupto. Prueba reiniciando el vestidor con el botón en la esquina superior derecha o vuelve a abrirlo haciendo <a href="wardrobe">clic aquí</a>. Si el error persiste por favor repórtalo vía email a <a href="mailto:gardiemaker@gmail.com">gardiemaker@gmail.com</a>'},
	{'question':'El vestidor se recarga solo y no puedo usarlo.',
	'answer':'El vestidor está preparado para que, si existe algún problema al cargar las prendas, éste se reinicie solo. Si la página se recarga sola más de 4 veces, es probable que sea un problema del servidor. Lo mejor solución es esperar un rato e intentarlo más tarde. Si el problema persiste no dudes en enviearme un mail a <a href="mailto:gardiemaker@gmail.com">gardiemaker@gmail.com</a>.'},
	{'question':'Faltan los conjuntos de x evento.',
	'answer':'Si se trata de un evento antiguo, te pido paciencia, trabajo día a día para juntar cada una de las prendas, y conseguir sus códigos es más tedioso de lo que parece.<br><br>Si se trata de un evento activo y es un evento de exploración, puedo tardar como máximo dos o tres días de iniciado el evento en recolectar todas las prendas. Si es un evento de misiones o minijuegos, no puedo permitirme completarlo con MO por lo que deberás esperar a que finalice el evento para que sean agregadas.<br><br>Si el evento ya finalizó y sigues esperando las prendas nuevas, quizás deberías visitar el blog más seguido o mínimo usar el buscador. Las prendas no se ordenan por orden de salida sino por sus códigos, por lo que no siempre verás las prendas nuevas al principio de la lista.'},
	{'question':'Las prendas animadas no se mueven.',
	'answer':'Y no lo harán. Solo puse las imagenes porque era demasiado tedioso agregar las animaciones.'},
	{'question':'Filtros manuales.',
	'answer':'Además de los filtros comunes ya visibles, el vestidor cuenta con algunos filtros especiales. Estos son "manuales" puesto que son atajos o palabras claves que deben escribirse en el buscador. Actualmente los filtros manuales son:<ul><li><u>Códigos:</u> Las prendas pueden buscarse por su código exacto.</li><li><u>Arcoíris:</u> Estas prendas ya no cuentan con un filtro normal pero ahora pueden filtrarse de manera manual, basta con poner "#rainbow" en el buscador.</li><li><u>Ópalos:</u> Usando "#shiny" puedes filtrar las prendas con estos colores.</li><li><u>Eventos:</u> Puedes filtrar las prendas por eventos específicos. Para usar este filtro basta con poner las siglas del evento y el año del mismo unidos por dos puntos (":"). Por ejemplo "SV:2018" o "sv:2018" muestra todas las prendas del evento de San Valentín 2018. A su vez, puedes usar solo la sigla ("SV:" o "sv:") para buscar las prendas de todos los eventos de San Valentín, o el año (":2018") para filtrar las prendas de todos los eventos de dicho año. Las siglas disponibles actualmente son las siguientes:<ul><li>A = 1 de Abril</li><li>SV = San Valentín</li><li>P = Pascua</li><li>M = Música</li><li>JE = Japan Expo</li><li>PM = Pride Month</li><li>V = Verano</li><li>BF = Black Friday</li><li>H = Halloween</li><li>N = Navidad</li></ul></li></ul><u>NOTA:</u> Recuerda que para usar el filtro de eventos debes usar los dos puntos (":") para "activarlo".'},
	{'question':'¿Qué son los asteríscos (*) que tienen algunas prendas?',
	'answer':'Las prendas con asteríscos son prendas cuyos nombres no coinciden con el nombre original en el server español. Estos nombres están corregidos. Puedes ver todas correcciones (*) en <a href="https://gardiemaker.blogspot.com/2020/04/correcciones-y-cambios.html">este post</a>.'},
	{'question':'¿Cómo guardo a la guardiana que cree?',
	'answer':'Puedes guardar una imagen de tu guardiana en el perfil. Para acceder a él cuando acabes con tu guardiana, tienes que darle al botón de "Generar Perfil".'}
]

var infoProfile = [
	{'question':'¿Cómo puedo guardar a mi Gardienne?',
	'answer':'Para ver y guardar un render de tu Gardienne tienes que hacer clic en "Guardar". Esto abrirá un pop-up que te permitirá guardar la imagen en la resolución que más te guste. Ten en cuenta que esto no funciona en dispositivos móviles y solo podrás guardarla desde un ordenador.'},
	{'question':'¿Para qué sirve el código?',
	'answer':'Si te gustó tu gardi y la quieres compartir (o solo guardarla), puedes guardar este código para volver a generarla más tarde. Este código lo pegas debajo del perfil, dónde dice "Cargar guardiana".'}
]

var infoContests = [
	{'question':'¿Qué es el Catálogo de Guardianas?',
	'answer':'El catálogo funciona como un "archivo" en el cual las personas pueden enviar y "almacenar" sus creaciones o conjuntos con la mera intención de compartirlo con la comunidad. A su vez, todas las guardianas recibidas participarán en los sorteos para ser Guardiana Destacada.'},
	{'question':'Sobre la Guardiana Destacada.',
	'answer':'La Guardiana Destacada es la única actividad que siempre estará activa y, como no hay feedback suficiente para realizar votaciones, la guardiana será elegida mediante sorteo. No habrá premios en maanas ni MO a menos que se indique lo contrario. La participación es completamente voluntaria y puedes realizar tantos aportes como gustes. Cada guardiana permanecerá en la portada durante una semana y cambiará todos los miércoles a la hora de la recarga.'},
	{'question':'¿Cómo participo?',
	'answer':'Para participar tanto en el Catálogo de Guardianas como en los sorteos de la Guardiana Destacada, solo tienes que rellenar <a href="https://docs.google.com/forms/d/e/1FAIpQLSfycgchQuYlHzH74toiYmGlWR-x5jP5B680ilWMHs7w7qSJrA/viewform" target="_blank">ESTE FORMULARIO</a>. <br><br><h4>Sobre los campos del formulario:</h4><p>A partir de ahora se te solicitará un correo electrónico REAL y VÁLIDO al que tengas acceso. Este no será público y será utilizado como medida de seguridad.</p><ul><li><u>Alias:</u> Este es tu nombre visible. Puedes poner tu nombre de usuario de Eldarya o elegir un "Alias" si quieres mantener tu privacidad. Ya no se aceptan aportes anónimos.</li><li><u>Código:</u> Aquí solo tienes que pegar el código para generar a tu guardiana. Este puedes obtenerlo en el perfil con el botón "Copiar código" o incluso desde la barra de direcciones. El código no debe generar ningún error, pero si le das a copiar y pegar no tienes de qué preocuparte.</li><li><u>Nombre de personaje o conjunto:</u> Este campo es opcional, si la guardiana o el conjunto que estás enviando tiene algún nombre puedes ponerlo aquí. </li></ul><br>Todas las nuevas guardianas serán "archivadas" en un nuevo catálogo, al cual puedes acceder desde el menú en la parte superior. <br><br><b>IMPORTANTE</b><br>Algunas de las guardianas alojadas en el antiguo catálogo no han sido transladadas al nuevo, ya que las he considerado spam. No son muchas así que las he agrupado a todas bajo la etiqueta de <a  target="_blank" href="https://gm-catalogo.blogspot.com/search/label/SPAM">SPAM</a>, puedes ir a echar un vistazo y hacer algún reclamo si ves la tuya ahí. Los reclamos pueden hacerlos ya sea por email o mediante un comentario en el blog. <br><br>Por cualquier duda o problema que tengas siempre puedes consultarme en el blog, <a href="https://znfaq.tumblr.com/" target="_blank">AQUI</a>, o escribiéndome a <a href="mailto:gardiemaker@gmail.com">gardiemaker@gmail.com</a>.'},
	{'question':'Todo sobre las cuentas.',
	'answer':'<b>¿Cómo consigo una cuenta?</b><br>Tu cuenta es creada al momento de realizar tu primer aporte.<br><br><b>¿Qué son las cuentas verificadas? / ¿Cómo verifico mi cuenta? </b><br>Una cuenta puede estar verificada por dos razones: 1- Tener un email asociado o, 2- haber aportado más de una vez. Todos los nuevos aportes realizados con el nuevo formulario estarán asociados a un email y, por lo tanto, dichas cuentas estarán automáticamente verificadas.<br><br>Si ya tienes guardiana/s en el catálogo basta con completar el formulario normalmente (con el mismo alias) y el nuevo correo que ingreses será vinculado a tu "cuenta".<br><br><b>¿Cómo cambio mi alias / email?</b><br>Si ya no te gusta tu alias o simplemente quieres cambiarlo, puedes rellenar <a href="https://forms.gle/YnFtmvsZkxC9XJEz8" target="_blank">ESTE FORMULARIO</a> y realizaré el cambio en cuanto me sea posible. Una vez rellenado y enviado el formulario, ya podrás utilizar tu nuevo alias para realizar aportes. Para cambiar el email puedes utilizar <a href="https://forms.gle/WejCW4A4UoWEtXdu6" target="_blank">ESTE FORMULARIO</a>.'},
	{'question':'No veo mi aporte en el catálogo',
	'answer':'Si la guardiana que enviaste no figura en el catálogo puede ser por estas razones:<br><ul><li><u>No es válida:</u> El código estaba corrupto o no es válido y no me fue posible cargarla.</li><li><u>La guardiana no tiene ropa:</u> Aquí no es lugar para guardar una base.</li><li><u>El alias y el mail no coinciden:</u> Es probable que el mail que quieras usar ya se esté usando en otra cuenta, ya sea porque has aportado antes o porque alguien está usando tu email. En este caso, te recomiendo enviar un email a <a href="gardiemaker@gmail.com">gardiemaker@gmail.com</a> para ayudarte y así asegurar que no es alguien más intentando robar tu cuenta.</li></ul>'},
	{'question':'Reportar un cosplay.','answer':'Si ves algún cosplay que no está marcado como tal, puedes reportarlo utilizando el botón de "Notificar cosplay" ubicado en la parte inferior derecha de cada aporte. También puedes reportarlo vía email a <a href="gardiemaker@gmail.com">gardiemaker@gmail.com</a> o dejando un comentario en la página de reportes del blog. Asegúrate de enviar el ID y el alias (es decir, el nombre de quien lo envió) de dicho aporte, además del nombre del personaje al que está representando para poder verificarlo.'},
	{'question':'¿Puedo realizar alguna actividad/concurso con tu vestidor?',
	'answer':'¡Por supuesto! El vestidor es de libre uso para quien quiera realizar actividades con el.<br><br>Si tu interés es organizar alguna actividad aquí mismo, no dudes en enviarme un email a <a href="mailto:gardiemaker@gmail.com">gardiemaker@gmail.com</a> con los detalles y veremos qué se puede hacer.'}
]