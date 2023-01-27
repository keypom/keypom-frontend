import { NextApiRequest, NextApiResponse } from "next";

import { ApiResponse } from "@/common/types";

// TODO: replace with ProtocolReturnedDrop from keypom-sdk
type DropInformation = {
  drop_id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DropInformation>>  
) {
  //TODO: call getDropInformation
  const drop_info = {} // insert ProtocolReturnedDrop

  //TODO: to be replaced with type inference from drop id
  const type = req.query["type"] as string

  // will be used to redirect user accordingly
  drop_info['type'] = type

  const return_data = {
    drop_id: "sample_id_string",
    drop_info
  }

  res.status(200).json({data: return_data})
}