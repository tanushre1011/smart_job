const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const resumeRoutes = require('./routes/resumes');
const applicationRoutes = require('./routes/applications');
const matchRoutes = require('./routes/match');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/match', matchRoutes);

app.use(errorHandler);

module.exports = app;
