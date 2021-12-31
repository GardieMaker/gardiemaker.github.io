$(document).ready(function () {
    // Obtener fecha
    var year = new Date();
    year = year.getFullYear();
    $("#footer-links li").eq(0).prepend(year + " | GardieMaker");
});