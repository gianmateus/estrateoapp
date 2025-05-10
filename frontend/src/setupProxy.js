module.exports = function(app) {
  // Configuração para o desenvolvimento
  process.env.DANGEROUSLY_DISABLE_HOST_CHECK = 'true';
  process.env.HOST = '0.0.0.0';
  
  app.use((req, res, next) => {
    next();
  });
}; 