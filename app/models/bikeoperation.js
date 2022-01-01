const db = require('../services/db');


class BikeOperation{
    standID;
    userID;
    bikeId;

    constructor(standID) {
        this.standID = standID;
    }

    async getBikeIdForStand(){
        var sql = "SELECT MIN(Bike.bikeSerial) AS serial FROM Bike WHERE Bike.bikeStandId = ?";
        const results = await db.query(sql, [this.standID]);
        this.bikeId = results[0].serial;
    }

    async setBikeHire(){
        var sql = "INSERT INTO BikeHIre(userID, bikeID) VALUES(?,?)";
        const results = await db.query(sql, [this.userID], [this.bikeId]);
    }

    

}

module.exports = {
    BikeOperation
}