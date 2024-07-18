import { useConferenceContext } from '@/contexts/ConferenceContext';

import ScavengerPage from './ScavengerPage';
import CollectiblesPage from './CollectiblesPage';
import AssetsHome from './AssetsHome';

const AssetsPageManager = () => {
  const { queryString } = useConferenceContext();
  const tab = queryString.get('tab') || 'home';

  switch (tab) {
    case 'scavengers':
      return <ScavengerPage />;
    case 'collectibles':
      return <CollectiblesPage />;
    default:
      return <AssetsHome />;
  }
};

export default AssetsPageManager;
