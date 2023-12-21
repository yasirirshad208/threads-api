const express = require('express');
const connectDatabase = require('./config/database');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors')


const userRoute = require('./routes/userRoutes');
const postRoute = require('./routes/postRoutes');
const userEngagementRoutes = require('./routes/userEngagementRoutes');
const shoutoutRoutes = require('./routes/shoutoutRoutes');
const activityRoutes = require('./routes/activityRoutes');
const replyRoutes = require('./routes/replyRoutes');

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(cors())
// help to read form data
app.use(express.urlencoded({extended:false}));
dotenv.config({path: "./config/config.env"});
app.use('/public/', express.static('public'))


app.use(require('express-session')({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')

// db connection
connectDatabase();


//api routes 
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/userEngagement', userEngagementRoutes);
app.use('/api/shoutout', shoutoutRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reply', replyRoutes);

// error middleware
app.use(errorMiddleware);

//'192.168.0.127' || 

app.listen(process.env.PORT, 'localhost',
    ()=>{
    console.log("Backend server is running")
});