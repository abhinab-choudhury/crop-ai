const express = require('express');
const app = express();
require('dotenv').config();
// const cors = require('cors');

app.use(express.json());

app.use('', require('./routes/cropRotationRoute'));
app.use('', require('./routes/chat'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is listining to port ${PORT}`);
});
