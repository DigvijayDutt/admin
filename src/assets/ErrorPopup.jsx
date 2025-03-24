import { useState } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { X } from "lucide-react";
import './ErrorPopup.css';
import 'react-bootstrap';
const ErrorPopup = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="">
      <Alert severity="error" className="alert">
        <AlertTitle className="Etitle">Error</AlertTitle>
        An Error Occurred
        <button onClick={() => setVisible(false)} className="x">
        <X size={15} />
        </button>
      </Alert>
    </div>
  );
};

export default ErrorPopup;