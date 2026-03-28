const express = require('express');
const app = express();
const { enrichNutrition } = require('./scripts/enrichNutrition');
enrichNutrition().catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/auth'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/mealplan', require('./routes/mealplan'));
app.use('/api/workout', require('./routes/workout'));
app.use('/api/grocery', require('./routes/grocery'));

app.listen(3001, () => console.log('FridgeToFit backend running on :3001'));
