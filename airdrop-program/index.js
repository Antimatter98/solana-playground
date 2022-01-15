const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    Account,
} = require("@solana/web3.js");

// NOTE: 1 SOL = 1000000000 lamports [1 billion lamports]

//STEP-1 Generating a new wallet keypair
const newPair = new Keypair();
console.log(newPair);

//STEP-2 Storing the public and private key
// for receiving crypto
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
// for initiating a crypto transfer from your wallet
const secretKey = newPair._keypair.secretKey

//STEP-3 Getting the wallet Balance
const getWalletBalance = async () => {
    try {
        // creates a connection obj for the dev server for solana
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        const myWallet = await Keypair.fromSecretKey(secretKey);

        const walletBalance = await connection.getBalance(
            new PublicKey(myWallet.publicKey)
        );
        console.log(`=> For wallet address ${publicKey}`);
        console.log(`   Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL}SOL`);
    } catch (err) {
        console.log(err);
    }
};

//STEP-4 Air dropping SOL (in terms of LAMPORTS)
const airDropSol = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);
        
        // at one time, only 2 SOL can be airdropped to your wallet at max
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

//STEP-5 Driver function
const driverFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}
driverFunction();