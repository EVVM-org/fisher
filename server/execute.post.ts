import { defineHandler } from "nitro";
import { getEvvmSigner } from "./utils/evvm";
import { execute, type ISerializableSignedAction } from "@evvm/evvm-js";

interface IBody {
  signedAction: ISerializableSignedAction<any>;
}

export default defineHandler(async (event) => {
  try {
    const body = (await event.req.json()) as IBody;
    if (!body.signedAction)
      throw { message: "Missing signedAction", status: 400 };
    const signer = await getEvvmSigner();

    const txHash = await execute(signer, body.signedAction);

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
