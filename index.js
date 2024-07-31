import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  transferV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  keypairIdentity,
  none,
  signerIdentity,
} from "@metaplex-foundation/umi";
import bs58 from "bs58";
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";

// Function to transfer an NFT
async function transferNFT() {
  // Set up Solana connection and load the wallet keypair
  // const connection = new Connection(
  //   "https://mainnet.helius-rpc.com/?api-key=ec3f9bea-37a6-4b86-95ea-1d85c2947c10",
  //   "confirmed"
  // );

  const connection = new Connection(
    "https://maintnet.helius-rpc.com/?api-key=",
    "confirmed"
  );
  const umi = createUmi(connection);

  const ut8 = bs58.decode("secreteKey goes here")
  console.log(ut8)

  // Decoding the secret key using bs58
  const payer = umi.eddsa.createKeypairFromSecretKey(ut8);

  // Load the payer's keypair
  // const payer = Keypair.fromSecretKey(secretKey);
  
  // Create UMI instance
  const payerSigner = createSignerFromKeypair(umi, payer);
  umi.use(signerIdentity(payerSigner));
  umi.use(mplToolbox());

  // Define the NFT mint and recipient addresses
  const mint = new PublicKey("______________"); // Replace with actual mint address
  const currentOwner = payer.publicKey;
  const newOwner = new PublicKey("___________"); // Replace with actual new owner public key

  try {
    // Execute the NFT transfer
    const transactionSignature = await transferV1(umi, {
      mint,
      authority: umi.identity, // The payer is the current authority
      tokenOwner: currentOwner,
      destinationOwner: newOwner,
      tokenStandard: TokenStandard.ProgrammableNonFungible,
      amount: 1,
      authorizationData: null
      // splAtaProgram: ASSOCIATED_TOKEN_PROGRAM_ID
    }).sendAndConfirm(umi);

    console.log(`Transfer successful: ${transactionSignature}`);
  } catch (error) {
    console.error("Error transferring NFT:", error);
  }
}

// Call the transfer function
transferNFT();
