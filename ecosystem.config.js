module.exports = {
  apps: [
    {
      name: 'zongjing-api',
      cwd: '/home/ubuntu/zongjing-api',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      out_file: '/home/ubuntu/.pm2/logs/zongjing-api-out.log',
      error_file: '/home/ubuntu/.pm2/logs/zongjing-api-error.log',
      merge_logs: true,
    },
  ],
};
