import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  compatibilityDate: "2026-07-08",
  runtimeConfig: {
    fisherPrivateKey: "",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  },
});
