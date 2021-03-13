const express = require('express');
const app = express();
const weather = require('weather-js');
const path = require('path');
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');
app.listen(3000);


app.use((req, res, next) => {
    console.log('Request Made');
    console.log(`Host: ${req.hostname}`);
    console.log(`Path: ${req.path}`);
    console.log(`Method: ${req.method}`);
    next();
});

app.get('/', function (req, res) {
    weather.find({search: 'Butuan, PH', degreeType: 'C'}, function(err, result) {
        if(err){
            console.log(err)
            res.render('index', {weather: 'nothing'});
        } else {
            console.log(result);
            res.render('index', {weather: result});
        } 
      });  
});

app.get('/other', function (req, res) {
    res.render('other');
});

app.use((req, res) => {
    res.render('404');
});