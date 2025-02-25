import dotenv from 'dotenv';
dotenv.config();
import BlocknativeSdk from 'bnc-sdk'
import WebSocket from 'ws'
import { rollamateCall } from '../src/executeTx.js';
import { EVVM_ADDRESS_SEPOLIA } from '../src/constants.js'

// TODO: Debugging and testing execution of transactions
// create options object
const options = {
    dappId: process.env.BLOCKNATIVE_API_KEY,
    networkId: 1,
    system: 'ethereum', // optional, defaults to ethereum
    transactionHandlers: [event => console.log(event.transaction)],
    ws: WebSocket, // only neccessary in server environments 
    name: 'fisher1', // optional, use when running multiple instances
    onerror: (error) => {console.log(error)} //optional, use to catch errors
}
  
// initialize and connect to the api
const blocknative = new BlocknativeSdk(options);

export const subscribeToBlockNativePendingTransactions = () => {
    try {
        console.log("Subscribing to pending transactions...");
        rollamateCall({ hash: "0x1qw21"});
        // register a callback for a txPool event 0x4fCcaE7775723D43027a86f5861c83A3Ba0D1221
        const { emitter, details } = blocknative.account("0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2");
        console.log("Details: ", details, "Emitter: ", emitter);
   
        if (!emitter) {
            throw new Error('Emitter is undefined');
        }

        // catch every other event that occurs and log it
        emitter.on('txPool', transaction => {
            console.log(`Transaction event: ${transaction.eventCode}`);
            if(transaction.to === "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2" && transaction.status === 'pending') {
               rollamateCall(transaction);
            }
            return transaction;
        })
    } catch (error) {
        console.error('Error subscribing to pending transactions: ', error);
    }
}

subscribeToBlockNativePendingTransactions();
