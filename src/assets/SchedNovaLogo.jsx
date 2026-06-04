/**
 * SchedNova Professional Logo Component
 * Modern SaaS-style branding for smart timetable scheduling
 */

// Main Logo - Light Background Version
export function SchedNovaLogoLight({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      {/* Calendar Grid Background */}
      <rect
        x="6"
        y="8"
        width="36"
        height="32"
        rx="4"
        fill="url(#logoGrad1)"
        opacity="0.1"
      />

      {/* Calendar Frame */}
      <rect
        x="6"
        y="8"
        width="36"
        height="32"
        rx="4"
        stroke="url(#logoGrad1)"
        strokeWidth="1.5"
      />

      {/* Calendar Header */}
      <rect x="6" y="8" width="36" height="6" rx="4" fill="url(#logoGrad1)" />

      {/* Grid Lines (Schedule Grid) */}
      <line
        x1="16"
        y1="8"
        x2="16"
        y2="40"
        stroke="url(#logoGrad1)"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="26"
        y1="8"
        x2="26"
        y2="40"
        stroke="url(#logoGrad1)"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="6"
        y1="18"
        x2="42"
        y2="18"
        stroke="url(#logoGrad1)"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="6"
        y1="28"
        x2="42"
        y2="28"
        stroke="url(#logoGrad1)"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Clock Icon (Smart Automation) */}
      <circle
        cx="32"
        cy="24"
        r="6"
        stroke="url(#logoGrad2)"
        strokeWidth="1.2"
      />
      <line
        x1="32"
        y1="21"
        x2="32"
        y2="19"
        stroke="url(#logoGrad2)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="24"
        x2="37"
        y2="24"
        stroke="url(#logoGrad2)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Spark (AI/Intelligence) */}
      <circle cx="38" cy="12" r="1.5" fill="url(#logoGrad2)" />
      <circle cx="40" cy="14" r="1" fill="url(#logoGrad2)" opacity="0.7" />
    </svg>
  );
}

// Dark Background Version
export function SchedNovaLogoDark({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="darkLogoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="darkLogoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* Calendar Grid Background */}
      <rect
        x="6"
        y="8"
        width="36"
        height="32"
        rx="4"
        fill="url(#darkLogoGrad1)"
        opacity="0.15"
      />

      {/* Calendar Frame */}
      <rect
        x="6"
        y="8"
        width="36"
        height="32"
        rx="4"
        stroke="url(#darkLogoGrad1)"
        strokeWidth="1.5"
      />

      {/* Calendar Header */}
      <rect
        x="6"
        y="8"
        width="36"
        height="6"
        rx="4"
        fill="url(#darkLogoGrad1)"
      />

      {/* Grid Lines */}
      <line
        x1="16"
        y1="8"
        x2="16"
        y2="40"
        stroke="url(#darkLogoGrad1)"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="26"
        y1="8"
        x2="26"
        y2="40"
        stroke="url(#darkLogoGrad1)"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="6"
        y1="18"
        x2="42"
        y2="18"
        stroke="url(#darkLogoGrad1)"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="6"
        y1="28"
        x2="42"
        y2="28"
        stroke="url(#darkLogoGrad1)"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Clock Icon */}
      <circle
        cx="32"
        cy="24"
        r="6"
        stroke="url(#darkLogoGrad2)"
        strokeWidth="1.2"
      />
      <line
        x1="32"
        y1="21"
        x2="32"
        y2="19"
        stroke="url(#darkLogoGrad2)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="24"
        x2="37"
        y2="24"
        stroke="url(#darkLogoGrad2)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Spark */}
      <circle cx="38" cy="12" r="1.5" fill="url(#darkLogoGrad2)" />
      <circle cx="40" cy="14" r="1" fill="url(#darkLogoGrad2)" opacity="0.7" />
    </svg>
  );
}

// Monogram Version (SN)
export function SchedNovaMonogram({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="12" fill="url(#monoGrad)" />
      <text
        x="24"
        y="32"
        fontSize="20"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        SN
      </text>
    </svg>
  );
}

// Favicon Version (Minimal)
export function SchedNovaFavicon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="faviconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="8" fill="url(#faviconGrad)" />

      {/* Minimal Calendar Grid */}
      <rect
        x="4"
        y="5"
        width="24"
        height="22"
        rx="2"
        fill="none"
        stroke="white"
        strokeWidth="1.2"
      />
      <line x1="4" y1="11" x2="28" y2="11" stroke="white" strokeWidth="1" />
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="27"
        stroke="white"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="20"
        y1="5"
        x2="20"
        y2="27"
        stroke="white"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Clock indicator */}
      <circle cx="24" cy="22" r="3" fill="white" opacity="0.8" />
    </svg>
  );
}

export default SchedNovaLogoLight;
