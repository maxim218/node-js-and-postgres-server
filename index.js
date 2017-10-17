"use strict";

let express = require("express");
let app = express();
let pg = require('pg');

function createNewClient() {
    return new pg.Client({
        user: 'postgres',
        host: 'localhost',
        database: 'b12345',
        password: '123',
        port: 5432
    });
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




app.post('/select_records', function(request, response) {
    const client = createNewClient();
    client.connect();

    request.on('data', function(data) {  });

    let answerObject = {
        arr: []
    };

    request.on('end', function(){
        client.query(" SELECT * FROM people; ", (err, res) => {
            answerObject.arr = res.rows;
            response.write( encodeURIComponent(JSON.stringify(answerObject)) );
            client.end();
            response.end();
        });
    });
});



app.post('/add_record', function(request, response) {
    const client = createNewClient();
    client.connect();

    request.on('data', function(data) {
        let dataObj = JSON.parse(decodeURIComponent(data.toString()));
        let name = dataObj.name.toString();
        let age = parseInt(dataObj.age);

        client.query(" INSERT INTO people (name, age) VALUES ('" + name + "', " + age + "); ", (err, res) => {
            client.end();
            response.end();
        });
    });

    request.on('end', function() {
        response.write("ADD RECORD OK");
        response.end();
    });
});



let port = process.env.PORT || 5005;
app.listen(port);
console.log("Server works on port " + port);
