const express = require('express');
const router = express.Router();
const { addRecipe, getRecipes } = require('../controllers/recipeController');
const { validateRecipe } = require('../middlewares/validation');

router.get('/resep', getRecipes);

router.post('/resep', validateRecipe, addRecipe);

module.exports = router;