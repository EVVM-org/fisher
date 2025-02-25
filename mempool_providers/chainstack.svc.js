import 'dotenv/config';
import WebSocket, { WebSocketServer } from 'ws';
import { EVVM_ADDRESS_SEPOLIA } from '../src/constants.js';
// import { rollamateCall } from '../src/executeTx.js';

// TODO: debug and test this service //
const ws_chainstack = new WebSocket(process.env.CHAINSTACK_WS_URL);

// This will generate a continuous stream of data displaying new pending transactions as they are added to the mempool.
export const subscribeToChainstackPendingTransactions = async() => {
  
    const request = {
      id: 11155111,
      jsonrpc: '2.0',
      method: 'eth_subscribe',
      params: ['newPendingTransactions', true],
    };
  
    const onOpen = (event) => {
        ws_chainstack.send(JSON.stringify(request));
    };
  
    const onMessage = async (event) => {
      const { params } = JSON.parse(event.data);
      if(params) {
        const { result } = params;
        if(result.to == EVVM_ADDRESS_SEPOLIA) {
          console.log('Transaction received: ', JSON.stringify(result, null, 2));
          return result;
          // await rollamateCall(result);
        } else {
          console.log('No transaction for rollamate');
        }
      }
    };
  
    try {
        ws_chainstack.addEventListener('open', onOpen);
        const transactions = ws_chainstack.addEventListener('message', onMessage);
        return transactions;
    } catch (error) {
      console.error(error);
    }
  }
  
subscribeToChainstackPendingTransactions()
  .then((transactions) => console.log(transactions))
  .catch((error) => console.error(error));

