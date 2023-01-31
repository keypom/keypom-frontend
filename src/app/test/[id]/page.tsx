export const config = {
  runtime: 'edge',
};

export default async function Page(req) {
  console.log('req', req);

  return <p>{JSON.stringify(req)}</p>
}