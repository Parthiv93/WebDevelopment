import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static('public'));


app.get('/', async (req, res) => {
    try {
        const result = await axios.get('https://v2.jokeapi.dev/joke/Any');
        res.render('index.ejs', {
            setup: result.data.setup,
            delivery: result.data.delivery
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});