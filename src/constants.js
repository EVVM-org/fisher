export const goToMempoolAndGetTransactionData = (id) => {
    if(id === "withdraw") {
        return { 
        mempoolSignature: "0x993dab3dd91f5c6dc28e17439be475478f5635c92a56e17e82349d3fb2f166196f466c0b4e0c146f285204f0dcb13e5ae67bc33f4b888ec32dfe0a063e8f3f781b",
        signer: "0x3C887EF92B032f052Cbd1b2736D23beDBF553DD3",
        params: {
            _function: "withdraw",
            _token: ethers.ZeroAddress,
            _amount: 123, // in wei
            _tip: 0, // in wei
            _nonce: 1,
            _priority_boolean: true
        }
        }
    } else {
        return { 
            mempoolSignature: "0x993dab3dd91f5c6dc28e17439be475478f5635c92a56e17e82349d3fb2f166196f466c0b4e0c146f285204f0dcb13e5ae67bc33f4b888ec32dfe0a063e8f3f781b",
            signer: "0xB273216C05A8c0D4F0a4Dd0d7Bae1D2EfFE636dd",
            params: {
                _function: "pay",
                _receiver: "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
                _token: ethers.ZeroAddress,
                _amount: 123, // in wei?
                _tip: 0, // in wei?
                _nonce: 1,
                _priority_boolean: true,
                _executor: "0x3C887EF92B032f052Cbd1b2736D23beDBF553DD3"
            }
        }
    }
};

export const encodeParams = {
    "withdraw": ['string', 'address', 'uint256', 'uint256', 'uint256', 'bool'],
    "pay": ['string', 'address', 'address', 'uint256', 'uint256', 'uint256', 'bool', 'address'],
};

export const EVVM_ADDRESS_MAINNET = "0x0B674Fc30238Bf5a6115Ce12A1f77Aa04fb16216";

export const MATE_TOKEN_ADDRESS_MAINNET = "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"; // change this to the real address

export const EVVM_ADDRESS_SEPOLIA = "0x4fCcaE7775723D43027a86f5861c83A3Ba0D1221"; // change this to the real address

const sMateAddress = "0x0000000000000000000000000000000000000002";
const mateToken = "0x0000000000000000000000000000000000000001";
const ethAddress = "0x0000000000000000000000000000000000000000";