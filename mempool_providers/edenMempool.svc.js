import WebSocket, { WebSocketServer } from 'ws';
import { EVVM_ADDRESS_SEPOLIA } from '../src/constants.js';
// import { rollamateCall } from '../src/executeTx.js';

// TODO: debug and test this service //
// Check send ws message
const ws_eden = new WebSocket('wss://speed-eu-west.edennetwork.io');

export async function subscribeToEdenPendingTransactions() {
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "subscribe",
    params: ["newTxs"]
  };

  const onOpen = (event) => {
      ws_eden.send(JSON.stringify(request));
  }

  const onMessage = async (event) => {
    const { params } = JSON.parse(event.data);
    if(params) {
      const { result } = params;
      if(result.to !== ROLL_A_MATE_ADDRESS_MAINNET) {
        // await rollamateCall(result);
      } else {
        console.log('No transaction for rollamate');
      }
    }
  };

  try {
    ws_eden.addEventListener('open', onOpen);
    ws_eden.addEventListener('message', onMessage);
  
  } catch (error) {
    console.error(error);
  }
   
};

