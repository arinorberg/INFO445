'use strict'

var sql = require('mssql')
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/static/public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function getPass() {
  var pass = 'GoHuskies!'
  if (!pass) {
    throw new Error('Missing PASSWORD environment variable')
  }
  return pass
}

function connectToDb() {
  var config = {
    user: 'INFO445',
    password: getPass(),
    server: 'is-hay04.ischool.uw.edu',
    database: 'STUDY_ABROAD'
  }
  return sql.connect(config)
}

function displayAllStudents() {
  console.log("displaying top 1000 Students");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.STUDENT ORDER BY STUDENTID DESC');
}

function updateStudent(StudentID, Fname, Lname, DOB) {
  console.log("Updating Student");
  var query = "UPDATE dbo.Student SET Fname='" + Fname + "', Lname='"
      + Lname + "', DOB='" + DOB +  "' WHERE StudentID=" + StudentID;
  console.log(query);
  return new sql.Request().query(query);
}

function createStudent(Fname, Lname, DOB) {
  console.log("Creating Student");
  return new sql.Request()
    .input('Fname', sql.VarChar(30), Fname)
    .input('Lname', sql.VarChar(30), Lname)
    .input('DOB', sql.Date(), DOB)
    .execute('dbo.uspNewStudent')
}

function deleteStudent(StudentID) {
  console.log("Deleting Student");
  var query = "DELETE FROM dbo.Student WHERE StudentID=" + StudentID;
  console.log(query);
  return new sql.Request().query(query);
}


function getStudentObject(StudentID) {
    return new sql.Request().query('SELECT * FROM dbo.Student WHERE StudentID =' + StudentID);
}

//ROUTES
function makeRouter() {
  app.use(cors())

  // frames
  app.get('/', function (req, res) {
    res.sendFile('/static/views/index.html', { root: __dirname })
  })

  app.get('/Students/all', function (req, res) {
    displayAllStudents().then(function (data) {
      return res.json(data);
    });
  })

  app.get('/editStudent/:StudentID', function (req, res) {
    res.sendFile('/static/views/editStudent.html', { root: __dirname })
  })

  app.get("/getStudent/:StudentID", function(req, res) {
    var StudentID = req.params.StudentID;
    console.log(StudentID);
    getStudentObject(StudentID).then(function(data) {
      return res.json(data);
    })
  })

  app.get("/deleteStudent/:StudentID", function(req, res) {
    var StudentID = req.params.StudentID;
    deleteStudent(StudentID).then(function(data) {
      res.redirect('/')
    })
  })

  app.get('/deleteStudent', function (req, res) {
    deleteStudent(StudentID).then(function () {
      console.log(req.StudentID);
      res.redirect('/')
    }).catch(function (err) {
      console.log(err);
    });
  })

  app.post('/createStudent', function (req, res) {
    connectToDb().then(function () {
      var StudentID = req.body.StudentID;
      var Fname = req.body.Fname;
      var Lname = req.body.Lname;
      var DOB = req.body.DOB;

      createStudent(Fname, Lname, DOB).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
    });
  })

  app.post('/StudentSubmit', function (req, res) {
    connectToDb().then(function () {
      var StudentID = req.body.StudentID;
      var Fname = req.body.Fname;
      var Lname = req.body.Lname;
      var DOB = req.body.DOB;
      updateStudent(StudentID, Fname, Lname, DOB).then(function() {
          res.redirect('/')
      });
    }).catch(function (error) {
      console.log(error);
    });
  })

}

function startParty() {
  connectToDb().then(() => {
    makeRouter();
    app.listen(process.env.PORT || 3000);
  })
}

startParty()
