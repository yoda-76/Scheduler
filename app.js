const express =require("express")
const cors=require("cors")
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
app.use(bodyParser.json())
app.use(cors())

// create schema
const studentSchema=mongoose.Schema({
    rollNo: Number,
    sub:Object,
    schDate: Object,
    schSub:Object,
    invigilator:Object,
    batch:Object
})
//rollNo:rollNo, sub:sub, schDate:[], schSub:[], invigilator:[], batch:[]

const batchSchema=mongoose.Schema({
    sem:Number,
    b:Number
})
// create object model
const sem1=mongoose.model("sem1",studentSchema)
const sem2=mongoose.model("sem2",studentSchema)
const sem3=mongoose.model("sem3",studentSchema)
const sem4=mongoose.model("sem4",studentSchema)
const sem5=mongoose.model("sem5",studentSchema)
const sem6=mongoose.model("sem6",studentSchema)
const sem7=mongoose.model("sem7",studentSchema)
const sem8=mongoose.model("sem8",studentSchema)

const b=mongoose.model("b",batchSchema)


mongoose.connect('mongodb+srv://yadvendras20:2gVaU1s6nibPt9nz@cluster0.ii3dujj.mongodb.net/test').then(e=>{
    console.log("success")
}).catch(err=>{
    console.log(err)
})


app.post("/uploadStudent",async(req,res)=>{
    const rollNo=req.body.rollNo
    const sem=req.body.sem
    const sub=req.body.sub
    var newStudent={};

    switch(sem){
        case 1: newStudent=new sem1({rollNo:rollNo, sub:sub, schDate:[], schSub:[], invigilator:[], batch:[]})
        break;
        case 2: newStudent=new sem2({rollNo, sub, schDate:[], schSub:[], invigilator:[], batch:[]})
        break;
        case 3: newStudent=new sem3({rollNo, sub, schDate:[], schSub:[], invigilator:[], batch:[]})
        break
        case 4: newStudent=new sem4({rollNo, sub, schDate:[], schSub:[], invigilator:[], batch:[]})
        break
        case 5: newStudent=new sem5({rollNo, sub, schDate:[], schSub:[], invigilator:[], batch:[]})
        break
        case 6: newStudent=new sem6({rollNo, sub, schDate:[], schSub:[], invigilator:[], batch:[]})
        break
        case 7: newStudent=new sem7({rollNo, sub, schDate:[], schSub:[], invigilator:[], batch:[]})
        break
        case 8: newStudent=new sem8({rollNo:rollNo, sub:sub, schDate:[], schSub:[], invigilator:[], batch:[]})
        break
    }
    try{
        await newStudent.save()
    }catch (error) {
        console.error("error is happeneig here",error);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    
    res.send('done')
})

app.post("/getStudent",async(req,res)=>{
    const sem=Number(req.body.sem)
    console.log(sem)

    var data={}
    switch(sem){
        case 1: data=await sem1.find({})
        break
        case 2: data=await sem2.find({})
        break
        case 3: data=await sem3.find({})
        break
        case 4: data=await sem4.find({})
        break
        case 5: data=await sem5.find({})
        break
        case 6: data=await sem6.find({})
        break
        case 7: data=await sem7.find({})
        break
        case 8: data=await sem8.find({})
        break
    }
    console.log(data)
    res.json(data)

})

 
//schedule form
app.post("/schedule",async(req,res)=>{
    const date=req.body.date
    const sub=req.body.sub
    const sem=Number(req.body.sem)
    const totalStudents=Number(req.body.totalStudents)
    const invigilator=req.body.invigilator
    var studentLeft=totalStudents
    console.log(req.body)

    var data={}
    switch(sem){
        case 1: data=await sem1.find({})
        break
        case 2: data=await sem2.find({})
        break
        case 3: data=await sem3.find({})
        break
        case 4: data=await sem4.find({})
        break
        case 5: data=await sem5.find({})
        break
        case 6: data=await sem6.find({})
        break
        case 7: data=await sem7.find({})
        break
        case 8: data=await sem8.find({})
        break
    }
    var ba= await b.find({sem:sem})
    console.log("value of ba\n", ba)
    if(!ba[0]){
        console.log("ba is unndifined")
        const bObj=new b({sem:sem,b:1})
        await bObj.save()
        ba=[{sem,b:0}]
    } 

    ba=ba[0].b
    console.log("current ba",ba)
    ba++
    console.log("updated ba",ba)
    // console.log(data)
    for(var i=0;i<data.length;i++){
        console.log("insidee loop")
        s=data[i]
        console.log(s)
        console.log(studentLeft)
        if(studentLeft<=0){
            break
        }
        if(studentLeft>0 && s.sub.includes(sub) && !s.schDate.includes(date) && !s.schSub.includes(sub)){
            s.schDate.push(date)
            s.schSub.push(sub)
            s.invigilator.push(invigilator)
            s.batch.push(ba)

            


              const t=async(sems)=>{
                const result1 = await sems.updateOne(
                    { rollNo:s.rollNo },
                    { $set: { schDate:s.schDate, schSub:s.schSub, invigilator:s.invigilator, batch:s.batch} }
                  );
                  if (result1.nModified === 0) {
                    return res.status(404).json({ msg: "Document not found" });
                  }
            }
            switch(sem){
                case 1: t(sem1)
                break
                case 2: t(sem2)
                break
                case 3: t(sem3)
                break
                case 4: t(sem4)
                break
                case 5: t(sem5)
                break
                case 6: t(sem6)
                break
                case 7: t(sem7)
                break
                case 8: t(sem8)
                break
            }

            studentLeft=studentLeft-1
        }
    }
    // data.map(async s=>{
        
    // })
    
    //update b in atlas
    const result = await b.updateOne(
        { sem:sem },
        { $set: { b:ba} }
      );
      if (result.nModified === 0) {
        return res.status(404).json({ msg: "Document not found" });
      }

    res.json({msg:"done", studentLeft})

})

app.post("/reset",async(req,res)=>{
    const sem =Number(req.body.sem)
    // const data=await sem8.find({})
    const t=async(sems)=>{
        const result1 = await sems.updateMany(
            {  },
            { $set: { schDate:[], schSub:[], invigilator:[], batch:[]} }
          );
          if (result1.nModified === 0) {
            return res.status(404).json({ msg: "Document not found" });
          }
          console.log(sem)
          const result = await b.updateOne(
            { sem:sem },
            { $set: { b:0} }
          );
          if (result.nModified === 0) {
            return res.status(404).json({ msg: "Document not found" });
          }
    }
    switch(sem){
        case 1: t(sem1)
        break
        case 2: t(sem2)
        break
        case 3: t(sem3)
        break
        case 4: t(sem4)
        break
        case 5: t(sem5)
        break
        case 6: t(sem6)
        break
        case 7: t(sem7)
        break
        case 8: t(sem8)
        break
    }
      res.send("done")
})
//write apis here

app.listen(30)