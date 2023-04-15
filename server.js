const express = require('express');
const app = express();
const port = 8080;
const admin = require("firebase-admin");
const cors = require('cors');
app.use(cors({
    origin: '*'
}));



const date = new Date();
console.log(date.getDate())
console.log(date.getMonth() + 1)
console.log(date.getFullYear())

// Fetch the service account key JSON file contents
var serviceAccount = require("./attendcbs-firebase-adminsdk-o9q48-34479a73c0.json");
const { Timestamp } = require('mongodb');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://attendcbs-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules

var db = admin.database();


const addAttendance = (name, dateToday, clas) => {
    var ref = db.ref(`Students/${name}/attendance/${dateToday}`);
    
    const dataSet = {}
    dataSet[clas] = 'P'

    ref.update(dataSet);
    return 'Attendance Updated!!!'
      
    
}


// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });



function randomIntFromInterval() { // min and max included 
    currentCode = Math.floor(Math.random() * (9000 - 1000 + 1) + 1000)

  }
  




var currentCode = 0;
var currentClass = '';

app.get('/admin', (req,res)=>{
    currentClass = req.query.classCode;
    randomIntFromInterval()
    res.send({'msg':currentCode})
    console.log(currentCode)
    console.log(currentClass)
})



app.get('/test', (req,res)=>{
    randomIntFromInterval()
    res.send({'msg':currentCode})
})



app.get('/code', (req,res) => {
    const code = req.query.code;
    const name = req.query.name;
    console.log(name)
    console.log(code)
    todaysDate = String(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate())

    if (currentCode == code){
        const result = addAttendance(name,todaysDate,currentClass)
        console.log(result)
        res.send({'msg':'Attendance Updated'})
    }else{
        res.send({'msg':'Wrong Code, Scan Again!!!'})
    }
})



app.get('/atten', (req, res)=>{
    console.log(req.query)
    const result = addAttendance(req.query.name,req.query.dateToday,req.query.clas)
    res.send(result)
})


app.get('/',(req,res)=>{
    res.send('Hello World!!')
})

app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})