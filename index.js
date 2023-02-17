const express = require('express');
const fs = require('fs');

const PORT = 8080;

const app = express();

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

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));