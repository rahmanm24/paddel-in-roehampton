const db = require('../services/db');


class BikeOperation{
    standID;
    userID;
    bikeId;

    constructor(standID) {
        this.standID = standID;
    }

    async getBikeIdForStand(){
        var sql = "SELECT MIN(Bike.bikeSerial) AS serial FROM Bike WHERE Bike.standID = ?";
        const results = await db.query(sql, [this.standID]);
        this.bikeId = results[0].serial;
    }

    

}

module.exports = {
    BikeOperation
}