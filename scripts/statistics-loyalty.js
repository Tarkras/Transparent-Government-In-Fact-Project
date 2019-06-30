var parties = [];
var arrayParty = [];
var aux = [];
var aux1 = 0;
var perc = [];
var Total = 0;
var partyVotes = [];
var arrayLoyal = [];

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
        least: [],
        votes: []
    }
});

var app2 = new Vue({
    el: "#most",
    data: {
        most: [],
        votes: []
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

loadData(request);

// datos.then(result => cargarDatos(result)); Preguntar Santi porque hacer esto.

function loadData(request) {
    let datos = fetch(request)
        .then(result => {
            return result.json();
        })
        .then(result => {
            console.log(result);
            cargarDatos(result);
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
    sortedFunctionLoyal(obj);
    console.log("Sorted loyal");
    console.log(arrayLoyal);
    loyaltyTables();
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

    parties.sort(); //Partidos por orden alfabetico.
    console.log("Partidos");
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

function sortedFunctionLoyal(obj) {
    console.log("Sorted loyal");
    arraySortedLoyal = obj;
    arraySortedLoyal.sort(function(a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });
    for (var i = 0; i < arraySortedLoyal.length; i++) {
        arrayLoyal[i] = arraySortedLoyal[i];
        aux1 = arrayLoyal[i].votes_with_party_pct / 100;
        partyVotes[i] = Math.trunc(arrayLoyal[i].total_votes * aux1);
        // arrayLoyal[i] = arrayLoyal[i] + "votes:" + partyVotes[i];
    }
    console.log(partyVotes);
    console.log(arrayLoyal);
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

function loyaltyTables() {
    // console.log("Least ATT Table");
    // leastTable = "<table class='table table-bordered text-center'><tr><th>Name</th><th>N. Party Votes</th><th>% Party Votes</th></tr>";
    // console.log(arrayAttendance);
    var len = arrayLoyal.length;
    var aux = [];
    var aux1 = [];
    console.log("Least ATT Table");
    for (var i = 0; i < arrayLoyal.length; i++) {
        if ((i + 1) / len > 0.1) {
            break;
        } else {
            aux[i] = arrayLoyal[i];
            aux1[i] = partyVotes[i];
        }
    }
    app1.least = aux;
    app1.votes = aux1;
    console.log(app1.least);
    // console.log(app1.votes);

    var aux = [];
    var aux1 = [];
    var a = 0;
    console.log("Most ATT Table");
    for (var i = arrayLoyal.length - 1; i >= 0; i--) {
        if (i / len < 0.9) {
            break;
        } else {
            aux[a] = arrayLoyal[i];
            aux1[a] = partyVotes[i];
            a++;
        }
    }
    app2.most = aux;
    app2.votes = aux1;
    console.log(app2.most);
    // console.log(app2.votes);
}