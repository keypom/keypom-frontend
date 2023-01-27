import { NextApiRequest, NextApiResponse } from "next";

import { ApiResponse } from "@/common/types";

// TODO: replace with ProtocolReturnedDrop from keypom-sdk
type DropInformation = {
  drop_id: string;
}

/**
 * 
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DropInformation>>  
) {
  //TODO: to be replaced with type inference from drop id
  const type = req.query["type"] as string

  const return_data = {
    drop_id: "sample_id_string",

    drop_data: {
      // will be used to redirect user accordingly
      type
    },
  }

  res.status(200).json({data: return_data})
}