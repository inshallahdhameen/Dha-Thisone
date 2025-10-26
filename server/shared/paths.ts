import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

export const paths = {
  // Root directories
  root: rootDir,
  server: join(rootDir, 'server'),
  dist: join(rootDir, 'dist'),
  
  // Server subdirectories
  services: join(rootDir, 'server', 'services'),
  routes: join(rootDir, 'server', 'routes'),
  middleware: join(rootDir, 'server', 'middleware'),
  config: join(rootDir, 'server', 'config'),
  shared: join(rootDir, 'server', 'shared'),
  workers: join(rootDir, 'server', 'workers'),
  db: join(rootDir, 'server', 'db'),
  types: join(rootDir, 'server', 'types'),
  utils: join(rootDir, 'server', 'utils'),
  validators: join(rootDir, 'server', 'validators'),
  tests: join(rootDir, 'server', 'tests'),
  schema: join(rootDir, 'server', 'schema'),
  integrations: join(rootDir, 'server', 'integrations'),
  monitoring: join(rootDir, 'server', 'monitoring'),
  
  // Storage paths
  storage: join(rootDir, 'server', 'storage'),
  temp: join(rootDir, 'server', 'storage', 'temp'),
  logs: join(rootDir, 'server', 'storage', 'logs'),
  documents: join(rootDir, 'server', 'storage', 'documents'),
  
  // Build and public paths
  build: join(rootDir, 'dist'),
  public: join(rootDir, 'dist', 'public'),
  assets: join(rootDir, 'dist', 'public', 'assets'),
};

export default paths;