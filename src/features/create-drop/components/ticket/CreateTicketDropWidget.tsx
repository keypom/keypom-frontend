import { Widget } from 'near-social-vm';
import './ticketStyles.css';

export const CreateTicketDropWidget = (props) => {
  console.log('CreateTicketDropWidget', props);
  return (
    <div className="containerCSS">
      <div
        className="contentCSS"
        style={{
          position: 'relative',
        }}
      >
        <Widget key="main" src="harrydhillon.near/widget/Keypom.TicketDropLayout" />
      </div>
    </div>
  );
};
