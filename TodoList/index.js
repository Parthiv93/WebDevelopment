import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const dailyTasks = []; 
const workTasks = []; 

function getCurrentYear() {
    return new Date().getFullYear();
}

function getDayAndDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Todo List',
        currentYear: getCurrentYear(),
        getDayAndDate: getDayAndDate,
    });
});

app.get('/daily', (req, res) => {
    res.render('daily', {
        pageTitle: 'Daily Tasks',
        dailyTasks: dailyTasks,
        currentYear: getCurrentYear(),
        getDayAndDate: getDayAndDate,
    });
});

app.post('/addTask/daily', (req, res) => {
    const newItem = {
        task: req.body.newTaskDaily, 
        done: false, 
    };
    dailyTasks.push(newItem);
    res.redirect('/daily');
});

app.get('/work', (req, res) => {
    res.render('work', {
        pageTitle: 'Work Tasks',
        workTasks: workTasks,
        currentYear: getCurrentYear(),
        getDayAndDate: getDayAndDate,
    });
});

app.post('/addTask/work', (req, res) => {
    const newItem = {
        task: req.body.newTaskWork, 
        done: false, 
    };
    workTasks.push(newItem);
    res.redirect('/work');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
