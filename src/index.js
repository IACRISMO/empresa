// Path: src/index.js
const express = require('express');
const apiRouter = require('./routers/routes');

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

