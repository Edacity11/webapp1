const express = require('express');
const app = express();
const weather = require('weather-js');
const request = require('request');
const mongoose = require('mongoose');
const path = require('path');
const Person = require('./models/persons')
//const { request } = require('http');
const { connected } = require('process');
const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require('constants');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));

const dbURI = 'mongodb+srv://Edlog:admin@cluster0.7bqyz.mongodb.net/person-list?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("Connected to Db"))
    .catch((err) => console.log(err));

app.locals.locate;
app.locals.data;
app.locals.nationality;

app.set('view engine', 'ejs')

function format(objects){
    var timeFormat = {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: objects["timezone"]}
    var dateFormat = {year: 'numeric', month: 'long', day: 'numeric', timeZone: objects["timezone"]}

    var datetime = new Date(objects["datetime"])
    var date = new Intl.DateTimeFormat('en-US', dateFormat).format(datetime)
    var time = new Intl.DateTimeFormat('en-US', timeFormat).format(datetime)
    
    return [time, date];
}

function getNationality(timezone){
    var nationName = "";
    if(timezone == "Asia/Manila") { nationName = "Filipino"; }
    else if( timezone == "Asia/Hong_Kong" ){ nationName = "Chinese"; }
    else if( timezone == "Europe/Paris" ){ nationName = "French"; } 
    else if( timezone == "America/Chicago" ){ nationName = "American"; }
    else if( timezone == "Australia/Darwin" ){ nationName = "Australian"; } 

    return nationName;
}

function getImgName(str) {
    return str.split('/')[1];
}

app.get('/', function (req, res) {
    res.render('', {title: 'Landing'})
});

app.get('/personnew', function (req, res) {
    nationality = getNationality(locate.Location)
    res.render('personnew', {title: 'New Person', nationality: nationality})
});

app.get('/personview', function (req, res) {
    res.render('personview', {title: 'View Person'})
});

app.get('/personlist', (req, res) => {
    request('http://worldtimeapi.org/api/timezone/'+locate.Location, function(error, response, body){
        const data = JSON.parse(body)
        dataFormatted = format(data)
        imageName = getImgName(locate.Location)
        // res.render('personlist', {title: 'Person List', time: dataFormatted[0], date: dataFormatted[1], imgName: imageName})
        Person.find()
            .then((result) => {
                res.render('personlist', {title: 'Person List', time: dataFormatted[0], date: dataFormatted[1], imgName: imageName, persons: result})
            })
            .catch((err) => {
                console.log(err);
            }) 
    })
    console.log(locate.Location)  
});



app.post('/personlist', (req, res) => {
    locate = req.body
    res.redirect('personlist')
});

app.post('/addperson', (req, res) => {
    const person = new Person(req.body);
    console.log(req.body);

    person.save()
        .then((result) => {
            res.redirect('/personlist');
        })
        .catch((err) =>{
            console.log(err);
        })
});

app.get('/personview/:id', (req, res) => {
    const person_id = req.params.id;
    console.log(person_id)
    Person.findById(person_id)
        .then(result => {
            res.render('personview', { personView: result, title: 'Hatdog' });
        })
        .catch(err => {
            console.log(err);
        });
    
})

app.use((req, res) => {
    res.render('404', {title: 'Error'})
});

app.listen(3000)