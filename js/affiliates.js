var affiliates = [
    {"name":"Clan Valkyrie", "url":"https://valkyrieclub.tumblr.com", "icon":"https://64.media.tumblr.com/122a4e1fa0e54382ecb58b3d2f0fe082/tumblr_inline_qawaasSXQ71x67vpf_500.png"}/*,
    {"name":"BlobbyDex", "url":"https://blobbydex.onrender.com", "icon":"https://blobbydex.onrender.com/assets/img/favicon.png"}*/
]

function loadAffiliates() {
    (window.location.href).includes("/es/") ? $("#footer-info").html("Páginas amigas: ") : $("#footer-info").html(nav_affiliates + ": ");

    $("#footer-info").append('<ul id="affiliate-list"></ul>');

    for (i = 0; i < affiliates.length; i++) {
        $("#affiliate-list").append('<a class="affiliate-img" href="' + affiliates[i].url + '"  title="' + affiliates[i].name + '" target="_blank"><img src="' + affiliates[i].icon + '"></a>');
    }
}
