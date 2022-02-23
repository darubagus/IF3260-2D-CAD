const open = require('open');

const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.static('public'));

// app.get('/webgl-utils', (req,res,next) => {
// 	res.sendFile(__dirname + '/public/webgl-utils.js');
// });

// app.get('/toolbar', (req,res,next) => {
// 	res.sendFile(__dirname + '/public/toolbar.js');
// });

// app.get('/line', (req,res,next) => {
// 	res.sendFile(__dirname + '/public/line.js');
// });

app.listen(8000, () => {
	console.log("Listening to port 8000...");
});

open('http://localhost:8000');