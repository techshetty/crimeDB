const express = require("express")
const cors=require("cors")
const {Client} = require('pg'); 
require('dotenv').config()
const cookieParser=require('cookie-parser');
const app=express();
app.use(express.json())
app.use(cookieParser())
const port=process.env.PORT
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')
const dburl=process.env.supaUri
app.use(cors({origin: ["http://localhost:3000","http://192.168.152.166"],credentials: true}))
const pgclient = new Client({
    connectionString: dburl,
  });
pgclient.connect().then(()=>{
    console.log("Connected to PGSQL Database")
}).catch(err=>{console.log(err.stack)})
app.get("/",(req,res)=>{
    res.send("CrimeDB API is running.....")
})
app.get('/stats',async(req,res)=>{
    // console.log("Sent DB Stats")
    try{
    const curDate = new Date().toISOString().split('T')[0];
    const tr= await pgclient.query('SELECT * from criminals')||[]
    const ac= await pgclient.query('SELECT * from applicant')||[]
    const ret= await pgclient.query('SELECT * from applicant where created_at::date=$1::date',[curDate])||[]
    const retc= await pgclient.query('SELECT * from criminals where created_at::date=$1::date',[curDate])||[]
    const ru= await pgclient.query('SELECT * from applicant where created_at::date=$1::date',[curDate])||[]
    const t=[
        { label: 'Total Records', value: tr.rows.length },
        { label: 'Active Cases', value: ac.rows.length },
        { label: 'Records Added Today', value: ret.rows.length+retc.rows.length },
        { label: 'Recent Updates', value: ru.rows.length+retc.rows.length},
      ];
      return res.status(200).json({success:true,data:t})}
      catch(error){
        return res.status(404).json({success: false,error: error.stack})
      }
})

app.listen(port,()=>{
console.log(`Server running on port:${port}`)
})

const random=(max)=>{
    return (Math.floor(Math.random()*100)%max+1).toString()
}
const JWT_SECRET =process.env.JWT_SECRET;

app.post('/register',async(req,res)=>{
    try{
    const {username,password}=req.body
    const exuser=await pgclient.query('SELECT * from DBUSERS where username=$1',[username])
    if(exuser.rows.length>0) return res.status(400).json({msg: `User ${username} already exists in the database. Please Login`})
    const hashedPass = await bcrypt.hash(password,10)
    await pgclient.query('INSERT INTO DBUSERS (username,password) values($1,$2)',[username,hashedPass])
    const token = jwt.sign({username},JWT_SECRET,{expiresIn:"2h"})
    res.cookie('token', token, {
            httpOnly: true,
            expires: false,
            maxAge: 48*60*60*1000
          });
    return res.status(200).json({
        success: true,
        message: `User ${username} was added successfully`
    })
    }
    catch(error){

    }
})
app.post('/login',async(req,res)=>{
    try{
    const {username,password}=req.body
    const exuser=await pgclient.query('SELECT * from DBUSERS where username=$1',[username])
    if(exuser.rows.length==0) return res.status(400).json({success:false,message: `User ${username} doesn't exist in the database. Please Register`})
    const user=exuser.rows[0]
    const cpass= await bcrypt.compare(password,user.password)
    if(!cpass) return res.status(500).json({success:false, message:"Invalid credentials"})
        const token = jwt.sign({username,password},JWT_SECRET,{expiresIn:"2h"})
    res.cookie('token', token, {
            httpOnly: true,
            expires: false,
            maxAge: 48*60*60*1000
          });
    return res.status(200).json({
        success: true,
        message: `User ${username} has logged in`
    })
    }
    catch(error){

    }
})

const isLoggedIn=(req,res,next)=>{
    const token=req.cookies?.token
    // console.log(req.cookies?.token)
    if(!token) return res.status(404).json({success:false,message:"Error. Token missing"})
    try{
        const dec=jwt.verify(token,JWT_SECRET)
        req.user=dec
        next()
    }
    catch(error){console.log(error);return res.status(500).json({success: false,message: "access denied"})}
}

app.get('/prot',isLoggedIn,(req,res)=>{
    return res.send(`Welcome, ${req.user.username}This is a protected route`)
},)

app.get('/testlog',async(req,res)=>{
    const rs = await fetch('http://localhost:8080/login',{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        credentials: "include",
        body:JSON.stringify({username:'tet',password: 'tet' })
    })
    const rj= await rs.json();
    console.log(rs);
    res.json(rs)
})

app.get('/logout',(req,res)=>{
    res.clearCookie('token', { httpOnly: true, path: '/' });
    return res.status(200).json({msg: "Logged out successfully"})
})

app.get('/check_reg',isLoggedIn,(req,res)=>{
return res.status(200).json({success:true,message: "Logged in"})
})

app.get('/findcrim',async(req,res)=>{
const q=req.query.q
var cbid={},cbname={}
cbid.rows=[],cbname.rows=[]
if(parseInt(q))
cbid=await pgclient.query("SELECT * FROM CRIMINALS where criminal_id=$1",[parseInt(q)])
cbname = await pgclient.query("SELECT * FROM CRIMINALS where name=$1",[q])
console.log(cbid.rows,cbname.rows)
const tcrim= cbid?.rows?.concat(cbname.rows)||[]
console.log("JOINED",tcrim)
const crimList=[],crimSet={}
for(c of tcrim){
    if(crimSet?.c?.criminal_id) continue;
    crimList.push({
        criminal_id: c.criminal_id,
        imagedata: c.imagedata||`#`,
        name: c.name,
        gender:c.gender,
        age: c.age,
        address:c.address,
        arrest_date: c.arrest_date
    })
    crimSet[c.criminal_id]=1
}
return res.status(200).json({
    success:true,
    data: crimList
})

})

app.post('/newcrim',async(req,res)=>{
const {name,gender,age,address,arrest_date,imageData}=req.body
// console.log(req.body)
try{
    await pgclient.query('INSERT INTO criminals (name,age,gender,address,arrest_date,imagedata) values($1,$2,$3,$4,$5,$6)',[name,age,gender,address,arrest_date,imageData])
    res.status(200).json({msg:"New criminal Added Successfully"})
}
catch(error){
    console.log(error)
    res.status(500).json({message: "Failed to insert criminal",error:error})
}
})

app.post('/newcomplaint',async(req,res)=>{
    const {name,email,phone,details}=req.body
    try{
        await pgclient.query('INSERT INTO applicant (name,email,phone,complaint_details) values($1,$2,$3,$4)',[name,email,phone,details])
        res.status(200).json({msg:"New complaint registered successfully"})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Failed to add ccompaint",error:error})
    }
})
app.post('/feedback',async(req,res)=>{
    const {name,rating,comments}=req.body
    try{
        await pgclient.query('INSERT INTO feedback (name,rating,comments) values($1,$2,$3)',[name,rating,comments])
        res.status(200).json({msg:"New complaint registered successfully"})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Failed to add ccompaint",error:error})
    }
})