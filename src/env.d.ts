/// <reference types="../worker-configuration.d.ts" />

declare module "cloudflare:workers" {
  const env: Cloudflare.Env
  export { env }
}
