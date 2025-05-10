module.exports = function override(config, env) {
  // Adicionando configuração personalizada para o servidor de desenvolvimento
  config.devServer = {
    ...config.devServer,
    allowedHosts: ['localhost', '.localhost', '127.0.0.1', '*'],
  };
  
  // Resolver problema de importações ESM fully specified
  config.module = {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  };
  
  // Adicionar resolução para importações sem extensão
  config.resolve = {
    ...config.resolve,
    fullySpecified: false,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  };
  
  return config;
}; 