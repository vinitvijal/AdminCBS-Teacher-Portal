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
var adminObject = {};


const addAttendance = (AttendanceCode, user, adminObject) => {
    console.log('AddAttendance OPEN ++++')
    todaysDate = String(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate())
    const uid = AttendanceCode[0]
    const teacherData = adminObject[uid]
    const teacher = (teacherData['teacher'])
    const newdata = teacherData['newdata']
    var ref = db.ref(`Teachers/${teacher[0]}/${todaysDate}/${teacher[2]+teacher[3]+newdata[1]}/Attendance`);
    var tDataSet = {}
    tDataSet[user[0]] = user[1]
    console.log(tDataSet)
    ref.update(tDataSet)
    console.log('Teacher Uploaded')
    var ref = db.ref(`Students/${user[1].split('.').join('_')}/attendance/${todaysDate}`);
    const dataSet = {}
    dataSet[teacher[2]+teacher[3]+newdata[1]] = {'Present' : true, 'Teacher' : teacher[1]}
    ref.update(dataSet);
    return 'Attendance Updated!!!'
      
}


// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });



function randomIntFromInterval(newData, teacherData) { // min and max included 
    const uid = String(newData[0]);
    const todaysDate = String(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate())
    currentCode = Math.floor(Math.random() * (9000 - 1000 + 1) + 1000)
    adminObject[uid] =  {currentClassCode: currentCode, teacher : teacherData, newdata :newData};
    console.log(adminObject[uid])

  }
  




function addClassToTeacher(newdata, teacher){
    todaysDate = String(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate())
    uid = teacher[0]
    teachername = teacher[1]
    course = teacher[2]
    subject = teacher[3]
    classcode = newdata[1]

    const data = new Object;
    data['Teacher Name'] = teachername;
    data['Course'] = course;
    data['Subject'] = subject;
    data['Date'] = todaysDate;
    data['Class'] = classcode;
    const ref = db.ref(`Teachers/${uid}/${todaysDate}/${course + subject + classcode}`);
    ref.update(data)
    return `Teachers/${uid}/${todaysDate}/${course + subject + classcode}`;


}



app.get('/admin', (req,res)=>{
    currentClass = req.query.classCode;
    teacher = req.query.teacherData;
    let newData = currentClass.split('_')
    let teacherData = teacher.split('_')

    console.log("New Data : " + teacherData)
    const classPath = addClassToTeacher(newData, teacherData)

    let uid = newData[0]
    randomIntFromInterval(newData, teacherData)
    // console.log(adminObject[newData[0]])
    // console.log(`${adminObject[newData[0]]}_${adminObject[newData[0]][currentClassCode]}`)
    res.send({'msg': `${newData[0]}_${adminObject[uid].currentClassCode}`, 'path': classPath})
    console.log(`${newData[0]}_${adminObject[uid].currentClassCode}`)
    // console.log(currentClass)
})




app.get('/delete', (req, res)=>{
    uid = req.query.classCode
    console.log(uid)
    delete adminObject[uid]
    console.log(adminObject)
    console.log('deleted')
    res.send('Done')
})



app.get('/test', (req,res)=>{
    randomIntFromInterval()
    res.send({'msg':currentCode})
})



app.get('/code', (req,res) => {
    const code = req.query.code;
    const user = (req.query.name).split('_');
    console.log(user)
    console.log(code)
    const AttendanceCode = code.split('_')
    todaysDate = String(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate())

    if (String(adminObject[AttendanceCode[0]].currentClassCode) == String(AttendanceCode[1])){
        const result = addAttendance(AttendanceCode,user, adminObject)
        console.log('Attendance Done')
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