import { useNavigate, useParams } from 'react-router-dom';

export const useTicketScanningParams = () => {
  const navigate = useNavigate();
  const { funderAndEventId } = useParams();

  if (funderAndEventId === undefined || funderAndEventId === '') {
    console.error('Navigating to home page. eventId is not found in the URL paramater');
    navigate('/');
    return {
      eventId: '',
      funderId: '',
    };
  }

  const split = funderAndEventId.split(':');
  if (split.length !== 2) {
    console.error('Navigating to home page. eventId is not found in the URL paramater');
    navigate('/');
    return {
      eventId: '',
      funderId: '',
    };
  }

  const [funderId, eventId] = split;
  if (eventId === undefined || eventId === '' || funderId === undefined || funderId === '') {
    console.error(
      'Navigating to home page. dropId or SecretKey are not found in the URL paramater',
    );
    navigate('/');
    return {
      eventId: '',
      funderId: '',
    };
  }

  return {
    eventId,
    funderId,
  };
};
