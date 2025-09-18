import crypto from 'crypto';

// Configurações de segurança
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Para GCM, recomendado 12 bytes, mas 16 é mais comum
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;

// Chave derivada de uma chave master + salt para maior segurança
function getEncryptionKey(salt: Buffer): Buffer {
  const masterKey =
    process.env.ENCRYPTION_MASTER_KEY || 'default-key-change-in-production';
  return crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha512');
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
  salt: string;
}

/**
 * Criptografa uma senha usando AES-256-GCM (reversível)
 */
export function encryptPassword(password: string): EncryptedData {
  try {
    // Gerar salt único para cada operação
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = getEncryptionKey(salt);

    // Gerar IV único para cada operação
    const iv = crypto.randomBytes(IV_LENGTH);

    // Criar cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Criptografar
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Obter tag de autenticação
    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      salt: salt.toString('hex'),
    };
  } catch (error) {
    console.error('Erro ao criptografar senha:', error);
    throw new Error('Falha na criptografia da senha');
  }
}

/**
 * Descriptografa uma senha usando AES-256-GCM
 */
export function decryptPassword(encryptedData: EncryptedData): string {
  try {
    const { encrypted, iv, tag, salt } = encryptedData;

    // Reconstruir chave usando o mesmo salt
    const saltBuffer = Buffer.from(salt, 'hex');
    const key = getEncryptionKey(saltBuffer);

    // Criar decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    // Descriptografar
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Erro ao descriptografar senha:', error);
    throw new Error(
      'Falha na descriptografia da senha - dados corrompidos ou chave incorreta'
    );
  }
}

/**
 * Verifica se uma senha está correta comparando com dados criptografados
 */
export function verifyPassword(
  plainPassword: string,
  encryptedData: EncryptedData
): boolean {
  try {
    const decrypted = decryptPassword(encryptedData);
    return decrypted === plainPassword;
  } catch (error) {
    return false;
  }
}

/**
 * Migra uma senha de bcrypt hash para criptografia reversível
 * Usado durante o processo de migração
 */
export function migrateFromBcryptToEncryption(
  plainPassword: string
): EncryptedData {
  // Esta função assume que você tem acesso à senha em texto plano
  // durante o processo de reconfiguração das credenciais
  return encryptPassword(plainPassword);
}

/**
 * Gera uma chave master segura para produção
 * IMPORTANTE: Execute isso uma vez e salve a chave gerada nas variáveis de ambiente
 */
export function generateMasterKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Validações de segurança
if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.ENCRYPTION_MASTER_KEY ||
    process.env.ENCRYPTION_MASTER_KEY === 'default-key-change-in-production')
) {
  console.warn(
    '⚠️  AVISO DE SEGURANÇA: Use uma ENCRYPTION_MASTER_KEY segura em produção!'
  );
  console.warn('Execute generateMasterKey() para gerar uma chave segura.');
}
