import 'dotenv/config';
import { Web3 } from "web3";
// import { goToMempoolAndGetTransactionData } from "./constants";

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// const getMessageHashForAction = (action_type) => {
//     try {
//         const {mempoolSignature, signer, params } = goToMempoolAndGetTransactionData(action_type);
//         const valueParams = {
//             "withdraw": [params._function, params._token, params._amount, params._tip, params._nonce, params._priority_boolean],
//             "pay": [params._function, params._receiver, params._token, params._amount, params._tip, params._nonce, params._priority_boolean, params._executor]
//         }
//         const parametersEncoded = web3.eth.abi.encodeParameters(
//             encodeParams[action_type],
//             valueParams[action_type]
//         );
//         const hashMsg = web3.eth.accounts.hashMessage(parametersEncoded);
//         console.log("HASH -->>> ", hashMsg);
//         return { hashMsg, mempoolSignature, mempoolSigner: signer };
//     } catch (error) {
//         console.log(error);
//     }
// }

export const veryfySigner = (hashMsg, mempoolSigner) => {
    try {
        const messageToString = web3.utils.hexToUtf8(hashMsg);
        const messageToElements = messageToString.split(',');

        let reconstructedMsg = "";
        const obj = {};
        messageToElements.forEach(item => {
            const [key, value] = item.split(':');
            obj[key] = value;
        });

        console.log(obj);

        const { function: functionBytes, to, token, amount, priorityFee, nonce, priority, executor, signature } = obj;

        reconstructedMsg = functionBytes +
            "," +
            (to.startsWith("0x") ? to.toLowerCase() : to) +
            "," +
            token?.toLowerCase() +
            "," +
            amount +
            "," +
            priorityFee +
            "," +
            nonce.toString() +
            "," +
            Boolean(priority) +
            "," +
            executor?.toLowerCase();

        const recoveredSigner = web3.eth.accounts.recover(reconstructedMsg, signature);
        console.log('SIGNER >>> ', recoveredSigner);

        if (mempoolSigner !== recoveredSigner) {
            console.log('Invalid signer');
            return false;
        }

        // make pay transaction
        console.log("Sending pay transaction....");
        return true;
    } catch (error) {
        console.log(error);
    }
};

// veryfySignaturePay();