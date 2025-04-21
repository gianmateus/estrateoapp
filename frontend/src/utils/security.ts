/**
 * Utilitários de segurança para o sistema de gestão de restaurante
 * Security utilities for the restaurant management system
 */

// Constantes para configuração de segurança | Constants for security configuration
const PBKDF2_ITERATIONS = 100000; // Número de iterações para o algoritmo PBKDF2 | Number of iterations for PBKDF2 algorithm
const HASH_LENGTH = 32; // Tamanho do hash em bytes | Hash length in bytes
const SALT_LENGTH = 16; // Tamanho do salt em bytes | Salt length in bytes
const ENCRYPTION_ALGORITHM = 'AES-GCM'; // Algoritmo de criptografia seguro | Secure encryption algorithm
const IV_LENGTH = 12; // Tamanho do vetor de inicialização para AES-GCM | Initialization vector length for AES-GCM
const AUTH_TAG_LENGTH = 128; // Tamanho do tag de autenticação em bits | Authentication tag length in bits

/**
 * Gera uma chave de criptografia a partir de uma senha
 * Generates an encryption key from a password
 * 
 * @param password Senha para derivar a chave | Password to derive the key
 * @returns Promessa que resolve para a chave criptográfica | Promise that resolves to the cryptographic key
 */
export const deriveEncryptionKey = async (password: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Importar a senha como chave | Import password as key
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Gerar salt fixo baseado no nome da aplicação | Generate fixed salt based on app name
  // Em produção, este salt deveria ser armazenado de forma segura | In production, this salt should be securely stored
  const appSalt = encoder.encode('RestauranteGestaoApp');
  
  // Derivar uma chave AES a partir da senha | Derive an AES key from the password
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: appSalt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    baseKey,
    { name: ENCRYPTION_ALGORITHM, length: 256 },
    false, // não extraível | not extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * Criptografa dados sensíveis
 * Encrypts sensitive data
 * 
 * @param data Dados a serem criptografados | Data to be encrypted
 * @param password Senha para criptografia | Password for encryption
 * @returns Promessa que resolve para os dados criptografados em formato base64 | Promise that resolves to encrypted data in base64 format
 */
export const encryptData = async (data: string, password: string): Promise<string> => {
  try {
    // Obter chave de criptografia | Get encryption key
    const key = await deriveEncryptionKey(password);
    
    // Gerar vetor de inicialização aleatório | Generate random initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Converter dados para formato binário | Convert data to binary format
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Criptografar os dados | Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
        tagLength: AUTH_TAG_LENGTH
      },
      key,
      dataBuffer
    );
    
    // Combinar IV e dados criptografados | Combine IV and encrypted data
    const result = new Uint8Array(IV_LENGTH + encryptedBuffer.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedBuffer), IV_LENGTH);
    
    // Converter para base64 para armazenamento | Convert to base64 for storage
    return btoa(Array.from(result).map(byte => String.fromCharCode(byte)).join(''));
  } catch (error) {
    console.error('Erro ao criptografar dados:', error);
    throw new Error('Falha ao criptografar dados');
  }
};

/**
 * Descriptografa dados sensíveis
 * Decrypts sensitive data
 * 
 * @param encryptedData Dados criptografados em formato base64 | Encrypted data in base64 format
 * @param password Senha para descriptografia | Password for decryption
 * @returns Promessa que resolve para os dados descriptografados | Promise that resolves to decrypted data
 */
export const decryptData = async (encryptedData: string, password: string): Promise<string> => {
  try {
    // Obter chave de criptografia | Get encryption key
    const key = await deriveEncryptionKey(password);
    
    // Decodificar dados criptografados | Decode encrypted data
    const encryptedBuffer = new Uint8Array([...atob(encryptedData)].map(c => c.charCodeAt(0)));
    
    // Extrair IV e dados criptografados | Extract IV and encrypted data
    const iv = encryptedBuffer.slice(0, IV_LENGTH);
    const ciphertext = encryptedBuffer.slice(IV_LENGTH);
    
    // Descriptografar os dados | Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
        tagLength: AUTH_TAG_LENGTH
      },
      key,
      ciphertext
    );
    
    // Converter de volta para string | Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Erro ao descriptografar dados:', error);
    throw new Error('Falha ao descriptografar dados. Senha incorreta ou dados corrompidos.');
  }
};

