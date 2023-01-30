export const config = {
  runtime: 'edge',
};

export default async function Page({ params: { id } }) {
  return <h1>ID: {id}</h1>;
}
