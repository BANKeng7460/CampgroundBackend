const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require("cors");
//Load env vars
dotenv.config({path: './config/config.env'});

//connect to database
connectDB();

//route files
const campgrounds = require('./routes/campgrounds');
// const reviews = require('./routes/reviews');
// const users = require('./routes/users');
const bookings = require('./routes/bookings');
const auth = require('./routes/auth');
const blacklists = require('./routes/blacklists');


const app = express();
//body parser
app.use(express.json());

//mount routers
app.use('/api/v1/campgrounds', campgrounds);
// app.use('/api/v1/reviews', reviews);
// app.use('/api/v1/users', users);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/auth', auth);
app.use('/api/v1/blacklists',blacklists);

var corsOptions = {
    origin: "http://localhost:3001"
  };
  
  app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    //close server & exit process
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});