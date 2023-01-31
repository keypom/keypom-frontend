export const config = {
  runtime: 'edge',
};

const Component = () => {
  return <h1>Test</h1>;
};

export default function Page() {
  return <Component />;
}
