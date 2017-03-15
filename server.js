var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dateTime = require('node-datetime');
var fs = require('fs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('images'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/record', function (req, res) {
	console.log("body: " + JSON.stringify(req.body));
	console.log("----------------");

	var data = require("./data/diaper.json");
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	var diaper = req.body.diaper;
	var year = dt.format('Y');
	var month = dt.format('m');
	var day = dt.format('d');
	var time = dt.format('H:M:S'); 

	console.log('Year: ' + year); 
	console.log('Month: ' + month);
	console.log('Day: ' + day);
	console.log('Time: ' + time);

	console.log('Data: ' + JSON.stringify(data));
	console.log('Keys: ' + Object.keys(data.year[0][year].month));

	test(data.year[0], "2018");
	console.log("Test 2");
	console.log("Looking in " + JSON.stringify(data.year[0][year].month[0]));
	test(data.year[0][year].month[0],"04");

	fs.writeFile("./data/diaper.json", JSON.stringify(data), function(err) {
    	   if(err) {
              return console.log(err);
    	   }
    	   console.log("The file was saved!");
	});
	
	res.end("A " + req.body.diaper + " diaper has been recorded on " + formatted);
})

app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      first_name:req.query.first_name,
      last_name:req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   //console.log("Host: " + host);
   //console.log("Port: " + port);
   
   console.log("Example app listening at http://%s:%s", host, port)
})

function findValue(data, target){
  if(isArray(data)){
    for (var i = 0; i < data.length; i++) { 
      if(data[i] == target){
        return target;
      };
    };
  };
  return null;
}

function findArray(data,target){
  if(isArray(data)){
     for (var i = 0; i < data.length; i++) { 
       if (data[i][target]) { 
           return i;
       };
     }  
   };
  return -1;
}

function findObj(data,target){
  if(isObject(data)){
    if(data[target]){
      return true;
    };
  };
  return false;
}

function isArray(a) {
    return (!!a) && (a.constructor === Array);
}

function isObject(a) {
    return (!!a) && (a.constructor === Object);
}

function test(data,targetKey){
  for(var key in data) {
    console.log("\nDoes target " + targetKey + " match key " + key+ "?");
    if (data.hasOwnProperty(key) && key == targetKey) {
      if(isObject(data[key])){
      	console.log("I found " + targetKey +"'s data: " + JSON.stringify(data[key]));  
      }
      else{
        console.log("I found " + targetKey +"'s data: " + JSON.stringify(data[key]));
      }
      return data[key];
    }  
//    else{
//      if(isObject(data[key])){
//        test(data[key],targetKey);
//      } 
      if(isArray(data[key])){
        console.log("\nI think i found an array of keys?");
        console.log("Array 0 and Key: " + key + "\nValue: " + JSON.stringify(data[0][key]));
	test(data[0][key],targetKey);
      }
 //   }
  }
  console.log("I didnt find anything for key " + targetKey);		 
}

function level(data){

}
