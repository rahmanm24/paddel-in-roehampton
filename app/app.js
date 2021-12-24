const express = require('express');
const { Stand } = require("./models/stand");
const { BikeOperation } = require("./models/bikeoperation");

const app = express();

app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');
app.use(bodyParser.urlencoded({extended: false}));


app.get("/", function(req,res){

    var sql = 'SELECT BikeStand.standName, BikeStand.standID, COUNT(Bike.slID) AS count FROM BikeStand INNER JOIN Bike ON BikeStand.standID = Bike.bikeStandID WHERE Bike.bikeStatus = "Available" GROUP BY BikeStand.standID';

    db.query(sql).then(results => {
        res.render('stands', {data: results});
    });

    //res.json(results);
})


app.get('/selected-stand/:id', function(req,res){
    var standID = req.params.id;
    var stand = new Stand(standID);
    stand.getStandDetails().then(Promise =>{
        res.render('selected-stand', {stand: stand});
    });
});

app.get('/take-bike/:id', function (req, res) {
    var standID = req.params.id;
    var stand = new Stand(standID);
    stand.getStandDetails().then(Promise =>{
        res.render('take-bike', {stand: stand});
    });

});

app.get('/return-bike/:id', function (req, res) {
    var standID = req.params.id;
    var stand = new Stand(standID);
    stand.getStandDetails().then(Promise =>{
        res.render('return-bike', {stand: stand});
    });

});

app.post('/hire', function(req, res){
    var params = req.body;
    console.log(params);
    
})

app.listen(3000, function(){
    console.log("app running on http://127.0.0.1:3000");
})