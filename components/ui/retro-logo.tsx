import React from "react";

interface SuperRetroLogoProps {
  className?: string;
  primaryColor?: string;
  outlineColor?: string;
  size?: "sm" | "md" | "lg";
}

export const SuperRetroLogo: React.FC<SuperRetroLogoProps> = ({
  className = "",
  primaryColor = "#FF2D75",
  size = "md",
}) => {
  // Size mapping for text
  const textSizeMap = {
    sm: "text-[20px]",
    md: "text-[24px]",
    lg: "text-[48px]",
  };

  return (
    <div>
      <span
        className={`font-moirai tracking-wider ${textSizeMap[size]} ${className}`}
        style={{
          color: primaryColor,
        }}
      >
        SuperRetro
      </span>
    </div>
  );
};
