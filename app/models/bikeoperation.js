const db = require('../services/db');
const bcrypt = require("bcryptjs");

class BikeOperation{
    standId;
    userId;
    bikeId;

    constructor(standID) {
        this.standID = standID;
    }

    async getBikeIdForStand(){
        var sql = "SELECT MIN(Bike.bikeSerial) AS serial FROM Bike WHERE Bike.standID = ?";
        const result = await db.query(sql, [this.standID]);
        if (JSON.stringify(result) != '[]') {
            this.bikeId = result[0].serial;
            return this.id;
        }
        else {
            return false;
        }
    }

    

}

module.exports = {
    BikeOperation
}