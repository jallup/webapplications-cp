//
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
var logger = require('morgan');
var Promise = require("bluebird");
var createError = require('http-errors');
var path = require('path');

var authRouter = require('./routes/auth');

TWO_HOURS = 1000 * 60 * 60 * 1

const {
  PORT = 3000,
  NODE_ENV = 'development',
  SESS_LIFETIME = TWO_HOURS,
  SESS_NAME = 'sid',
  SESS_SECRET= 'jallupee'
} = process.env

const IN_PROD = NODE_ENV === 'production'

const users = [
  {id: 1, name: 'Eikka', email: 'eikka@im.com', password: 'oonim'},
  {id: 2, name: 'Kimmo', email: 'kimmo@uva.com', password: 'uvabesd'},
  {id: 3, name: 'Kartsa', email: 'kartsa@im.com', password: 'oonimrantala'}

]

const app = express()

var mongoose = require('mongoose');

var dev_db_url = 'mongodb://localhost:27017'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({
  extended: true

}))

app.use('/auth', authRouter);

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD, //
  }
}))

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login')
  } else {
    next()
  }
}

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/home')
  } else {
    next()
  }
}

app.get('/', (req, res) => {

  const { userId } = req.session
  //const userId = 1

  res.send(`
    <h1>Welc!</h1>
    ${userId ? `
      <a href='/home'>Home</a>
      <form method='post' action='/logout'>
        <button>Logout</button>
      </from>
    ` : `
      <a href='/login'>Login</a>
      <a href='/register'>Register</a>
      `}
    `)
})

app.get('/home', redirectLogin,(req, res) => {

  const user = users.find(user => user.id === req.session.userId)

  res.send(`
    <h1>Home</h1>
    <a href='/'>Main</a>
    <ul>
      <li>Name: ${user.name} </li>
      <li>Email: ${user.email}</li>
    </ul>
    `)

})



app.get('/login', redirectHome ,(req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method='post' action='/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Password' required />
      <input type='submit' />
    </form>
    <a href='/register'>Register</a>
    `)
  // reg.session.userId =
})

app.get('/register', redirectHome ,(req, res) => {
  res.send(`
    <h1>Register</h1>
    <form method='post' action='/register'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='name' name='name' placeholder='Name' required />
      <input type='password' name='password' placeholder='Password' required />
      <input type='submit' />
    </form>
    <a href='/login'>Login</a>
    `)

})

app.post('/login',redirectHome, (req, res) => {
  const { email, password} = req.body

  if (email && password){
    const user = users.find(user => user.email === email && user.password === password)
    if (user) {
      req.session.userId = user.id
      return res.redirect('/home')

    }
  }

  res.redirect('/login')
})

app.post('/register',redirectHome , (req, res) => {
  const { name , email, password} = req.body

  if (name && email && password){
    const exists = users.some(
      user => user.email === email
    )

      if (!exists) {
        const user = {
          id: users.length +1,
          name,
          email,
          password
        }

        users.push(user)
        req.session.userId = user.id
        return res.redirect('/home')
      }
    
  }
  res.redirect('/register')

})

app.post('/logout', redirectLogin,(req, res) => {
  req.session.destroy(err => {
    if (err){
      return res.redirect('/home')
  }
  res.clearCookie(SESS_NAME)
  res.redirect('/login')
  })
})

app.listen(PORT, () => console.log(
  `http://localhost:${PORT}`
))


module.exports = app;
