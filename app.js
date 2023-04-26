const express =require("express")
const cors=require("cors")
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
app.use(bodyParser.json())
app.use(cors())

// create schema
const student=mongoose.Schema({
    rollNo: Number,
    schDate: Object,
    schSub:Object
})
// create object model
const sem1=mongoose.model("sem1",student)
const sem2=mongoose.model("sem2",student)
const sem3=mongoose.model("sem3",student)
const sem4=mongoose.model("sem4",student)
const sem5=mongoose.model("sem5",student)
const sem6=mongoose.model("sem6",student)
const sem7=mongoose.model("sem7",student)
const sem8=mongoose.model("sem8",student)



mongoose.connect('mongodb+srv://yadvendras20:2gVaU1s6nibPt9nz@cluster0.ii3dujj.mongodb.net/test').then(e=>{
    console.log("success")
}).catch(err=>{
    console.log(err)
})


app.post("/uploadStudent",async(req,res)=>{
    const rollNo=req.body.rollNo
    const schDate=req.body.schDate
    const schSub=req.body.schSub
    const sem=req.body.sem
    var newStudent={};

    switch(sem){
        case 1: 
        newStudent=new sem1({rollNo, schDate, schSub})
        console.log(1)
        break;
        case 2: 
        newStudent=new sem2({rollNo, schDate, schSub})
        console.log(2)

        break;
        case 3: newStudent=new sem3({rollNo, schDate, schSub})
        break
        case 4: newStudent=new sem4({rollNo, schDate, schSub})
        break
        case 5: newStudent=new sem5({rollNo, schDate, schSub})
        break
        case 6: newStudent=new sem6({rollNo, schDate, schSub})
        break
        case 7: newStudent=new sem7({rollNo, schDate, schSub})
        break
        case 8: newStudent=new sem8({rollNo, schDate, schSub})
        break
        
    }
    await newStudent.save()
    res.send('done')
})

//write apis here

app.listen(30)