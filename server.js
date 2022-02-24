const open = require('open');

const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.static('public'));

app.listen(8000, () => {
	console.log("Listening to port 8000...");
});

open('http://localhost:8000');