// Arquivo de exportação de middlewares
// Os middlewares específicos serão implementados posteriormente

import authMiddleware from './authMiddleware';
import permissionMiddleware from './permissionMiddleware';
import { limiter, authLimiter } from './rateLimiter';

export { 
  authMiddleware, 
  permissionMiddleware,
  limiter,
  authLimiter
}; 