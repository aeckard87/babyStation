var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dateTime = require('node-datetime');
var fs = require('fs');
var extend = require("extend");

var year, month, day, time ="";
var iYear, iMonth, iDay, iTime = 0;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('images'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/diaperChange', function (req, res) {
   res.sendFile( __dirname + "/" + "diaperchange.html" );
})

app.get('/bottleFed', function (req, res) {
   res.sendFile( __dirname + "/" + "bottleFed.html" );
})

app.post('/recordBottle', function (req,res){
	console.log("body: " + JSON.stringify(req.body));
	console.log("----------------");
  res.end("Baby has been fed!");

})
app.post('/recordDiaperChange', function (req, res) {
	console.log("body: " + JSON.stringify(req.body));
	console.log("----------------");

	var data = require("./data/diaper.json");
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	var diaper = req.body.diaper;
	var brand = req.body.brand;
	var size = req.body.diaperSize;

	year = dt.format('Y');
	month = dt.format('m');
	day = dt.format('d');
	time = dt.format('H:M:S');

	console.log('Year: ' + year);
	console.log('Month: ' + month);
	console.log('Day: ' + day);
	console.log('Time: ' + time);

	//year="2018";
	console.log('Data Start: ' + JSON.stringify(data));

	if(isObject(data.year)){
	  if(!test(data.year,year)){
	    obj = '{"'+year+'":{"month":{}}}';
 //	    data.year = JSON.parse(obj);
	    data.year = extend(data.year,JSON.parse(obj));
	  }
	}
//	console.log('Data Year: ' + JSON.stringify(data));

	if(isObject(data.year[year].month)){
	  if(!test(data.year[year].month,month)){
	    obj = '{"'+month+'":{"day":{}}}';
 	   // data.year[year].month = JSON.parse(obj);
	    data.year[year].month = extend(data.year[year].month, JSON.parse(obj));
	  }
	}
//	console.log('Data Month: ' + JSON.stringify(data));

	if(isObject(data.year[year].month[month].day)){
	  if(!test(data.year[year].month[month].day,day)){
	    obj = '{"'+day+'":{"time":{}}}';
 	    //data.year[year].month[month].day = JSON.parse(obj);
	    data.year[year].month[month].day = extend(data.year[year].month[month].day, JSON.parse(obj));
	  }
	}
//	console.log('Data Day: ' + JSON.stringify(data));

	if(isObject(data.year[year].month[month].day[day].time)){
	  if(!test(data.year[year].month[month].day[day].time,time)){
	    obj = '{"'+time+'":{"diaper":"'+diaper+'","brand":"'+brand+'","size":"'+size+'"}}';
 	    //data.year[year].month[month].day[day].time = JSON.parse(obj);
	    data.year[year].month[month].day[day].time = extend(data.year[year].month[month].day[day].time, JSON.parse(obj));
	  }
	}
//	console.log('Data Time: ' + JSON.stringify(data));
	obj =  {diaper:diaper,brand:brand,size:size};


	console.log('Data End: ' + JSON.stringify(data));
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

   console.log("Example app listening at http://%s:%s", host, port)
})

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
     console.log("I found " + targetKey +"'s data: " + JSON.stringify(data[key]));
     return true;
    }
  }
  console.log("I didnt find anything for key " + targetKey);
  return false;
}
