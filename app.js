/* Skapat av Amanda Hwatz Björkholm 
Moment 3 - Javascriptbaserad Webbutveckling*/


const express = require('express');
const app = express();
const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/myCourses', { useNewUrlParser: true });

// Koppla upp till databas på Mlab
mongoose.connect("mongodb+srv://admin:lösen@cluster0.1oheg.mongodb.net/myCourses?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected!"));


// Sätter att inkommande data är json-objekt
app.use(express.json());
const port = process.env.PORT;
//const port = 3000;
app.use(express.static(__dirname + '/courses'));
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
app.get('/courses', async (req, res) => {
    try {
        // Hämta alla kurser
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
        // Hämta kurs med specifikt _id
        res.json(await Course.findById(id));
    } catch {
        res.json({message: "Couldn't find course"});
    }
});

// DELETE
app.delete("/courses/:id", async (req, res) => {
    let id = req.params.id;

    try {
        // Ta bort kurs med visst _id
        await Course.findByIdAndDelete(id);
        res.json({message: "Course deleted"});
    } catch {
        res.json({message: "Couldn't find course"});
    }
});

// POST
app.post("/courses", (req, res) => {
    try {
        // Sätt inskickad data till model och spara till databasen
        let newCourse = new Course(req.body);
        newCourse.save();
        res.json({message: "Course added"});
    } catch {
        res.json({message: "Couldn't add course"})
    }
});
