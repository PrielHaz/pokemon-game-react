interface ButtonProps {
  text: string;
  colorBeforeHover: string;
  colorAfterHover: string;
  onClick: () => void;
  isClickableAnimations?: boolean;
}

import { FunctionComponent } from "react";
import "./Button.css";

const Button: FunctionComponent<ButtonProps> = ({
  text,
  colorBeforeHover,
  colorAfterHover,
  onClick,
  isClickableAnimations,
}) => {
  return (
    <button
      className={`button ${
        !isClickableAnimations ? "not-clickable-button" : "scale-button"
      }`}
      style={{ backgroundColor: colorBeforeHover }}
      onMouseEnter={(e) => {
        // take 0.5 sec to turn to colorAfterHover
        e.currentTarget.style.transition = "background-color 0.5s";
        e.currentTarget.style.backgroundColor = colorAfterHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colorBeforeHover;
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
