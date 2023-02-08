import { useParams } from 'react-router-dom';

const ClaimPage = () => {
  const params = useParams();

  return <div>{JSON.stringify(params)}</div>;
};

export default ClaimPage;
