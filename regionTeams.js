//declaraing "instance" variables
var request = require("request");
var sqlId = 0;
var sqlTable = "cateams";
var heads = {
    "X-TBA-App-Id": "joel_bartlett:frc-rankings:v01"   
}

//connect with sql table
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'JBrocks13',
  database : 'frcrankings'
});

connection.connect();


//----------SQL TOOLS----------//

/**
 * Sets var sqlId to current max Id of table
 */
function maxId() {
    connection.query('select max(id) from ' + sqlTable + ';', function (err, rows) {
        if(err) { console.log(err); }
        var temp = parseInt((JSON.stringify(rows)).replace('[{"max(id)":', ""));
        sqlId = temp;
    })
}

/**
 * Communicates with sql table to insert data 
 * @param team
 */
function sqlInsert(team) {
    maxId();
    connection.query('insert into' + sqlTable + '(id, team) values (' + sqlId + ',' + team + ')', function (err, rows) {
        if(err) { console.log(err); }
    })
}

/**
 * prints out everything in sqlTable
 */
function selectAll () {
    connection.query('SELECT * from caTeams', function(err, rows, fields) {
    if (!err)
        console.log('The solution is: ', rows);
    else
        console.log('Error while performing Query.');
    });
}




//----------Insert data to Table----------//

/**
 * Returns a list of teams from a specific region
 * @param region, regionLong (fully written state name)
 * @return teams array
 */

function loop (region, regionLong) {
    for (i = 0; i <= 13; i++) {
        request({url: "http://www.thebluealliance.com//api/v2/teams/" + i, headers: heads}, function(err, response, body) {
            if(err) { console.error(err); }
            var tempTeams = JSON.parse(body);
            for (var i in tempTeams) {
                var tempTeam = tempTeams[i];
                if(tempTeam.region == region || tempTeam.region == regionLong) {
                    var x = tempTeam.team_number;
                    var temp = teams[teams.length-1];
                    sqlInsert(x);
                }
            }
        });
    } 
}

//loop("CA", "California");