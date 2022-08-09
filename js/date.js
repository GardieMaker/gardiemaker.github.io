$(document).ready(function () {
    // Obtener fecha
    var year = new Date();
    year = year.getFullYear();
    $("#footer-links li").eq(0).prepend(year + " | GardieMaker");
});

function currentDate() {
    // Obtener fecha
    var fecha = new Date().toISOString();
    var currentHour = (new Date().getUTCHours());

    if (currentHour >= 22) {
        // Cambia dia si son más de las 22UTC
        var dia = fecha;
        dia = dia.split("T");
        dia = dia[0].split("-");
        var newDia = parseInt(dia[2]) + 1;
        if (newDia < 10) newDia = "0" + String(newDia);
        fecha = fecha.replace(dia[2], newDia);
    };

    //console.log(fecha);
    return fecha;
};