const express = require('express');
const request = require('./api/request')
const app = express();
const PORT = process.env.PORT || 5050;

app.use("/api/request",request);


app.listen(PORT,()=>console.log(`running on http://localhost:${PORT}`))