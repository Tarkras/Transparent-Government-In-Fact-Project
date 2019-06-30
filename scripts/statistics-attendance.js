var parties = [];
var arrayParty = [];
var aux = [];
var perc = [];
var Total = 0;
var partyVotes = [];
var arrayAttendance = [];

var glance = new Vue({
    el: "#glance",
    data: {
        partyInfo: {
            democratName: "Democrats",
            democratPartyCount: {},
            democratPercentageCount: {},
            republicanName: "Republicans",
            republicanPartyCount: {},
            republicanPercentageCount: {},
            independentName: "Independents",
            independentPartyCount: {},
            independentPercentageCount: {},
            totalName: "Totals",
            totalPartyCount: {},
            totalPercentage: {}
        }
    }
});

var app1 = new Vue({
    el: "#least",
    data: {
        least: []
    }
});

var app2 = new Vue({
    el: "#most",
    data: {
        most: []
    }
});

if (document.querySelector("#senate")) {
    var request = new Request(
        "https://api.propublica.org/congress/v1/113/senate/members.json", {
            headers: new Headers({
                "X-API-Key": "V4tIVS3lruObtuLSUVc0dQe4UYga73TVgnDecFnM"
            })
        }
    );
} else {
    var request = new Request(
        "https://api.propublica.org/congress/v1/113/house/members.json", {
            headers: new Headers({
                "X-API-Key": "V4tIVS3lruObtuLSUVc0dQe4UYga73TVgnDecFnM"
            })
        }
    );
}

let datos = loadData(request);

datos.then(result => cargarDatos(result));

function loadData(request) {
    let datos = fetch(request)
        .then(result => {
            return result.json();
        })
        .then(result => {
            return result;
        })
        .catch(error => console.error("ERROR: ", error));
    return datos;
}

function cargarDatos(array) {
    var obj = array.results[0].members;
    console.log(obj);
    percVoted(obj);
    myGlance(obj);
    loader1();
    sortedFunctionAttendance(obj);
    console.log("Sorted attendance");
    console.log(arrayAttendance);
    console.log("Hola");
    attendanceTables();
    loader2();
    loader3();
}

function loader1() {
    document.getElementById("loader1").style.display = "none";
    document.getElementById("loaded1").style.display = "block";
    document.getElementById("message1").style.display = "none";
}

function loader2() {
    document.getElementById("loader2").style.display = "none";
    document.getElementById("loaded2").style.display = "block";
    document.getElementById("message2").style.display = "none";
}

function loader3() {
    document.getElementById("loader3").style.display = "none";
    document.getElementById("loaded3").style.display = "block";
    document.getElementById("message3").style.display = "none";
}

function percVoted(obj) {
    var a = 0;

    for (var i = 0; i < obj.length; i++) {
        if (!parties.includes(obj[i].party)) {
            parties[a] = obj[i].party;
            a++;
        }
    }
    console.log("Partidos");
    console.log(parties);
    parties.sort(); //Partidos por orden alfabetico.
    console.log(parties);

    for (var n = 0; n < parties.length; n++) {
        var a = 0;
        aux = [];
        perc[n] = 0;
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].party == parties[n]) {
                perc[n] = perc[n] + obj[i].votes_with_party_pct;
                Total = Total + obj[i].votes_with_party_pct;
                aux[a] = obj[i];
                arrayParty[n] = aux[a];
                a++;
            }
        }
        arrayParty[n] = aux;
        perc[n] = (perc[n] / arrayParty[n].length).toFixed(2);
    }

    console.log(Total);
    Total = (Total / obj.length).toFixed(2);
    Total = Total + " %";
    glance.partyInfo.totalPercentage = Total;
    glance.partyInfo.totalPartyCount = obj.length;
    console.log("Porcentaje total");
    console.log(Total);
    console.log(arrayParty);
    console.log("Porcentaje");
    console.log(perc);
}

function sortedFunctionAttendance(obj) {
    console.log("Sorted attendance");
    arraySortedAttendance = obj;
    arraySortedAttendance.sort(function(a, b) {
        return b.missed_votes_pct - a.missed_votes_pct;
    });
    for (var i = 0; i < arraySortedAttendance.length; i++) {
        arrayAttendance[i] = arraySortedAttendance[i];
    }
}

function myGlance(obj) {
    // Hardcode: imposible automatizarlo. Se puede dar el caso en el que no hay Independientes, Republicanos
    //o Democratas. Al estar los arrays necesarios en orden dandose el caso en el que en el primer indice estan
    //los republicanos ese mismo indice estara asignado al resto de arrays necesarios.
    for (var i = 0; i < parties.length; i++) {
        if (parties[i].includes("D")) {
            glance.partyInfo.democratPartyCount = arrayParty[i].length;
            glance.partyInfo.democratPercentageCount = perc[i] + " %";
        }
        if (parties[i].includes("R")) {
            glance.partyInfo.republicanPartyCount = arrayParty[i].length;
            glance.partyInfo.republicanPercentageCount = perc[i] + " %";
        }
        if (parties[i].includes("I")) {
            glance.partyInfo.independentPartyCount = arrayParty[i].length;
            glance.partyInfo.independentPercentageCount = perc[i] + " %";
        }
    }
    if (!parties.includes("D")) {
        glance.partyInfo.democratPartyCount = "--";
        glance.partyInfo.democratPercentageCount = "--";
    }
    if (!parties.includes("R")) {
        glance.partyInfo.republicanPartyCount = "--";
        glance.partyInfo.republicanPercentageCount = "--";
    }
    if (!parties.includes("I")) {
        glance.partyInfo.independentPartyCount = "--";
        glance.partyInfo.independentPercentageCount = "--";
    }
}

function attendanceTables() {
    console.log(arrayAttendance);
    var len = arrayAttendance.length;
    var aux = [];
    console.log("Least ATT Table");
    for (var i = 0; i < arrayAttendance.length; i++) {
        if ((i + 1) / len > 0.1) {
            break;
        } else {
            aux[i] = arrayAttendance[i];
        }
    }
    app1.least = aux;
    console.log(app1.least);

    var aux = [];
    var a = 0;
    console.log("Most ATT Table");
    for (var i = arrayAttendance.length - 1; i >= 0; i--) {
        if (i / len < 0.9) {
            break;
        } else {
            aux[a] = arrayAttendance[i];
            a++;
        }
    }
    app2.most = aux;
    console.log(app2.most);
}