import { createSignerWithEthers } from "@evvm/evvm-js";
import { ethers } from "ethers";
import { useRuntimeConfig } from "nitro/runtime-config";

let cachedSigner: Awaited<ReturnType<typeof createSignerWithEthers>> | null =
  null;

export const getEvvmSigner = async () => {
  if (cachedSigner) return cachedSigner;

  const config = useRuntimeConfig();
  const privateKey = config.fisherPrivateKey;
  if (!privateKey)
    throw new Error("No fisherPrivateKey runtime config defined");

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const signer = await createSignerWithEthers(wallet);

  cachedSigner = signer;
  return signer;
};
