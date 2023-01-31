import { NextApiRequest, NextApiResponse } from 'next';
import { getDropInformation, ProtocolReturnedDrop } from 'keypom-js';
import * as _ from 'lodash';

import { ApiResponse } from '@/common/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ProtocolReturnedDrop>>,
) {
  const { drop_id } = req.query;

  // Query for the drop information and also return the key information as well
  const dropInfo = await getDropInformation({
    dropId: drop_id as string,
    withKeys: true,
  });

  const response = { data: dropInfo };

  if (_.has(dropInfo, 'ft')) response['type'] = 'token';
  else if (_.has(dropInfo, 'fc')) response['type'] = 'deposit';
  else if (_.has(dropInfo, 'nft')) response['type'] = 'nft';
  else response['type'] = '';

  res.status(200).json(response);
}
