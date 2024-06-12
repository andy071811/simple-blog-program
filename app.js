const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const methodOverride = require('method-override');

const mainRoute = require('./routes/main');
const adminRoute = require('./routes/admin');
const isActiveRoute = require('./helpers/routeHelpers');
dotenv.config({ path: './config.env' });


const app = express();
const PORT = 5000 || process.env.PORT;

// CONNECT TO DB:
const DB = process.env.DATABASE

  mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  });

  // MIDDLEWARES:
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(methodOverride('_method'))

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE
    })
  }));

// SERVING THE STATIC FILES:
app.use(express.static('public'));

// TEMPLATING ENGINE:
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

// Route to the 'routers' folder:
app.use('/', mainRoute);
app.use('/', adminRoute);

// STARTING THE SERVER:

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});