const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); 

const recipeRoutes = require('./routes/recipeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', recipeRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});