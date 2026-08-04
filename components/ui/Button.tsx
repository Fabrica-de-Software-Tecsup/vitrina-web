interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "outline" | "disabled";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const variantStyles = {
  primary: "bg-tecsup-dark text-white hover:bg-tecsup-dark/85",
  accent: "bg-tecsup-cyan text-white hover:bg-tecsup-cyan/85",
  outline: "border border-gray-300 text-tecsup-dark hover:bg-tecsup-gray",
  disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
};

export default function Button({ 
  children, 
  variant = "primary", 
  className = "", 
  type = "button",
  onClick 
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={variant !== "disabled" ? onClick : undefined}
      disabled={variant === "disabled"}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}