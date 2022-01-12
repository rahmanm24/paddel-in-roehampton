const express = require('express');
const { Stand } = require("./models/stand");
const { BikeOperation } = require("./models/bikeoperation");
const { DashboardView } = require("./models/dashboard");
const { User } = require("./models/user");

const app = express();

var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');
const { promise } = require('bcrypt/promises');

app.use(express.urlencoded({ extended: true }));




app.get("/", function(req,res){

    var sql = 'SELECT BikeStand.standName, BikeStand.standID, COUNT(Bike.slID) AS count FROM BikeStand INNER JOIN Bike ON BikeStand.standID = Bike.bikeStandID WHERE Bike.bikeStatus = "Available" GROUP BY BikeStand.standID';

    db.query(sql).then(results => {
        res.render('stands', {data: results});
    });

    //res.json(results);
})

app.get("/report", function(req, res){
    res.render('report');
})

app.get('/admin', function(req, res){
    res.render('admin');
})

app.get("/dashboard", function(req,res){
   // res.render
   if (req.session.uid){
        var sql = 'SELECT Bike.bikeSerial, Bike.bikeStatus, BikeStand.standName FROM Bike INNER JOIN BikeStand ON Bike.bikeStandId = BikeStand.standID GROUP BY Bike.bikeSerial';
        db.query(sql).then(results => {
                res.render('dashboard', {data: results});
            });
   }
   else{
        res.render('admin');
   }
   
})

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('admin');
});

app.get('/selected-stand/:id', function(req,res){
    var standID = req.params.id;
    var stand = new Stand(standID);
    stand.getStandDetails().then(Promise =>{
        res.render('selected-stand', {stand: stand});
    });
});

app.get('/bikedetails/:id', function(req,res){
    var bikeSerial = req.params.id;
    var bikeDet = new DashboardView(bikeSerial);
    bikeDet.bikeDetails().then(Promise =>{
        res.render('bikedetails', {bikeDet: bikeDet})
    })
})

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

app.get('/report/:id', function (req, res) {
    var standID = req.params.id;
    var stand = new Stand(standID);
    stand.getStandDetails().then(Promise =>{
        res.render('report', {stand: stand});
    });

});

app.post('/hire', function(req, res){
    params = req.body;
    // console.log(params);

    var bikeoperation = new BikeOperation(params.standID);
    try {
        bikeoperation.getBikeIdForStand().then(Promise => {
            res.render('hire', {bikeoperation: bikeoperation})
            bikeoperation.setBikeHire(params.userID).then(Promise => {
                bikeoperation.setBikeStatus().then(Promise =>{
                    res.render('/thanks');
                })
            })

        })
     } catch (err) {
         console.error(`Error  `, err.message);
     }


    
})

app.post('/upbs', function(req,res){
    params = req.body;
    console.log(params);

    var updateBike = new DashboardView(params.bikeSerial);

    try{
        updateBike.updateBike(params.bikeStatus).then(results => {
            res.redirect('/dashboard');
        })
    }
    catch (err){
        console.error(`Error `, err.message);
    }
})

app.post('/thanks', function(req, res){
    params = req.body;

    

    var bikeoperation = new BikeOperation(params.standID);
    
    try{
        bikeoperation.report(params.bikeId).then(Promise =>{
            res.render('/thanks');
        });
    }
    catch (err){
        console.error(`Error `, err.message);
    }

})

app.post('/thanks', function(req, res){
    params = req.body;

    

    var bikeoperation = new BikeOperation(params.standID);
    
    try{
        bikeoperation.returnBike(params.bikeId).then(Promise =>{
            res.render('/thanks');
        });
    }
    catch (err){
        console.error(`Error `, err.message);
    }

})

// Register
app.get('/register', function (req, res) {
    res.render('register');
});



app.post('/set-password', function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        user.getIdFromEmail().then( uId => {
            if(uId) {
                 // If a valid, existing user is found, set the password and redirect to the users single-student page
                user.setUserPassword(params.password).then ( result => {
                    res.redirect('/dashboard');
                });
            }
            else {
                // If no existing user is found, add a new one
                user.addUser(params.email).then( Promise => {
                    res.render('admin');
                });
            }
        })
     } catch (err) {
         console.error(`Error while adding password `, err.message);
     }
});

app.post('/authenticate', function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        user.getIdFromEmail().then(uId => {
            if (uId) {
                user.authenticate(params.password).then(match => {
                    if (match) {
                        // Set the session for this user
                        res.send('invalid password');
                    }
                    else {
                        // TODO improve the user journey here
                        
                        console.log(match);
                        req.session.uid = uId;
                        req.session.loggedIn = true;
                        res.redirect('dashboard');
                    }
                });
            }
            else {
                res.send('invalid email');
            }
        })
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

app.listen(3000, function(){
    console.log("app running on http://127.0.0.1:3000");
})