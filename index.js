const express = require('express');
const fs = require('fs');
const {MongoClient} = require('mongodb');

const PORT = 8080;

const app = express();
app.use(express.json());

const uri = '';
const client = new MongoClient(uri);
const db = client.db('HighScores');
const collection = db.collection('scores');

app.get('/', (request, response) => {
    fs.readFile('./index.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('not working');
        }
        response.send(html);
    })
});

app.get('/dino.js', (request, response) => {
    fs.readFile('./dino.js', 'utf8', (err, js) => {
        if (err) {
            response.status(500).send('not working');
        }
        response.set('Content-Type', 'application/javascript')
        response.send(js);
    })
});

app.get('/styles.css', (request, response) => {
    fs.readFile('./styles.css', 'utf8', (err, css) => {
        if (err) {
            response.status(500).send('not working');
        }
        response.set('Content-Type', 'text/css')
        response.send(css);
    })
});

app.get('/assets/:filename', (request, response) => {
    let filename = request.params.filename;
    fs.readFile(`./assets/${filename}`, (err, image) => {
        if (err) {
            response.status(500).send('not working');
        }
        response.set('Content-Type', 'image');
        response.send(image);
    })
});

app.get('/api/gettopten', async (request, response) => {
    response.set('Content-Type', 'application/json');
    try {
        response.json(await getTopTen());
    }
    catch (error) {
        console.log(error);
        response.status(500).send({ message: 'Error fetching top ten records' });
    }
});

app.post('/api/sendscore', async function (request, response) {
    try {
        await sendScore(request.body);
    } catch (error) {
        console.log(error);
        response.status(500).send({message: 'Error sending score'});
    }

})

async function getTopTen() {
    const results = await collection.find().sort({Score: -1}).limit(10).toArray();

    const topTen = results.map((result) => {
        return {
            Username: result.Username,
            Score: result.Score
        }
    });

    return JSON.stringify(topTen);
}

async function sendScore(scoreData) {
    await collection.insertOne(scoreData);
}

async function main() {
    try {
        await client.connect();

    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
