module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'API',
      script: 'api/index.js',
      env: {
        NODE_ENV: 'production',
        SERVER_PORT: 3030,
      }
    },

    // Second application
    {
      name: 'WEB',
      script: 'web.js',
      env: {
        NODE_ENV: 'production',
        SERVER_PORT: 3030,
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'node',
      host: 'host',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && npm run build && pm2 reload pm2.ecosystem.config.js --env production'
    },
    dev: {
      user: 'node',
      host: 'host',
      ref: 'origin/dev',
      repo: 'git@github.com:repo.git',
      path: '/var/www/development',
      'post-deploy': 'npm install && npm run build && pm2 reload pm2.ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'dev'
      }
    }
  }
};
