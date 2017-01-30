// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)

'use strict';

var sass = require('./sass');

module.exports = {
  webpack: (config, {dev}) => {
    // Perform customizations to config

    sass(dev);

    // Important: return the modified config
    return config
  }
};

