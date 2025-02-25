// Description: This file is the entry point for the server. It starts the server and listens to incoming requests.
// import { subscribeToEdenPendingTransactions } from "../mempool_providers/edenMempool.svc.js";
import { subscribeToBlockNativePendingTransactions } from "../mempool_providers/blockNative.svc.js";
// import { subscribeToChainstackPendingTransactions } from "../mempool_providers/chainstack.svc.js";


const getAllPendingTransactions = async () => {
    try {
        const responseData = subscribeToBlockNativePendingTransactions();
        console.log("DATA: ", responseData);
    } catch (error) {
        console.log(error);
    }
}

getAllPendingTransactions();