import { supabase } from "./DB.Connection.js";

export const getTxHash = async (txHash) => {
    try {
        const { data, error } = await supabase
        .from('transactions')
        .select(`
            _to,
            hash_origin,
            hash_final
        `)
        .eq('hash_origin', txHash);
        console.log("DATA: ", data);
        if (error) throw new Error(error);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const executeTransaction = async ({ txHash, payload }) => {
    try {
        const { error } = await supabase
        .from('transactions')
        .update({...payload})
        .eq('hash_origin', txHash);
        if (error) throw new Error(error);
    } catch (error) {
        console.log(error);
    }
}

export const writePendingTransaction = async (payload) => {
    console.log('Writing pending transaction...');
    try {
        const { error } = await supabase
            .from('transactions')
            .insert({ ...payload, status: 1, tx_type: 1 })
        if (error) throw new Error(error.message);
        return { status: "success" };
    } catch (error) {
        console.log("Error ", error);
    }
}
