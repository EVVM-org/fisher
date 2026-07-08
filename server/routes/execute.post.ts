import { defineHandler } from "nitro";
import { readBody } from "h3";
import { execute, type ISerializableSignedAction } from "@evvm/evvm-js";
import { getEvvmSigner } from "#server/utils/evvm.ts";

interface IBody {
  signedAction: ISerializableSignedAction<any>;
  gas?: number;
}

export default defineHandler(async (event) => {
  try {
    const body = await readBody<IBody>(event);

    if (!body) throw { message: "Missing body", status: 400 };

    if (!body.signedAction)
      throw { message: "Missing signedAction", status: 400 };
    const signer = await getEvvmSigner();

    const txHash = await execute(signer, body.signedAction, { gas: body.gas });

    return Response.json({
      success: true,
      data: {
        txHash,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: (error as any)?.message ?? String(error),
      },
      {
        status: (error as any).status || (error as any).code || 500,
      },
    );
  }
});
