
import { useEffect } from "react";

const Alert = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
};

export default Alert;
