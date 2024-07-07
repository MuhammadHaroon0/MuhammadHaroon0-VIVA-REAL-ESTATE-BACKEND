const { fetchToken } = require("./generateToken.js");
////////////////////////////**Packages**\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const express = require("express");
const app = express();
const helmet = require("helmet");
const cron = require('node-cron');

const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
// const cookieParser = require('cookie-parser')
// const passport = require("passport");
// require('./config/passport.js')
// const session = require('express-session')
///////////////////////////Files
const AppError = require("./utils/AppError");
console.log(process.env.FRONTEND_URL);
app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with your actual frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // if you need to support credentials (cookies, authorization headers, etc.)
}));
// app.use(express.static(__dirname + "public"));
let apiToken = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }))
// app.use(cookieParser())
// // Passport Middleware
// app.use(passport.initialize())
// app.use(passport.session())

app.use(helmet());
app.use(morgan("tiny"));

//RATE LIMITING
const limiter = rateLimit({
  windowMs: 45 * 60 * 10000, // 45 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 45 minutes)
  message: "Too many requests send. Please try again in a45 minutes",
});
// app.use("/api", limiter);cd

//SANITIZATION OF REQUESTS FROM NOSQL  INJECTIONS
app.use(mongoSanitize());

//PREVENTING JS OR HTML IN REQUESTS
app.use(xssClean());

//PREVENTING PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      //will not be affected by hpp
    ],
  })
);

// if(!process.env.JWT_KEY)
// {
//     console.log("FATAL ERROR: JWT KEY is not found!")
//     process.exit(1)
// }


fetchToken()
cron.schedule('0 * * * *', fetchToken);
//ROUTERS
const properties = require("./routes/properties.js");


//ROUTES
app.use("/api/v1/properties", properties);

app.get('/', async (req, res, next) => {
  res.send("hello")
})




//PREVENTING REACHING UNDEFINED ROUTES
app.all("*", (req, res, next) => {
  next(
    new AppError(`Couldn't find the ${req.originalUrl} on this server!`, 404)
  );
});

const globalErrorHandler = require("./controllers/errorController");
app.use(globalErrorHandler);
module.exports = app;
