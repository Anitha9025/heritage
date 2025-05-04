
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type FloatingButtonProps = {
  icon: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel: string;
};

const FloatingButton = ({ 
  icon, 
  to, 
  onClick,
  className = "",
  ariaLabel
}: FloatingButtonProps) => {
  const buttonClasses = `w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-heritage-primary text-white ${className}`;
  
  if (to) {
    return (
      <Link to={to} className={buttonClasses} aria-label={ariaLabel}>
        {icon}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={buttonClasses} aria-label={ariaLabel}>
      {icon}
    </button>
  );
};

export default FloatingButton;
