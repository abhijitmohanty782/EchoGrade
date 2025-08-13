/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ECHOGRADE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 