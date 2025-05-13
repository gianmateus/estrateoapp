import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/contador.css'; // Importando os estilos do contador
import App from './App';
import reportWebVitals from './reportWebVitals';

// Importar configuração do i18n (deve ser importado antes de qualquer componente que use tradução)
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();