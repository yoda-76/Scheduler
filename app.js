const express =require("express")
const cors=require("cors")
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
app.use(bodyParser.json())
app.use(cors())

// create schema
const scheduledDataSchema=mongoose.Schema({
  sem:Number,
  data:Object
})

const studentSchema=mongoose.Schema({
    rollNo: Number,
    sub:Object,
    schDate: Object,
    schSub:Object,
    time:Object,
    invigilator:Object,
    batch:Object
})


const invigilatorSchema=mongoose.Schema({
    id: String,
    date: Object
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
const invObjectModel=mongoose.model("invObjectModel",invigilatorSchema)

const scheduledData=mongoose.model("scheduledData",scheduledDataSchema)


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
        case 1: newStudent=new sem1({rollNo, sub, schDate:[], schSub:[], time:[], invigilator:[], batch:[]})
        break;
        case 2: newStudent=new sem2({rollNo, sub, schDate:[], schSub:[], time:[], invigilator:[], batch:[]})
        break;
        case 3: newStudent=new sem3({rollNo, sub, schDate:[], schSub:[], time:[], invigilator:[], batch:[]})
        break
        case 4: newStudent=new sem4({rollNo, sub, schDate:[], schSub:[], time:[], invigilator:[], batch:[]})
        break
        case 5: newStudent=new sem5({rollNo, sub, schDate:[], schSub:[], time:[], invigilator:[], batch:[]})
        break
        case 6: newStudent=new sem6({rollNo, sub, schDate:[], schSub:[], time:[], invigilator:[], batch:[]})
        break
        case 7: newStudent=new sem7({rollNo, sub, schDate:[], schSub:[], time:[], invigilator:[], batch:[]})
        break
        case 8: newStudent=new sem8({rollNo, sub, schDate:[], schSub:[], time:[], invigilator:[], batch:[]})
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



app.post("/getSchedule",async(req,res)=>{
    const rollNo=req.body.rollNo
    var scheduledObj={}
    const makeSchedule=async(sem)=>{
        var data=await sem.find({rollNo})
        console.log(data)
        res.json(data)
    }
    switch(req.body.sem){
        case 1: makeSchedule(sem1)
        break
        case 2: makeSchedule(sem2)
        break
        case 3: makeSchedule(sem3)
        break
        case 4: makeSchedule(sem4)
        break
        case 5: makeSchedule(sem5)
        break
        case 6: makeSchedule(sem6)
        break
        case 7: makeSchedule(sem7)
        break
        case 8: makeSchedule(sem8)
        break
    }


})

 
//schedule form
app.post("/schedule",async(req,res)=>{
    const date=req.body.date
    const sub=req.body.sub
    const sem=Number(req.body.sem)
    const totalStudents=Number(req.body.totalStudents)
    const invigilator=req.body.invigilator
    const invData=await invObjectModel.find({id:invigilator})
    const scheduledObject={}
    if(invData[0]){
        //update the invigilator data
        if(!invData[0].date.includes(date)){
            const result = await invObjectModel.updateOne(
                { id:invigilator },
                { $set: { date:[...invData[0].date, date]} }
              );
              if (result.nModified === 0) {
                return res.status(404).json({ msg: "Document not found" });
              }
        }else{
            return res.status(500).json({ msg: "invigilator is already scheduled for this date" });

        }
    }else{
        const newInvObj=new invObjectModel({id:invigilator,date:[date]})
        newInvObj.save()
    }
    var totalStudentsLeft=0
    var time="a"
    var studentLeft=totalStudents
    // console.log(req.body)

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

    //sorting fetched student data
    await data.sort((b,a) => {return b.rollNo - a.rollNo});
    // console.log("data:",data)

    var ba= await b.find({sem:sem})
    console.log("value of ba\n", ba)
    if(!ba[0]){
        // console.log("ba is unndifined")
        const bObj=new b({sem:sem,b:1})
        await bObj.save()
        ba=[{sem,b:0}]
    } 

    ba=ba[0].b
    // console.log("current ba",ba)
    ba++
    // console.log("updated ba",ba)
    // console.log(data)
    var count=0
    var i=0
    for(i=0;i<data.length;i++){
        if(count==30){
            time="b"
            ba++
            const result = await b.updateOne(
                { sem:sem },
                { $set: { b:ba} }
              );
              if (result.nModified === 0) {
                return res.status(404).json({ msg: "Document not found" });
              }
        }
        else if(count==60){
            time="c"
            ba++
            const result = await b.updateOne(
                { sem:sem },
                { $set: { b:ba} }
              );
              if (result.nModified === 0) {
                return res.status(404).json({ msg: "Document not found" });
              }
        }
        else if(count==90){
            time="d"
            ba++
            const result = await b.updateOne(
                { sem:sem },
                { $set: { b:ba} }
              );
              if (result.nModified === 0) {
                return res.status(404).json({ msg: "Document not found" });
              }
        }
        else if(count>120 || studentLeft<=0){
            totalStudentsLeft= data.length-i
            break
        }
        // console.log("insidee loop")
        s=data[i]
        // console.log(s)
        // console.log(studentLeft)
        
        // console.log(inside)
        if(studentLeft>0 && s.sub.includes(sub) && !s.schDate.includes(date) && !s.schSub.includes(sub)){
            s.schDate.push(date)
            s.schSub.push(sub)
            s.invigilator.push(invigilator)
            s.batch.push(ba)
            s.time.push(time)
            count++

            const scheduledObject=await scheduledData.find({sem:sem})
            
            if(!scheduledObject[0]){scheduledObject[0]={}}
            if(!scheduledObject[0].data){scheduledObject[0].data={}}
            if(!scheduledObject[0].data[sub]){scheduledObject[0].data[sub]={}}
            if(!scheduledObject[0].data[sub][date]){scheduledObject[0].data[sub][date]={}}
            if(!scheduledObject[0].data[sub][date][invigilator]){scheduledObject[0].data[sub][date][invigilator]={}}
            if(!scheduledObject[0].data[sub][date][invigilator][time]){scheduledObject[0].data[sub][date][invigilator][time]=[]}
            
            // console.log(scheduledObject[sub][date][invigilator])
            scheduledObject[0].data[sub][date][invigilator][time].push(s.rollNo)
            console.log("test",scheduledObject[0].data)
            
            console.log("updated data",scheduledObject)

            const result2= await scheduledData.updateOne(
              {sem:6},
              {$set:{data:scheduledObject[0].data}}
            )
            if (result2.nModified === 0) {
                return res.status(404).json({ msg: "Document not found" });
              }


              const t=async(sems)=>{
                const result1 = await sems.updateOne(
                    { rollNo:s.rollNo },
                    { $set: { schDate:s.schDate, schSub:s.schSub,time:s.time, invigilator:s.invigilator, batch:s.batch} }
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

    res.json({msg:"done", totalStudentsLeft, scheduledObject})

})

app.post("/get",async(req,res)=>{
    const data=await scheduledData.find({sem:6})
    console.log(data[0])
    res.send(data[0].data)
})

app.post("/set",(req,res)=>{
  const obj={sem:6, data:{temp:1}}
  const newObj=new scheduledData(obj)
  newObj.save()
})
app.post("/reset",async(req,res)=>{
    const sem =Number(req.body.sem)
    // const data=await sem8.find({})
    const t=async(sems)=>{
        const result1 = await sems.updateMany(
            {  },
            { $set: { schDate:[], schSub:[],time:[], invigilator:[], batch:[]} }
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
          const result2 = await invObjectModel.updateMany(
            { },
            { $set: { date:[]} }
          );
          if (result2.nModified === 0) {
            return res.status(404).json({ msg: "Document not found" });
          }
          const result3 = await scheduledData.updateOne(
            { sem:6},
            { $set: { data:{}} }
          );
          if (result3.nModified === 0) {
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
app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.send({ "msg": "This has CORS enabled 🎈" })
  })
//write apis here

app.listen(30)