/**
 * Gera um hash seguro para senha usando PBKDF2
 * Generates a secure password hash using PBKDF2
 * 
 * @param password Senha a ser hasheada | Password to be hashed
 * @returns Promessa que resolve para o hash no formato base64 | Promise that resolves to the hash in base64 format
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Converter a senha para um formato que o crypto API possa usar | Convert password to a format that the crypto API can use
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Gerar um salt aleatório | Generate a random salt
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  
  // Importar a chave da senha | Import the password key
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derivar bits usando PBKDF2 | Derive bits using PBKDF2
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    passwordKey,
    HASH_LENGTH * 8 // Converter bytes para bits | Convert bytes to bits
  );
  
  // Combinar salt e hash derivado | Combine salt and derived hash
  const hashArray = new Uint8Array(SALT_LENGTH + HASH_LENGTH);
  hashArray.set(salt, 0);
  hashArray.set(new Uint8Array(derivedBits), SALT_LENGTH);
  
  // Converter para base64 para armazenamento | Convert to base64 for storage
  return btoa(Array.from(hashArray).map(byte => String.fromCharCode(byte)).join(''));
};

/**
 * Verifica se uma senha corresponde a um hash armazenado
 * Verifies if a password matches a stored hash
 * 
 * @param password Senha a ser verificada | Password to be verified
 * @param storedHash Hash armazenado (incluindo salt) | Stored hash (including salt)
 * @returns Promessa que resolve para um booleano indicando se a senha é válida | Promise that resolves to a boolean indicating if the password is valid
 */
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  try {
    // Decodificar o hash armazenado | Decode the stored hash
    const hashBuffer = new Uint8Array([...atob(storedHash)].map(c => c.charCodeAt(0)));
    
    // Extrair o salt (primeiros SALT_LENGTH bytes) | Extract the salt (first SALT_LENGTH bytes)
    const salt = hashBuffer.slice(0, SALT_LENGTH);
    
    // Extrair o hash armazenado | Extract the stored hash
    const originalHash = hashBuffer.slice(SALT_LENGTH);
    
    // Converter a senha para um formato que o crypto API possa usar | Convert the password to a format that the crypto API can use
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Importar a chave da senha | Import the password key
    const passwordKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    // Derivar bits usando PBKDF2 com o mesmo salt | Derive bits using PBKDF2 with the same salt
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      passwordKey,
      HASH_LENGTH * 8 // Converter bytes para bits | Convert bytes to bits
    );
    
    // Comparar os hashes em tempo constante | Compare hashes in constant time
    const derivedHash = new Uint8Array(derivedBits);
    
    if (derivedHash.length !== originalHash.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < derivedHash.length; i++) {
      result |= derivedHash[i] ^ originalHash[i];
    }
    
    return result === 0;
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
};

/**
 * Sanitiza uma string para prevenir ataques XSS
 * Sanitizes a string to prevent XSS attacks
 * 
 * @param input String a ser sanitizada | String to be sanitized
 * @param allowHtml Se verdadeiro, permite tags HTML seguras | If true, allows safe HTML tags
 * @returns String sanitizada | Sanitized string
 */
export const sanitizeInput = (input: string, allowHtml: boolean = false): string => {
  if (!input) return '';
  
  if (!allowHtml) {
    // Sanitização completa - remove todas as tags HTML | Complete sanitization - removes all HTML tags
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#x60;')
      .replace(/\\/, '&#x5C;'); // Adiciona proteção contra barras invertidas | Adds protection against backslashes
  } else {
    // Sanitização seletiva - permite algumas tags HTML seguras | Selective sanitization - allows some safe HTML tags
    // Remove scripts e atributos perigosos, mas mantém formatação básica | Removes scripts and dangerous attributes, but maintains basic formatting
    return input
      // Remove tags de script completamente | Completely removes script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove atributos perigosos | Removes dangerous attributes
      .replace(/on\w+\s*=\s*["']?[^"']*["']?/gi, '')
      .replace(/javascript\s*:/gi, 'removed:')
      .replace(/data\s*:/gi, 'removed:')
      // Sanitiza atributos src e href | Sanitizes src and href attributes
      .replace(/src\s*=\s*["']([^"']*)["']/gi, (match, url) => {
        if (/^(https?:\/\/|\/)/.test(url)) {
          return match; // Mantém URLs absolutas ou relativas à raiz | Keeps absolute or root-relative URLs
        }
        return 'src="#"'; // Remove URLs potencialmente perigosas | Removes potentially dangerous URLs
      })
      .replace(/href\s*=\s*["']([^"']*)["']/gi, (match, url) => {
        if (/^(https?:\/\/|\/|mailto:|tel:)/.test(url)) {
          return match; // Mantém URLs seguras | Keeps safe URLs
        }
        return 'href="#"'; // Remove URLs potencialmente perigosas | Removes potentially dangerous URLs
      });
  }
};

/**
 * Sanitiza valores para uso seguro em atributos HTML
 * Sanitizes values for safe use in HTML attributes
 * 
 * @param value Valor a ser sanitizado | Value to be sanitized
 * @returns String sanitizada para uso em atributos | Sanitized string for use in attributes
 */
