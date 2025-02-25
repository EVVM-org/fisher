import 'dotenv/config';
import { Web3 } from "web3";
import { getTxHash, executeTransaction, writePendingTransaction } from '../db/supabase.querys.js';
import { veryfySigner } from './verifySignatures.js';
import { MATE_TOKEN_ADDRESS_MAINNET, EVVM_ADDRESS_SEPOLIA } from './constants.js';
// import MateToken from '../ABIs/MateToken.json';
 import { EVVM_MOCK } from '../ABIs/EvvmMock.json';

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.AVALANCHE_RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(process.env.FISHER_PRIVATE_KEY);

export const rollamateCall = async (payload) => {
    console.log('Rollamate transaction detected', {...payload});
    const FISHER_ADDRESS = account.address;
    // validate tx hash does not exist on supabase and hash_final is null
    const existHash = await getTxHash(payload.hash);
    console.log('Exist hash: ', existHash);
    if(existHash.length === 0) {
        // validate balance, gas and nonce
        const hasEnoughGasToExecuteTx = await checkFisherGasBalance(FISHER_ADDRESS);
        // validate signature
        const isValidSigner = veryfySigner(
          "0x66756e6374696f6e3a66346531383935622c746f3a3078653834306634663037353061666365363732626138636533386164613065396130333231623761662c746f6b656e3a3078413062383639393163363231386233366331643139443461326539456230634533363036654234382c616d6f756e743a31353530303030302c7072696f726974794665653a31303030302c6e6f6e63653a323639303135303733342c7072696f726974793a747275652c6578656375746f723a3078303030303030303030303030303030303030303030303030303030303030303030303030303030302c7369676e61747572653a307838353266626635643732616136346237363462333235323763626636633630393465393835306662316238383935346566376662656237383937373565373836333339623734633038643664333963623066633736613936333939643137333166373564653339653333306665316265373563623661323038303730623661613163",
          "0xFe6577db195f007cca6a3fbe44cdAef15f386EF5"
        ); //transaction.input, transaction.from
        console.log('Has enough gas: ', hasEnoughGasToExecuteTx);

        console.log('Is valid signer: ', isValidSigner);
        
        // write in db(transaction);
        // if( hasEnoughGasToExecuteTx && isValidSignature) {
        //     // make tx on avalanche
            const receipt = await sendPayTx(payload);
            console.log('Transaction executed: ', {...receipt});
        //     // write tx hash on supabase
        //     await executeTransaction({ txHash: payload.hash, payload: { _to: payload.to, method: "", fisher_address: FISHER_ADDRESS, hash_final: receipt.transactionHash } });
        // }
    }
};

const mateContract = () => {
    const contract = new web3.eth.Contract(MateToken, MATE_TOKEN_ADDRESS_MAINNET);
    return contract;
}

const bookMateContract = () => {
    const contract = new web3.eth.Contract(EVVM_MOCK.abi, EVVM_ADDRESS_SEPOLIA);
    return contract;
}
//avax token
const checkFisherGasBalance = async (fisher_address) => {
    const balance = await web3.eth.getBalance(fisher_address);
    const formattedBalance = web3.utils.fromWei(balance, 'ether');
    return formattedBalance >= 0.1 ? true : false;
}

//mate token
const checkFisherMateBalance = async (fisher_address) => {
    const tokenContract = mateContract();
    const balance = await tokenContract.methods.balanceOf(fisher_address).call();
    // balance have to be greater or equal than 5k mate tokens
    const mateBalance = web3.utils.fromWei(balance, 'ether');
    return mateBalance >= 5080 ? true : false;
}

const getNextCurrentSyncNonce = async (user_address) => {
  const bookMateContract = bookMateContract();
  const nonce = await bookMateContract.methods.getNextCurrentSyncNonce(user_address).call();
  return nonce;
};

const getIfUsedAsyncNonce = async (user_address, nonce) => {
  const bookMateContract = bookMateContract();
  const isUsed = await bookMateContract.methods.getIfUsedAsyncNonce(user_address, nonce).call();
  return isUsed;
}

const getNextFisherWithdrawalNonce = async (user_address) => {
    const bookMateContract = bookMateContract();
    const nonce = await bookMateContract.methods.getNextFisherWithdrawalNonce(user_address).call();
    return nonce;
}

const getNextFisherDepositNonce = async (user_address) => {
    const bookMateContract = bookMateContract();
    const nonce = await bookMateContract.methods.getNextFisherDepositNonce(user_address).call();
    return nonce;
}

// Treasury
const getNextTreasuryFisherDepositNonce = async (user_address) => {
  const mateContract = mateContract();
  const nonce = await mateContract.methods.getNextFisherDepositNonce(user_address).call();
}

const getNextTreasuryFisherWithdrawalNonce = async (user_address) => {
  const mateContract = mateContract();
  const nonce = await mateContract.methods.getNextFisherWithdrawalNonce(user_address).call();
}

const sendPayTx = async (txData) => {
    try {
        const { sender, to_address, to_username, token, amount, tip, executor, signature, nonce } = txData;
        let resUpdate = null;

        web3.eth.accounts.wallet.add(account);

        const payTxFromHolder = bookMateContract.methods.payAsync( //payNoMateStaking_sync
          sender,
          to_address,
          to_username,
          token,
          BigInt(amount), // "2000000000000000000",
          BigInt(tip), // "1000000000000000000",
          nonce,
          executor, // "0x0000000000000000000000000000000000000000"
          signature,
        );
  
      const encodeTransfer = payTxFromHolder.encodeABI();
  
      console.log("Encode ", encodeTransfer);
  
      const gasPrice = await web3.eth.getGasPrice();
  
      await web3.eth
        .estimateGas({
          to: EVVM_ADDRESS_SEPOLIA,
          data: encodeTransfer,
        })
        .then(async (res) => {
          const txData = {
            from: account.address, // account.address,
            to: EVVM_ADDRESS_SEPOLIA, // Avalanche BOOK CONTRACT
            data: encodeTransfer,
            // nonce: localNonce,
            gas: res,
            gasPrice,
          };
  
          const signedTX = await web3.eth.accounts.signTransaction(txData, process.env.FISHER_PRIVATE_KEY);

          await web3.eth
            .sendSignedTransaction(signedTX.rawTransaction)
            .on("receipt", (receipt) => {
              console.log("RECEIPT ", receipt);
              resUpdate = receipt;
              return { receipt };
            });
          return resUpdate;
        });
    } catch (error) {
        console.log(error);
    }
};

const checkPayloadNonce = async () => {/* What have to do this function */}
