
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Aqui você adiciona outras variáveis que criar no seu .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}