export const sanitizeAttribute = (value: string): string => {
  if (!value) return '';
  
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Sanitiza valores para uso seguro em URLs
 * Sanitizes values for safe use in URLs
 * 
 * @param url URL a ser sanitizada | URL to be sanitized
 * @returns URL sanitizada | Sanitized URL
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '#';
  
  // Verificar se a URL é segura | Verify if the URL is safe
  const urlPattern = /^(?:(?:https?|mailto|tel|ftp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;
  if (!urlPattern.test(url)) {
    return '#'; // URL não segura | URL is not safe
  }
  
  // Verificar se contém javascript: ou data: | Verify if it contains javascript: or data:
  if (/javascript:|data:/i.test(url)) {
    return '#';
  }
  
  return url;
};

/**
 * Sanitiza HTML para exibição segura
 * Sanitizes HTML for safe display
 * 
 * @param html HTML a ser sanitizado | HTML to be sanitized
 * @returns HTML sanitizado | Sanitized HTML
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Lista de tags permitidas | Allowed tags list
  const allowedTags = ['a', 'b', 'br', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                      'i', 'li', 'ol', 'p', 'span', 'strong', 'table', 'tbody', 'td', 
                      'th', 'thead', 'tr', 'ul'];
  
  // Lista de atributos permitidos | Allowed attributes list
  const allowedAttrs = ['href', 'target', 'title', 'class', 'id', 'style'];
  
  // Criar um elemento temporário | Create a temporary element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Função recursiva para limpar nós | Recursive function to clean nodes
  const cleanNode = (node: Node): void => {
    // Remover nós de comentário | Remove comment nodes
    if (node.nodeType === Node.COMMENT_NODE) {
      node.parentNode?.removeChild(node);
      return;
    }
    
    // Processar elementos | Process elements
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      
      // Remover tags não permitidas | Remove disallowed tags
      if (!allowedTags.includes(tagName)) {
        // Substituir por seu conteúdo | Substitute with its content
        while (element.firstChild) {
          element.parentNode?.insertBefore(element.firstChild, element);
        }
        element.parentNode?.removeChild(element);
        return;
      }
      
      // Remover atributos não permitidos | Remove disallowed attributes
      Array.from(element.attributes).forEach(attr => {
        if (!allowedAttrs.includes(attr.name)) {
          element.removeAttribute(attr.name);
        } else if (attr.name === 'href' || attr.name === 'src') {
          // Sanitizar URLs | Sanitize URLs
          element.setAttribute(attr.name, sanitizeUrl(attr.value));
        } else {
          // Sanitizar outros atributos | Sanitize other attributes
          element.setAttribute(attr.name, sanitizeAttribute(attr.value));
        }
      });
    }
    
    // Processar filhos recursivamente | Process child nodes recursively
    Array.from(node.childNodes).forEach(cleanNode);
  };
  
  // Limpar o HTML | Clean the HTML
  cleanNode(tempDiv);
  
  return tempDiv.innerHTML;
};

/**
 * Valida um email
 * Validates an email
 * 
 * @param email Email a ser validado | Email to be validated
 * @returns Booleano indicando se o email é válido | Boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (!email || email.length > 254) return false; // Limite máximo de caracteres para email | Maximum character limit for email
  
  // Expressão regular mais precisa para validação de email | More precise regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Lista de senhas comuns que devem ser evitadas
 * List of common passwords that should be avoided
 */
const COMMON_PASSWORDS = [
  'password', 'senha123', '123456', 'admin123', 'qwerty', '12345678', 'abc123', 'senha1234',
  'admin', 'welcome', 'p@ssw0rd', 'senha', 'admin1', 'administrador', '123mudar'
];

/**
 * Verifica a força de uma senha
 * Checks the strength of a password
 * 
 * @param password Senha a ser verificada | Password to be verified
 * @returns Objeto com resultado da validação e mensagem | Object with validation result and message
 */
export const checkPasswordStrength = (password: string): { isStrong: boolean; message: string } => {
  // Verificar comprimento mínimo (aumentado para 10 caracteres) | Verify minimum length (increased to 10 characters)
  if (password.length < 10) {
    return { isStrong: false, message: 'A senha deve ter pelo menos 10 caracteres' };
  }
  
  // Verificar letras maiúsculas | Verify uppercase letters
  if (!/[A-Z]/.test(password)) {
    return { isStrong: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
  }
  
  // Verificar letras minúsculas | Verify lowercase letters
  if (!/[a-z]/.test(password)) {
    return { isStrong: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
  }
  
  // Verificar números | Verify numbers
  if (!/[0-9]/.test(password)) {
    return { isStrong: false, message: 'A senha deve conter pelo menos um número' };
  }
  
  // Verificar caracteres especiais (expandido) | Verify special characters (expanded)
  if (!/[!@#$%^&*()\-_=+\[\]{}|;:'",.<>/?`~]/.test(password)) {
    return { isStrong: false, message: 'A senha deve conter pelo menos um caractere especial' };
  }
  
  // Verificar se a senha é comum | Verify if the password is common
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    return { isStrong: false, message: 'Esta senha é muito comum e fácil de adivinhar' };
  }
  
  // Verificar sequências óbvias | Verify obvious sequences
  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    return { isStrong: false, message: 'A senha não deve conter sequências óbvias' };
  }
  
  // Calcular pontuação de entropia | Calculate password entropy score
  const entropy = calculatePasswordEntropy(password);
  if (entropy < 60) {
    return { isStrong: false, message: 'A senha não é suficientemente complexa' };
  }
  
  return { isStrong: true, message: 'Senha forte' };
};

/**
 * Calcula a entropia de uma senha (medida de aleatoriedade)
 * Calculates password entropy (measure of randomness)
 * 
 * @param password Senha a ser analisada | Password to be analyzed
 * @returns Valor de entropia | Entropy value
 */
const calculatePasswordEntropy = (password: string): number => {
  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 33;
  
  return Math.log2(Math.pow(charset, password.length));
};

/**
 * Gera um token de sessão seguro
 * Generates a secure session token
 * 
 * @param byteLength Tamanho do token em bytes (padrão: 32 bytes = 256 bits) | Token length in bytes (default: 32 bytes = 256 bits)
 * @returns Token de sessão | Session token
 */
export const generateSessionToken = (byteLength: number = 32): string => {
  // Verificar se o tamanho é válido | Verify if the length is valid
  if (byteLength < 16) {
    console.warn('Tamanho de token muito pequeno. Usando valor mínimo de 16 bytes.');
    byteLength = 16; // Mínimo de 128 bits para segurança adequada | Minimum of 128 bits for adequate security
  }
  
  // Usar randomUUID quando disponível (mais seguro) | Use randomUUID when available (more secure)
  if (window.crypto && 'randomUUID' in window.crypto) {
    // Para tokens maiores, concatenar múltiplos UUIDs | For larger tokens, concatenate multiple UUIDs
    if (byteLength <= 16) { // Um UUID tem 16 bytes | One UUID has 16 bytes
      return (window.crypto as any).randomUUID().replace(/-/g, '');
    } else {
      const uuidsNeeded = Math.ceil(byteLength / 16);
      let token = '';
      for (let i = 0; i < uuidsNeeded; i++) {
        token += (window.crypto as any).randomUUID().replace(/-/g, '');
      }
      return token.substring(0, byteLength * 2); // *2 porque cada byte são 2 caracteres hex
    }
  }
  
  // Fallback para navegadores que não suportam randomUUID
  const randomBytes = new Uint8Array(byteLength);
  if (window.crypto) {
    (window.crypto as Crypto).getRandomValues(randomBytes);
  } else {
    // Fallback simples se crypto não estiver disponível
    for (let i = 0; i < byteLength; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Valida um valor numérico
 * @param value Valor a ser validado
 * @param min Valor mínimo permitido
 * @param max Valor máximo permitido
 * @returns Booleano indicando se o valor é válido
 */
export const validateNumericValue = (value: number, min?: number, max?: number): boolean => {
  if (isNaN(value)) return false;
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
};

/**
 * Valida uma data
 * @param date Data a ser validada
 * @returns Booleano indicando se a data é válida
 */
export const validateDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Limita a taxa de chamadas de uma função
 * @param fn Função a ser limitada
 * @param delay Tempo de espera em ms
 * @returns Função com limitação de taxa
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Verifica se uma string contém código JavaScript malicioso
 * @param input String a ser verificada
 * @param strictMode Se verdadeiro, aplica verificações mais rigorosas
 * @returns Booleano indicando se a string contém código malicioso
 */
export const containsMaliciousCode = (input: string, strictMode: boolean = false): boolean => {
  if (!input) return false;
  
  // Normalizar a entrada para detectar tentativas de ofuscação
  const normalizedInput = input
    .toLowerCase()
    .replace(/\s+/g, '') // Remover espaços
    .replace(/[\\\n\r]/g, '') // Remover caracteres de escape e quebras de linha
    .replace(/&(?:[a-z\d]+|#\d+|#x[a-f\d]+);/gi, ''); // Decodificar entidades HTML básicas
  
  // Padrões de alto risco (sempre verificados)
  const highRiskPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/i,
    /javascript\s*:/i,
    /data\s*:\s*text\/html/i,
    /data\s*:\s*application\/javascript/i,
    /\bon\w+\s*=\s*["']?[^"']*["']?/i, // Eventos inline (onclick, onload, etc)
    /\beval\s*\([^)]*\)/i,
    /\bFunction\s*\(/i,
    /\bsetTimeout\s*\(/i,
    /\bsetInterval\s*\(/i,
    /\bnew\s+Function\s*\(/i,
    /\bdocument\.write\s*\(/i,
    /\bdocument\.writeln\s*\(/i,
    /\bwindow\.location\s*=/i,
    /\bdocument\.location\s*=/i,
    /\blocation\.href\s*=/i,
    /\blocation\.replace\s*\(/i,
    /\blocation\.assign\s*\(/i,
    /\bdocument\.cookie/i,
    /\bdocument\.domain\s*=/i,
    /\bdocument\.implementation\.createHTMLDocument/i,
    /\bdocument\.createRange\(\)\.createContextualFragment/i,
    /\bObject\.assign\s*\(\s*document/i,
    /\bimport\s*\(/i,
    /\brequire\s*\(/i,
    /\bexec\s*\(/i,
    /\bchild_process/i,
    /\bshell\s*:/i,
  ];
  
  // Padrões de médio risco (verificados apenas em modo estrito)
  const mediumRiskPatterns = strictMode ? [
    /\blocalStorage\s*\./i,
    /\bsessionStorage\s*\./i,
    /\bindexedDB\s*\./i,
    /\bnavigator\.sendBeacon/i,
    /\bfetch\s*\(/i,
    /\bXMLHttpRequest/i,
    /\bajax\s*\(/i,
    /\b\$\.(?:get|post|ajax)\s*\(/i,
    /\bwindow\.open\s*\(/i,
    /\bdocument\.referrer/i,
    /\bdocument\.forms/i,
    /\bdocument\.body\.innerHTML/i,
    /\bdocument\.body\.outerHTML/i,
    /\bdocument\.body\.insertAdjacentHTML/i,
    /\bdocument\.getElementById\s*\([^)]*\)\.innerHTML\s*=/i,
    /\bdocument\.querySelector\s*\([^)]*\)\.innerHTML\s*=/i,
    /\bdocument\.createElement\s*\(\s*['"]script['"]\s*\)/i,
    /\bObject\.defineProperty\s*\(/i,
    /\bObject\.prototype/i,
    /\b__proto__/i,
    /\bparent\s*\./i,
    /\btop\s*\./i,
    /\bself\s*\./i,
    /\bthis\s*\[/i,
    /\bwith\s*\(/i,
    /\bvoid\s*\(/i,
    /\bunescape\s*\(/i,
    /\bdecodeURI\s*\(/i,
    /\bdecodeURIComponent\s*\(/i,
    /\batob\s*\(/i,
    /\bblob:/i,
    /\bjavascript:/i,
    /\bvbscript:/i,
  ] : [];
  
  // Verificar padrões de alto risco
  if (highRiskPatterns.some(pattern => pattern.test(input) || pattern.test(normalizedInput))) {
    return true;
  }
  
  // Verificar padrões de médio risco (apenas em modo estrito)
  if (mediumRiskPatterns.some(pattern => pattern.test(input) || pattern.test(normalizedInput))) {
    return true;
  }
  
  // Verificar caracteres suspeitos em sequência (possível ofuscação)
  if (strictMode && /(?:\\x[\da-f]{2}|\\u[\da-f]{4}){3,}/i.test(input)) {
    return true;
  }
  
  return false;
};

/**
 * Gera um ID seguro para uso em elementos do DOM
 * @param prefix Prefixo para o ID
 * @returns ID seguro
 */
export const generateSecureId = (prefix: string = 'id'): string => {
  // Usar crypto.randomUUID() para maior segurança quando disponível
  if (window.crypto && 'randomUUID' in window.crypto) {
    return `${prefix}-${(window.crypto as any).randomUUID().substring(0, 8)}`;
  }
  
  // Fallback para navegadores que não suportam randomUUID
  const randomBytes = new Uint8Array(8);
  if (window.crypto) {
    (window.crypto as Crypto).getRandomValues(randomBytes);
  } else {
    // Fallback simples se crypto não estiver disponível
    for (let i = 0; i < 8; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const randomId = Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  
  return `${prefix}-${randomId}`;
};

/**
 * Configuração para proteção CSRF
 */
interface CSRFConfig {
  tokenName: string;
  headerName: string;
  cookieName: string;
  expiry: number; // em segundos
}

const csrfConfig: CSRFConfig = {
  tokenName: 'csrf_token',
  headerName: 'X-CSRF-Token',
  cookieName: 'csrf_cookie',
  expiry: 3600 // 1 hora
};

/**
 * Gera um token CSRF para proteger formulários
 * @param useDoubleSubmitCookie Se verdadeiro, também armazena o token em um cookie
 * @returns Token CSRF
 */
export const generateCSRFToken = (useDoubleSubmitCookie: boolean = true): string => {
  // Usar UUID quando disponível para maior segurança
  let token: string;
  if (window.crypto && 'randomUUID' in window.crypto) {
    token = (window.crypto as any).randomUUID();
  } else {
    // Fallback para navegadores que não suportam randomUUID
    const randomBytes = new Uint8Array(32);
    if (window.crypto) {
      (window.crypto as Crypto).getRandomValues(randomBytes);
    } else {
      // Fallback simples se crypto não estiver disponível
      for (let i = 0; i < 32; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
      }
    }
    token = Array.from(randomBytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
  
  // Armazenar o token na sessionStorage
  sessionStorage.setItem(csrfConfig.tokenName, token);
  
  // Armazenar timestamp de expiração
  const expiryTime = Date.now() + (csrfConfig.expiry * 1000);
  sessionStorage.setItem(`${csrfConfig.tokenName}_expiry`, expiryTime.toString());
  
  // Opcionalmente armazenar em cookie para padrão de double-submit
  if (useDoubleSubmitCookie) {
    const secureFlag = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${csrfConfig.cookieName}=${token}; path=/; samesite=strict${secureFlag}; max-age=${csrfConfig.expiry}`;
  }
  
  return token;
};

/**
 * Verifica se um token CSRF é válido usando comparação de tempo constante
 * @param token Token CSRF a ser verificado
 * @param checkCookie Se verdadeiro, também verifica o cookie (padrão double-submit)
 * @param checkOrigin Se verdadeiro, verifica a origem da requisição
 * @returns Booleano indicando se o token é válido
 */
export const validateCSRFToken = (
  token: string, 
  checkCookie: boolean = true,
  checkOrigin: boolean = true
): boolean => {
  // Verificar se o token existe
  const storedToken = sessionStorage.getItem(csrfConfig.tokenName);
  if (!storedToken || !token) return false;
  
  // Verificar expiração
  const expiryTimeStr = sessionStorage.getItem(`${csrfConfig.tokenName}_expiry`);
  if (expiryTimeStr) {
    const expiryTime = parseInt(expiryTimeStr, 10);
    if (Date.now() > expiryTime) {
      // Token expirado, gerar um novo
      generateCSRFToken();
      return false;
    }
  }
  
  // Verificar origem se solicitado
  if (checkOrigin) {
    const origin = document.location.origin;
    const referer = document.referrer;
    
    if (referer && !referer.startsWith(origin)) {
      console.warn('CSRF validation failed: Origin mismatch');
      return false;
    }
  }
  
  // Verificar cookie se solicitado (padrão double-submit)
  if (checkCookie) {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${csrfConfig.cookieName}=`))
      ?.split('=')[1];
    
    if (!cookieValue || cookieValue !== token) {
      console.warn('CSRF validation failed: Cookie mismatch');
      return false;
    }
  }
  
  // Implementação robusta de comparação em tempo constante
  const maxLength = Math.max(storedToken.length, token.length);
  let result = storedToken.length !== token.length ? 1 : 0; // Diferença de comprimento já indica falha
  
  for (let i = 0; i < maxLength; i++) {
    // Usar 0 para índices fora dos limites
    const storedChar = i < storedToken.length ? storedToken.charCodeAt(i) : 0;
    const tokenChar = i < token.length ? token.charCodeAt(i) : 0;
    
    // Operação XOR para comparação bit a bit
    result |= storedChar ^ tokenChar;
  }
  
  // Adicionar um pequeno atraso aleatório para dificultar ainda mais ataques de timing
  const randomDelay = Math.floor(Math.random() * 10);
  const startTime = Date.now();
  while (Date.now() - startTime < randomDelay) {
    // Espera ativa para criar um pequeno atraso
  }
  
  return result === 0;
};

/**
 * Adiciona cabeçalho CSRF a uma requisição fetch
 * @param options Opções do fetch
 * @returns Opções atualizadas com o cabeçalho CSRF
 */
export const addCSRFHeader = (options: RequestInit = {}): RequestInit => {
  const token = sessionStorage.getItem(csrfConfig.tokenName);
  if (!token) {
    // Gerar um novo token se não existir
    const newToken = generateCSRFToken();
    
    // Inicializar headers se não existirem
    if (!options.headers) {
      options.headers = {};
    }
    
    // Adicionar o cabeçalho CSRF
    (options.headers as Record<string, string>)[csrfConfig.headerName] = newToken;
  } else {
    // Inicializar headers se não existirem
    if (!options.headers) {
      options.headers = {};
    }
    
    // Adicionar o cabeçalho CSRF
    (options.headers as Record<string, string>)[csrfConfig.headerName] = token;
  }
  
  return options;
};

/**
 * Verifica se a sessão do usuário expirou
 * @param expirationMinutes Tempo de expiração em minutos
 * @returns Booleano indicando se a sessão expirou
 */
export const isSessionExpired = (expirationMinutes: number = 60): boolean => {
  const timestamp = sessionStorage.getItem('auth_timestamp');
  if (!timestamp) return true;
  
  // Verificar também se o cookie de autenticação existe
  const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('auth_session='));
  if (!hasCookie) return true;
  
  const loginTime = parseInt(timestamp, 10);
  const currentTime = Date.now();
  const elapsedMinutes = (currentTime - loginTime) / (1000 * 60);
  
  return elapsedMinutes > expirationMinutes;
};

/**
 * Implementa proteção contra ataques de força bruta com bloqueio progressivo
 */
export class BruteForceProtection {
  // Armazenamento de tentativas em memória
  private static attempts: Record<string, { 
    count: number, 
    timestamp: number,
    ipAddresses?: Set<string>,
    consecutiveFailures: number
  }> = {};
  
  // Configurações de segurança
  private static readonly INITIAL_MAX_ATTEMPTS = 5; // Tentativas iniciais permitidas
  private static readonly INITIAL_LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos em ms
  private static readonly MAX_LOCKOUT_TIME = 24 * 60 * 60 * 1000; // 24 horas em ms
  private static readonly LOCKOUT_MULTIPLIER = 2; // Fator de multiplicação para bloqueios consecutivos
  private static readonly ATTEMPT_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 dias em ms
  
  /**
   * Inicializa o sistema de proteção carregando dados do sessionStorage
   */
  public static initialize(): void {
    try {
      const storedAttempts = sessionStorage.getItem('bruteforce_protection');
      if (storedAttempts) {
        const parsed = JSON.parse(storedAttempts);
        
        // Converter objetos de volta para o formato correto
        Object.keys(parsed).forEach(key => {
          if (parsed[key].ipAddresses) {
            parsed[key].ipAddresses = new Set(parsed[key].ipAddresses);
          }
        });
        
        this.attempts = parsed;
        
        // Limpar tentativas expiradas
        this.cleanupExpiredAttempts();
      }
    } catch (error) {
      console.error('Erro ao carregar dados de proteção contra força bruta:', error);
      // Em caso de erro, reiniciar o armazenamento
      this.attempts = {};
    }
  }
  
  /**
   * Salva o estado atual no sessionStorage
   */
  private static persistState(): void {
    try {
      // Converter Sets para arrays antes de serializar
      const dataToStore = Object.entries(this.attempts).reduce((acc, [key, value]) => {
        acc[key] = {
          ...value,
          ipAddresses: value.ipAddresses ? Array.from(value.ipAddresses) : undefined
        };
        return acc;
      }, {} as Record<string, any>);
      
      sessionStorage.setItem('bruteforce_protection', JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Erro ao persistir dados de proteção contra força bruta:', error);
    }
  }
  
  /**
   * Remove tentativas expiradas do armazenamento
   */
  private static cleanupExpiredAttempts(): void {
    const now = Date.now();
    let changed = false;
    
    Object.keys(this.attempts).forEach(id => {
      const attempt = this.attempts[id];
      if (now - attempt.timestamp > this.ATTEMPT_EXPIRY) {
        delete this.attempts[id];
        changed = true;
      }
    });
    
    if (changed) {
      this.persistState();
    }
  }
  
  /**
   * Calcula o tempo de bloqueio com base no número de falhas consecutivas
   * @param consecutiveFailures Número de falhas consecutivas
   * @returns Tempo de bloqueio em ms
   */
  private static calculateLockoutTime(consecutiveFailures: number): number {
    // Aumenta exponencialmente o tempo de bloqueio até o máximo definido
    const lockoutTime = this.INITIAL_LOCKOUT_TIME * Math.pow(this.LOCKOUT_MULTIPLIER, consecutiveFailures - 1);
    return Math.min(lockoutTime, this.MAX_LOCKOUT_TIME);
  }
  
  /**
   * Registra uma tentativa de login
   * @param identifier Identificador único (geralmente email)
   * @param ipAddress Endereço IP opcional para rastreamento adicional
   * @returns Objeto com informações sobre o bloqueio
   */
  public static registerAttempt(identifier: string, ipAddress?: string): { 
    blocked: boolean, 
    remainingTime: number,
    attemptsRemaining: number
  } {
    // Inicializar se necessário
    if (Object.keys(this.attempts).length === 0) {
      this.initialize();
    }
    
    const normalizedId = identifier.toLowerCase().trim();
    const now = Date.now();
    
    // Limpar tentativas expiradas periodicamente
    if (Math.random() < 0.1) { // 10% de chance de limpar a cada chamada
      this.cleanupExpiredAttempts();
    }
    
    // Verificar se o usuário já tem tentativas registradas
    if (this.attempts[normalizedId]) {
      const attempt = this.attempts[normalizedId];
      
      // Adicionar IP à lista se fornecido
      if (ipAddress && !attempt.ipAddresses) {
        attempt.ipAddresses = new Set<string>();
      }
      if (ipAddress && attempt.ipAddresses) {
        attempt.ipAddresses.add(ipAddress);
      }
      
      // Calcular tempo de bloqueio com base em falhas consecutivas
      const currentLockoutTime = this.calculateLockoutTime(attempt.consecutiveFailures);
      
      // Verificar se o tempo de bloqueio já passou
      if (attempt.count >= this.INITIAL_MAX_ATTEMPTS) {
        const elapsedTime = now - attempt.timestamp;
        if (elapsedTime < currentLockoutTime) {
          return { 
            blocked: true, 
            remainingTime: Math.ceil((currentLockoutTime - elapsedTime) / 1000),
            attemptsRemaining: 0
          };
        } else {
          // Incrementar falhas consecutivas após o tempo de bloqueio
          this.attempts[normalizedId] = { 
            count: 1, 
            timestamp: now,
            ipAddresses: attempt.ipAddresses,
            consecutiveFailures: attempt.consecutiveFailures + 1
          };
          this.persistState();
          return { 
            blocked: false, 
            remainingTime: 0,
            attemptsRemaining: this.INITIAL_MAX_ATTEMPTS - 1
          };
        }
      }
      
      // Incrementar contagem de tentativas
      this.attempts[normalizedId].count += 1;
      this.attempts[normalizedId].timestamp = now;
      
      // Verificar se esta tentativa excedeu o limite
      const isNowBlocked = this.attempts[normalizedId].count >= this.INITIAL_MAX_ATTEMPTS;
      if (isNowBlocked) {
        // Atualizar timestamp para iniciar o período de bloqueio
        this.attempts[normalizedId].timestamp = now;
      }
      
      this.persistState();
      
      return { 
        blocked: isNowBlocked, 
        remainingTime: isNowBlocked ? 
          this.calculateLockoutTime(this.attempts[normalizedId].consecutiveFailures) / 1000 : 0,
        attemptsRemaining: isNowBlocked ? 0 : this.INITIAL_MAX_ATTEMPTS - this.attempts[normalizedId].count
      };
    } else {
      // Primeira tentativa
      this.attempts[normalizedId] = { 
        count: 1, 
        timestamp: now,
        consecutiveFailures: 1,
        ipAddresses: ipAddress ? new Set([ipAddress]) : undefined
      };
      
      this.persistState();
      
      return { 
        blocked: false, 
        remainingTime: 0,
        attemptsRemaining: this.INITIAL_MAX_ATTEMPTS - 1
      };
    }
  }
  
  /**
   * Reseta as tentativas de login para um identificador
   * @param identifier Identificador único (geralmente email)
   */
  public static resetAttempts(identifier: string): void {
    const normalizedId = identifier.toLowerCase().trim();
    delete this.attempts[normalizedId];
    this.persistState();
  }
  
  /**
   * Verifica se um identificador está bloqueado sem registrar uma nova tentativa
   * @param identifier Identificador único (geralmente email)
   * @returns Objeto com informações sobre o bloqueio
   */
  public static isBlocked(identifier: string): { 
    blocked: boolean, 
    remainingTime: number,
    attemptsRemaining: number
  } {
    // Inicializar se necessário
    if (Object.keys(this.attempts).length === 0) {
      this.initialize();
    }
    
    const normalizedId = identifier.toLowerCase().trim();
    const now = Date.now();
    
    if (!this.attempts[normalizedId]) {
      return { blocked: false, remainingTime: 0, attemptsRemaining: this.INITIAL_MAX_ATTEMPTS };
    }
    
    const attempt = this.attempts[normalizedId];
    
    // Verificar se está bloqueado
    if (attempt.count >= this.INITIAL_MAX_ATTEMPTS) {
      const currentLockoutTime = this.calculateLockoutTime(attempt.consecutiveFailures);
      const elapsedTime = now - attempt.timestamp;
      
      if (elapsedTime < currentLockoutTime) {
        return { 
          blocked: true, 
          remainingTime: Math.ceil((currentLockoutTime - elapsedTime) / 1000),
          attemptsRemaining: 0
        };
      }
    }
    
    return { 
      blocked: false, 
      remainingTime: 0,
      attemptsRemaining: this.INITIAL_MAX_ATTEMPTS - attempt.count
    };
  }
  
  /**
   * Obtém estatísticas sobre tentativas de login
   * @returns Estatísticas de tentativas
   */
  public static getStatistics(): {
    totalAttempts: number,
    blockedAccounts: number,
    uniqueIPs: number
  } {
    // Inicializar se necessário
    if (Object.keys(this.attempts).length === 0) {
      this.initialize();
    }
    
    const now = Date.now();
    let totalAttempts = 0;
    let blockedAccounts = 0;
    const uniqueIPs = new Set<string>();
    
    Object.values(this.attempts).forEach(attempt => {
      totalAttempts += attempt.count;
      
      // Verificar se está bloqueado
      if (attempt.count >= this.INITIAL_MAX_ATTEMPTS) {
        const currentLockoutTime = this.calculateLockoutTime(attempt.consecutiveFailures);
        const elapsedTime = now - attempt.timestamp;
        
        if (elapsedTime < currentLockoutTime) {
          blockedAccounts++;
        }
      }
      
      // Adicionar IPs ao conjunto
      if (attempt.ipAddresses) {
        attempt.ipAddresses.forEach(ip => uniqueIPs.add(ip));
      }
    });
    
    return {
      totalAttempts,
      blockedAccounts,
      uniqueIPs: uniqueIPs.size
    };
  }
};