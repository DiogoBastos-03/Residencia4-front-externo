/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base do backend, sem barra no fim. Ex.: http://localhost:5000 */
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
