import { useState } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { X } from "lucide-react";

const ErrorPopup = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3">
      <Alert severity="error" className="bg-red-500 text-white">
        <AlertTitle>Error</AlertTitle>
        An Error Occurred
      </Alert>
      <button onClick={() => setVisible(false)} className="text-white">
        <X size={20} />
      </button>
    </div>
  );
};

export default ErrorPopup;