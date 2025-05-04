
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to language selection page
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-heritage-light">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Heritage Guide</h1>
        <p className="text-lg text-gray-600">Redirecting to language selection...</p>
      </div>
    </div>
  );
};

export default Index;
