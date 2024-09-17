import "./Loader.scss";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="loader">
      <Loader2 className="icon" size={48} />
    </div>
  );
};

export default Loader;
