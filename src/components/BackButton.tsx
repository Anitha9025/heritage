
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  className?: string;
};

const BackButton = ({ className = "" }: BackButtonProps) => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate(-1)} 
      className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={20} className="text-heritage-dark" />
    </button>
  );
};

export default BackButton;
