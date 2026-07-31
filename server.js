require("dotenv").config();

const app = require('./app')


const conn = require('./config/conn');

const port = 3000;

conn().then(()=>{
    app.listen(port,()=>{
        console.log(`live http://localhost:${port}`)
    })
})




