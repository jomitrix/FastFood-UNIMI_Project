// --- LIBRARIES --- 
require("dotenv").config();
require('module-alias/register');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require("@database/connection");
const path = require('path');
const { errorHandler } = require('@middleware/errorHandler');
const app = express();

// --- PARSERS ---
app.use(bodyParser.json());
app.use(cookieParser());

// --- CORS ---
app.use(cors({
	origin: (origin, callback) => callback(null, true),
}));

// --- STATIC FILES ---
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DATABASE CONNECTION ---
db.then(async () => console.log("Connected to MongoDB")).catch((err) => console.log(err));


// --- ROUTES ---
const apiRouter = require('./routes/api/index');

// --- MIDDLEWARE ---
app.use('/api', apiRouter);

// --- ERROR HANDLER ---
app.use(errorHandler);

// --- PORT LISTENER ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});