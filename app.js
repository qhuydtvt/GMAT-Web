const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const apiRouter = require('./routes/api');

const settings = require('./settings');
const hash = require('./helpers/hash');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.send('error');
// });

mongoose.connect(settings.dbUri, (err) => {
  if(err) console.log(err);
  console.log('DB connect success!');
});

let port = process.env.PORT || settings.port;

app.listen(port, (err) => {
  if(err) console.log(err);
  console.log(`App is listen at ${port}`);
});