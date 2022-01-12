const db = require('../services/db');

class DashboardView{

    bikeSerial;
    bikeStatus;

    constructor(bikeSerial) {
        this.bikeSerial = bikeSerial;
    }

    async bikeDetails(){
        var sql = "SELECT bikeSerial, bikeStatus FROM Bike WHERE bikeSerial = ?";
        const results = await db.query(sql, [this.bikeSerial]);
        this.bikeSerial = results[0].bikeSerial;
        this.bikeStatus = results[0].bikeStatus;
    }

    async updateBike(bikeStatus){
        var sql = "UPDATE Bike SET bikeStatus = ? WHERE bikeSerial = ?";
        const results = await db.query(sql, [ bikeStatus, this.bikeSerial]);
        this.bikeStatus = bikeStatus;
        return results;
    }
    
}

module.exports = {
    DashboardView
}