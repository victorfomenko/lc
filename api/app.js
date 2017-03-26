'use strict';

const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const feathers = require('feathers');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const passport = require('passport');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const authentication = require('./authentication');

const db = require('./mysql');

const app = feathers();

// Load app configuration
process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');
app.configure(require('feathers-configuration')());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// its need for authorize by cookie
app.use(cookieParser())

// Set up Plugins and providers
app.configure(hooks());
app.configure(db);
app.configure(rest());

app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

module.exports = app;
