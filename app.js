const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');


//load user model
require('./models/User');

//passport config
require('./config/passport')(passport);

//Load routes
const auth = require('./routes/auth');
const index = require('./routes/index');

//load keys
const keys = require('./config/keys');

//map global promises
mongoose.Promise = global.Promise;
//mongoose connect
mongoose.connect(keys.mongoURI).then(() => {
    console.log('mongodb connected')
})
    .catch(err => console.log(err))

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})


//Use routes
app.use('/auth', auth);
app.use('/', index);


const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server started on ${port}`);
});