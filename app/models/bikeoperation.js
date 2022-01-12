const db = require('../services/db');


class BikeOperation{
    standID;
    userID;
    bikeId;

    constructor(standID) {
        this.standID = standID;
    }

    async getBikeIdForStand(){
        var sql = "SELECT MIN(Bike.bikeSerial) AS serial FROM Bike WHERE Bike.bikeStatus = 'Available' AND Bike.bikeStandId = ?";
        const results = await db.query(sql, [this.standID]);
        this.bikeId = results[0].serial;
    }

    async setBikeHire(userID){
        var sql = "INSERT INTO BikeHIre (userID, bikeID) VALUES (?, ?);";
        const results = await db.query(sql, [userID, this.bikeId]);
        this.userID = userID;
    }

    async setBikeStatus(){
        var sql = "UPDATE Bike SET bikeStatus = 'Taken' Where bikeSerial = ?"
        const results = await db.query(sql, [this.bikeId]);
    }

    async returnBike(bikeId){
        var sql = "UPDATE Bike SET bikeStandID = ?, bikeStatus = 'Available' WHERE bikeSerial = ? ";
        const results = await db.query(sql, [this.standID, bikeId]);
        this.bikeId = bikeId;

    }

    async report(bikeId){
        var sql = "UPDATE Bike SET bikeStandID = ?, bikeStatus = 'Issue Reported' WHERE bikeSerial = ? ";
        const results = await db.query(sql, [this.standID, bikeId]);
        this.bikeId = bikeId;
    }
    

}

module.exports = {
    BikeOperation
}