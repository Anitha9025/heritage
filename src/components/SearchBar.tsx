
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar = ({ 
  placeholder = "Search...", 
  className = "",
  value,
  onChange
}: SearchBarProps) => {
  return (
    <div className={`relative rounded-full bg-white shadow-sm ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 rounded-full outline-none text-sm text-gray-700"
      />
    </div>
  );
};

export default SearchBar;
