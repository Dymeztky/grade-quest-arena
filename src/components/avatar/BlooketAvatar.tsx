import { useState } from "react";

interface BlooketAvatarProps {
  skinColor?: string;
  outfit?: string;
  hat?: string;
  glasses?: string;
  className?: string;
}

export const BlooketAvatar = ({
  skinColor = "default",
  outfit = "blue",
  hat = "none",
  glasses = "none",
  className = "",
}: BlooketAvatarProps) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const skinColorHex =
    skinColor === "default" ? "#FFD5C2"
      : skinColor === "tan" ? "#D4A574"
        : skinColor === "dark" ? "#8B6F47"
          : "#FFF0E6";

  const outfitColorHex =
    outfit === "blue" ? "#4F9DDE"
      : outfit === "red" ? "#E85D75"
        : outfit === "green" ? "#5DC264"
          : outfit === "gold" ? "#F5C842"
            : "#7C8594";

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      setRotation((prev) => prev + deltaX * 0.5);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const deltaX = e.touches[0].clientX - startX;
      setRotation((prev) => prev + deltaX * 0.5);
      setStartX(e.touches[0].clientX);
    }
  };

  // Normalize rotation for display logic
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const isBackView = normalizedRotation > 90 && normalizedRotation < 270;

  return (
    <div
      className={`relative select-none cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <svg
        viewBox="0 0 200 280"
        className="w-full h-full drop-shadow-2xl"
        style={{
          transform: `scaleX(${isBackView ? -1 : 1})`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Body */}
        <ellipse
          cx="100"
          cy="200"
          rx="50"
          ry="60"
          fill={outfitColorHex}
          stroke="hsl(var(--foreground) / 0.1)"
          strokeWidth="2"
        />

        {/* Body highlight */}
        <ellipse
          cx="85"
          cy="185"
          rx="20"
          ry="25"
          fill="white"
          opacity="0.2"
        />

        {/* Left Arm */}
        <ellipse
          cx="45"
          cy="190"
          rx="18"
          ry="25"
          fill={outfitColorHex}
          stroke="hsl(var(--foreground) / 0.1)"
          strokeWidth="2"
        />

        {/* Right Arm */}
        <ellipse
          cx="155"
          cy="190"
          rx="18"
          ry="25"
          fill={outfitColorHex}
          stroke="hsl(var(--foreground) / 0.1)"
          strokeWidth="2"
        />

        {/* Left Foot */}
        <ellipse
          cx="70"
          cy="255"
          rx="22"
          ry="15"
          fill="#4A5568"
          stroke="hsl(var(--foreground) / 0.1)"
          strokeWidth="2"
        />

        {/* Right Foot */}
        <ellipse
          cx="130"
          cy="255"
          rx="22"
          ry="15"
          fill="#4A5568"
          stroke="hsl(var(--foreground) / 0.1)"
          strokeWidth="2"
        />

        {/* Head */}
        <circle
          cx="100"
          cy="85"
          r="65"
          fill={skinColorHex}
          stroke="hsl(var(--foreground) / 0.1)"
          strokeWidth="2"
        />

        {/* Head highlight */}
        <ellipse
          cx="75"
          cy="60"
          rx="25"
          ry="20"
          fill="white"
          opacity="0.25"
        />

        {/* Face features (only show when front view) */}
        {!isBackView && (
          <>
            {/* Left Eye white */}
            <ellipse cx="70" cy="85" rx="18" ry="20" fill="white" />
            {/* Right Eye white */}
            <ellipse cx="130" cy="85" rx="18" ry="20" fill="white" />

            {/* Left Eye pupil */}
            <circle cx="73" cy="88" r="10" fill="#2D3748" />
            {/* Right Eye pupil */}
            <circle cx="133" cy="88" r="10" fill="#2D3748" />

            {/* Left Eye shine */}
            <circle cx="76" cy="84" r="4" fill="white" />
            {/* Right Eye shine */}
            <circle cx="136" cy="84" r="4" fill="white" />

            {/* Blush Left */}
            <ellipse cx="50" cy="105" rx="12" ry="8" fill="#FFB5B5" opacity="0.5" />
            {/* Blush Right */}
            <ellipse cx="150" cy="105" rx="12" ry="8" fill="#FFB5B5" opacity="0.5" />

            {/* Smile */}
            <path
              d="M 80 115 Q 100 135 120 115"
              fill="none"
              stroke="#2D3748"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Glasses */}
            {glasses === "round" && (
              <>
                <circle
                  cx="70"
                  cy="85"
                  r="22"
                  fill="none"
                  stroke="#2D3748"
                  strokeWidth="3"
                />
                <circle
                  cx="130"
                  cy="85"
                  r="22"
                  fill="none"
                  stroke="#2D3748"
                  strokeWidth="3"
                />
                <line
                  x1="92"
                  y1="85"
                  x2="108"
                  y2="85"
                  stroke="#2D3748"
                  strokeWidth="3"
                />
              </>
            )}
            {glasses === "shades" && (
              <>
                <rect
                  x="48"
                  y="70"
                  width="44"
                  height="30"
                  rx="5"
                  fill="#1A202C"
                />
                <rect
                  x="108"
                  y="70"
                  width="44"
                  height="30"
                  rx="5"
                  fill="#1A202C"
                />
                <line
                  x1="92"
                  y1="85"
                  x2="108"
                  y2="85"
                  stroke="#1A202C"
                  strokeWidth="3"
                />
              </>
            )}
          </>
        )}

        {/* Hat */}
        {hat === "cap" && (
          <>
            <ellipse cx="100" cy="30" rx="55" ry="20" fill="#2B6CB0" />
            <rect x="45" y="20" width="110" height="25" rx="5" fill="#2B6CB0" />
            <rect x="90" y="35" width="65" height="12" rx="3" fill="#1E4E8C" />
          </>
        )}
        {hat === "wizard" && (
          <>
            <polygon
              points="100,0 140,50 60,50"
              fill="#6B46C1"
            />
            <ellipse cx="100" cy="50" rx="45" ry="12" fill="#553C9A" />
            <circle cx="100" cy="8" r="6" fill="#F6E05E" />
          </>
        )}
        {hat === "crown" && (
          <>
            <polygon
              points="55,45 70,20 85,40 100,10 115,40 130,20 145,45"
              fill="#F6E05E"
              stroke="#D69E2E"
              strokeWidth="2"
            />
            <rect x="55" y="40" width="90" height="20" rx="3" fill="#F6E05E" stroke="#D69E2E" strokeWidth="2" />
            <circle cx="75" cy="50" r="5" fill="#E53E3E" />
            <circle cx="100" cy="50" r="5" fill="#48BB78" />
            <circle cx="125" cy="50" r="5" fill="#4299E1" />
          </>
        )}
      </svg>
    </div>
  );
};