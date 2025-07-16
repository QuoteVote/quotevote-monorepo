module.exports = {
    apps: [
      {
        name: 'HHSB',
        script: 'dist/server.js',
        env: {
          NODE_ENV: process.env.NODE_ENV || 'production',
          SECRET: process.env.SECRET || '',
          LYRICIST_TOKEN: process.env.LYRICIST_TOKEN || '',
          DATABASE_URL: process.env.DATABASE_URL || '',
          SMTP_HOST: process.env.SMTP_HOST || '',
          SMTP_PORT: process.env.SMTP_PORT || '',
          SMTP_USER: process.env.SMTP_USER || '',
          SMTP_PASS: process.env.SMTP_PASS || '',
          FROM_EMAIL: process.env.FROM_EMAIL || '',
          CLIENT_URL: process.env.CLIENT_URL || '',
          REQUEST_ACCESS_URL: process.env.REQUEST_ACCESS_URL || '',
          SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
          SENDGRID_SENDER_EMAIL: process.env.SENDGRID_SENDER_EMAIL
        },
      },
    ],
  };
  