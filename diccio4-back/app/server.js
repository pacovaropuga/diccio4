const express = require('express');
const {sequelize} = require('./models/index');
const app = express();

const cors = require('cors')
// Settings
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET','POST','PUT','DELETE');
    next();
  })

// Routes
app.use(require('./routes/routes'));

// Start server
app.listen(PORT, function(){
    console.log('Server http://localhost:',PORT);    
    sequelize.authenticate().then(() => {
        console.log("Successful connection!");
    }).catch(error => {
        console.log('database connection error', error);
    })    
});
