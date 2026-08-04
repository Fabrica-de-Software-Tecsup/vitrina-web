interface PillFilterProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function PillFilter({ children, active = false, onClick }: PillFilterProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
        active
          ? "bg-tecsup-dark text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
      }`}
    >
      {children}
    </button>
  );
}