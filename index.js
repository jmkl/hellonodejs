const express = require('express');
const request = require('./api/request')
const texturelab = require('./api/texturelab')
const path = require('path');
const app = express();
const pug = require('pug');
const PORT = process.env.PORT || 5050;



app.set("view engine",'pug');



// const connectLivereload = require('connect-livereload');
// const livereload = require("livereload");
// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(path.join(__dirname,'public'));
// liveReloadServer.watch(path.join(__dirname,'api')); 
// app.use(connectLivereload());

app.get('/', (req, res) => {
    res.render('index', { title: 'Hedy', message: 'Hello there!' })
  })

  app.use("/api/request",request);
  app.use("/api/texturelab",texturelab);

app.listen(PORT,()=>console.log(`running  on http://localhost:${PORT}`))

// liveReloadServer.server.once(("connection"),()=>{
//     setTimeout(()=>{
//         liveReloadServer.refresh("/")
//     },100);
// })