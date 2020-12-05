const mysql = require('mysql');

var db = mysql.createConnection({
    host: 'wyqk6x041tfxg39e.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    user: 'rd9i76i0y4hrqhk3',
    password: 'jeyyaatejit7m5bh',
    database: 'j596d1jhrpw6g6on'
});

db.connect(err => {
    if (err) return console.log(err);
    console.log('DB Connected') 
})

let Query = (q, params) => {
    return new Promise((resolve, reject) => {
        db.query(q, params, (err, result) => {
            if (err) {
                reject(err)
                console.log(err)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = Query