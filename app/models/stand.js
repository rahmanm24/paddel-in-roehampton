const db = require('../services/db');

class Stand{
    standID;
    standName;
    location;
    count;

    constructor(standID) {
        this.standID = standID;
    }

    async getStandDetails(){
        if(typeof this.standName !== 'string'){
            var sql = "SELECT BikeStand.standID, BikeStand.standName, BikeStand.location, COUNT(Bike.slID) AS count FROM BikeStand INNER JOIN Bike ON BikeStand.standID = Bike.bikeStandID WHERE BikeStand.standID = ? AND Bike.bikeStatus = 'Available' GROUP BY BikeStand.standID";
            const results = await db.query(sql, [this.standID]);
            this.standName = results[0].standName;
            this.location = results[0].location;
            this.bikes = results[0].count;
            this.standID = results[0].standID;
        }
    }


}

module.exports = {
    Stand
}