const express = require("express");
const mysql = require("mysql2");
const cors = require("cors")
const port = 4000;
const bcrypt = require("bcrypt")


const app = express();
app.use(cors());
app.use(express.json());



const db = mysql.createConnection({
  host: "mission-x-olly-team.cdh90dqzu45e.ap-southeast-2.rds.amazonaws.com",
  user: "groupmember_ewan", 
  password: "ollyneedwater",
  database: "missonx"
  
})


db.connect(function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log("connected to db")
  }
})

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    res.send(result)
  })
})

app.get("/project*", (req, res) => {
  //let sql = "select * from project where " + url.queryString
  db.query("SELECT * FROM project", (err, result) => {
    res.send(result)
  })
})


app.post("/login/students", (req, res) => {
  const plainPass = req.body.password

  db.query("SELECT * FROM users WHERE role = 'student' && email = ?", [req.body.email], function (err, result) {
   
    if (err) {
      console.log(err)
    } else {
      if (result.length > 0) {
        const passwordCheck = bcrypt.compareSync(plainPass, result[0].password)
        

      if (passwordCheck) {
        console.log("check successful")
        res.sendStatus(200)
      } else {
        console.log("check unsuccessfull")
        res.sendStatus(401)
        }
      } else {
        console.log("user not exist")
       
      }
}})
})
  
app.post("/login/teachers", (req, res) => {
  const plainPass = req.body.password

  db.query("SELECT * FROM users WHERE role = 'teacher' && email = ?", [req.body.email], function (err, result) {
   
    if (err) {
      console.log(err)
    } else {
      if (result.length > 0) {
        const passwordCheck = bcrypt.compareSync(plainPass, result[0].password)
        

      if (passwordCheck) {
        console.log("check successful")
        res.sendStatus(200)
      } else {
        console.log("check unsuccessfull")
        res.sendStatus(401)
        }
      } else {
        console.log("user not exist")
       
      }
}})
})

app.post("/signup", (req,res) => {
  const hashedPass = bcrypt.hashSync(req.body.password, 10)
  db.query("INSERT INTO users SET ?", 
  { name: req.body.name, email: req.body.email, password: hashedPass }, 
  function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log("successful signup")
      res.sendStatus(201)
      }
})
})

app.listen(port)
