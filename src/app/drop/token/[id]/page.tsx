import { NextPageContext } from 'next';
import { URLPattern } from 'next/server';

import TokenDropManager from './TokenDropManager';

export const config = {
  runtime: 'edge',
};

function parsePath(pathname: string, ctx: NextPageContext): any {
  const pattern = new URLPattern({ pathname });
  const result = pattern.exec(`http://host${ctx.req?.url}`);

  return result?.pathname.groups || {};
}

export default async function Page(req) {
  console.log('req', req);
  // const {
  //   params: { id },
  // } = req;
  const { id } = parsePath('/drop/token/:id', req);
  console.log(parsePath('/drop/token/:id', req));
  const data = {
    1: {
      name: 'Star Invader 1',
      links: [
        { id: 1, slug: '#2138h823h', hasClaimed: true },
        { id: 2, slug: '#2138h823h', hasClaimed: false },
        { id: 3, slug: '#c34fd2n32', hasClaimed: false },
        { id: 4, slug: '#rf5hhfaxm', hasClaimed: true },
      ],
    },
    2: {
      name: 'Star Invader 2',
      links: [
        { id: 1, slug: '#2138h823h', hasClaimed: true },
        { id: 2, slug: '#2138h823h', hasClaimed: false },
        { id: 3, slug: '#c34fd2n32', hasClaimed: false },
        { id: 4, slug: '#rf5hhfaxm', hasClaimed: true },
      ],
    },
    3: {
      name: 'Star Invader 3',
      links: [
        { id: 1, slug: '#2138h823h', hasClaimed: true },
        { id: 2, slug: '#2138h823h', hasClaimed: false },
        { id: 3, slug: '#c34fd2n32', hasClaimed: false },
        { id: 4, slug: '#rf5hhfaxm', hasClaimed: true },
      ],
    },
  };

  return <TokenDropManager data={data[id]} req={req} />;
}
