module.exports = function override(config, env) {
  // Adicionando configuração personalizada para o servidor de desenvolvimento
  config.devServer = {
    ...config.devServer,
    allowedHosts: ['localhost', '.localhost', '127.0.0.1', '*'],
  };
  
  return config;
}; 