require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/auth'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/mealplan', require('./routes/mealplan'));
app.use('/api/workout', require('./routes/workout'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`FridgeToFit backend running on :${PORT}`));
