import './Loading.css';

export const Loading = () => {
  return (
    <div className="container">
      <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
        <circle className="spinner_qM83" cx="4" cy="12" r="3" />
        <circle className="spinner_qM83 spinner_oXPr" cx="12" cy="12" r="3" />
        <circle className="spinner_qM83 spinner_ZTLf" cx="20" cy="12" r="3" />
      </svg>
      <p>Loading...</p>
    </div>
  );
};
