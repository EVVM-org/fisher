import { createSignerWithEthers } from "@evvm/evvm-js";
import { ethers } from "ethers";

let cachedSigner: Awaited<ReturnType<typeof createSignerWithEthers>> | null =
  null;

export const getEvvmSigner = async () => {
  if (cachedSigner) return cachedSigner;

  const privateKey = process.env.FISHER_PRIVATE_KEY;
  if (!privateKey) throw new Error("No FISHER_PRIVATE_KEY env var defined");

  const provider = new ethers.JsonRpcProvider(
    "https://ethereum-sepolia-rpc.publicnode.com",
  );
  const wallet = new ethers.Wallet(privateKey, provider);
  const signer = await createSignerWithEthers(wallet);

  cachedSigner = signer;
  return signer;
};
