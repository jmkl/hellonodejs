const express = require('express');
const app = express();
const port = process.env.PORT || 80;


app.get('/', (req, res) => {
    res.sendFile('out.html', { root: __dirname });





});
app.get('/:keyword', (req, res) => {
  
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});


