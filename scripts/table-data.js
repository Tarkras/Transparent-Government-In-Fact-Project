var arrayStates = [];
var arrayParty = [];
var USState = " ";
var obj = [];
var app = new Vue({
    el: "#app",
    data: {
        member: []
    }
});

var app1 = new Vue({
    el: "#app1",
    data: {
        selected: "ALL",
        states: []
    },
    methods: {
        cambio: function() {
            myTable();
        }
    }
});

console.log("Functioning");

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
    obj = array.results[0].members;
    app.member = array.results[0].members;
    console.log(app.data);
    loader1();
    optionsMenu();
    myTable();
}

function loader1() {
    document.getElementById("loader4").style.display = "none";
    document.getElementById("loaded1").style.display = "block";
    document.getElementById("message4").style.display = "none";
}

function getParty() {
    arrayParty = [];
    app.filter = [];
    check = document.querySelectorAll(
        'input[type="checkbox"].form-check-input:checked'
    );
    var l = 0;
    for (var i = 0; i < check.length; i++) {
        if (!arrayParty.includes(check[i].value)) {
            arrayParty[l] = check[i].value;
            l++;
        }
    }
    console.log(arrayParty);
    myTable();
}

function optionsMenu() {
    var arrayStates = [];
    var a = 0;
    for (var i = 0; i < obj.length; i++) {
        if (!arrayStates.includes(obj[i].state)) {
            arrayStates[a] = obj[i].state;
            a++;
        }
    }
    arrayStates.sort();
    arrayStates.unshift("ALL");
    app1.states = arrayStates;
    console.log(app1.states);
}

function myTable() {
    var aux = [];
    var a = 0;
    console.log(arrayParty);
    // USState = selected;
    // USState = document.getElementById("state").value;
    console.log(app1.selected);
    if (arrayParty.length == 0) {
        for (var i = 0; i < obj.length; i++) {
            if (app1.selected == "ALL" || obj[i].state == app1.selected) {
                aux[a] = obj[i];
                a++;
            }
        }
    } else {
        for (var n = 0; n < arrayParty.length; n++) {
            for (var i = 0; i < obj.length; i++) {
                if (
                    obj[i].party == arrayParty[n] &&
                    (app1.selected == "ALL" || obj[i].state == app1.selected)
                ) {
                    aux[a] = obj[i];
                    a++;
                }
            }
        }
    }
    app.member = aux;
    console.log(app.member);
    console.log("hola");
}

document.getElementById("inlineCheckbox1").addEventListener("click", getParty);
document.getElementById("inlineCheckbox2").addEventListener("click", getParty);
document.getElementById("inlineCheckbox3").addEventListener("click", getParty);