/* Skapat av Amanda Hwatz Björkholm 
Moment 3 - Javascriptbaserad Webbutveckling*/

// MongoDb
// Lösen: nichof-6vewpo-sixbaW
// Anv: Admin

const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/myCourses', { useNewUrlParser: true });
//mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://admin:nichof-6vewpo-sixbaW@cluster0.1oheg.mongodb.net/myCourses?retryWrites=true&w=majority", {useNewUrlParser: true});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected!"));


// Sätter att inkommande data är json-objekt
app.use(express.json());
const port = process.env.PORT;
//const port = 3000;
//app.use(express.static(__dirname + '/courses'));


// app.listen(port, () => {
//     console.log(`Example app listening at https://murmuring-ravine-91212.herokuapp.com`)
// });

app.listen(port, () => console.log(`Server started`));

// Sätt headers
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Schema
const courseSchema = new mongoose.Schema({
    courseId: String,
    courseName: String,
    coursePeriod: String,
});

// Model
const Course = mongoose.model('courses', courseSchema);


// GET kurser
app.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

// GET med ID
app.get("/courses/:id", async (req, res) => {
    let id = req.params.id;
  
    try {
        res.json(await Course.findById(id));
    } catch {
        res.json({message: "Couldn't find course"});
    }
});

// DELETE
app.delete("/courses/:id", async (req, res) => {
    let id = req.params.id;

    try {
        await Course.findByIdAndDelete(id);
        res.json({message: "Course deleted"});
    } catch {
        res.json({message: "Couldn't find course"});
    }
});

// POST
app.post("/courses", (req, res) => {
    try {
        let newCourse = new Course(req.body);
        newCourse.save();
        res.json({message: "Course added"});
    } catch {
        res.json({message: "Couldn't add course"})
    }
});