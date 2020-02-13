var express = require('express');
var path = require('path');

//leaving in the bodyParser in case we ever send up form data and need to get data out of form
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.dataArray = [];
// app.visitorArray = [];
// just one "site" with 2 pages, / and about

// use res.render to load up an ejs view file
// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// ShowList page 
app.get('/ShowList', function(req, res) {
    res.render('pages/ShowList', { 
        dataArray: app.dataArray
     });
  });


// thingsToDo page 
// sending a get with 1 param
// http://localhost:3000/uploadData?id=2&date=1941
app.get('/thingsToDo', function(req, res) {
    let toDo = req.param('toDo');
    let date = req.param('date');
    if(toDo != null){
        let toDoList = {
            toDo: toDo,
            date: date
        }
    app.dataArray.push(toDoList);
    }
    res.render('pages/thingsToDo', { 
        dataArray: app.dataArray
     });
  });

  // SortByDate page 
app.get('/SortByDate', function(req, res) {

    // clever way to make a real copy, not just a new reference name
    app.duplicateArray = JSON.parse(JSON.stringify( app.dataArray ));

    // Sort the new array with the custom function
    // that sorts alphabetically by the  key
    app.duplicateArray.sort(dynamicSort("date"));


    res.render('pages/SortByDate', { 
        dataArray: app.duplicateArray
     });
  });

function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
}

module.exports = app;
