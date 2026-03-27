const express = require('express');
const session = require('express-session');
const securityRoutes = require('./routes/security');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'zero-trust-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use('/api/security', securityRoutes);

app.get('/', (req, res) => {
  res.send('Zero Trust Security Backend Running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Security backend running on port ${PORT}`);
});
