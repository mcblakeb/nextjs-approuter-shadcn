import React from "react";

interface SuperRetroLogoProps {
  className?: string;
  primaryColor?: string;
  outlineColor?: string;
  logoFont?: string;
  size?: "sm" | "md" | "lg";
}

export const SuperRetroLogo: React.FC<SuperRetroLogoProps> = ({
  className = "",
  primaryColor = "#FF2D75",
  size = "md",
  logoFont = "",
}) => {
  // Size mapping for text
  const textSizeMap = {
    sm: "text-[20px]",
    md: "text-[24px]",
    lg: "text-[32px]",
  };

  return (
    <div>
      <span
        className={`font-moirai tracking-wider ${textSizeMap[size]} ${logoFont}`}
        style={{
          color: primaryColor,
        }}
      >
        SuperRetro
      </span>
    </div>
  );
};
