import React from 'react';
import { Button as UIButton } from "../ui/button";
import { Loader2 } from "lucide-react";

interface CustomButtonProps {
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}



/**
 * A custom button component that extends the functionality of UIButton.
 * 
 * @component
 * @param {Object} props - The properties that define the button's behavior and appearance.
 * @param {Function} props.onClick - The function to be called when the button is clicked.
 * @param {string} [props.className=''] - Additional CSS classes to be applied to the button.
 * @param {boolean} [props.isLoading=false] - Indicates whether the button is in a loading state.
 * @param {React.ReactNode} props.children - The content to be displayed inside the button.
 * 
 * @example
 * <Button onClick={() => console.log('Clicked')} isLoading={true}>
 *   Submit
 * </Button>
 * 
 * @returns {React.FC<CustomButtonProps>} A button component with optional loading indicator.
 */

const Button: React.FC<CustomButtonProps> = ({ onClick, className = '', isLoading = false, children }) => {
  return (
    <UIButton onClick={onClick} className={`w-full ${className}`}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </UIButton>
  );
}

export default Button;