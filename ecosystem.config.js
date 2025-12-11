// PM2 Ecosystem Configuration for Multiple Applications
// Supports deploying multiple applications on one EC2 instance

const appsConfig = require('./apps.config.json');

function createPM2Config() {
  const apps = [];
  
  appsConfig.apps.forEach(app => {
    if (app.backend) {
      apps.push({
        name: `${app.name}-backend`,
        script: `./${app.backend.script}`,
        cwd: `${app.directory}/${app.backend.directory}`,
        instances: 1,
        exec_mode: 'fork',
        env: {
          NODE_ENV: 'production',
          PORT: app.backend.port
        },
        error_file: `${app.directory}/logs/backend-error.log`,
        out_file: `${app.directory}/logs/backend-out.log`,
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        node_args: '--max-old-space-size=1024'
      });
    }
  });
  
  return { apps };
}

module.exports = createPM2Config();
