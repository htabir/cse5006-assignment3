// Brand mark: a two-tone capsule with a spark. Uses currentColor so it follows the theme.
export function LogoMark({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <clipPath id="logo-capsule">
          <rect x="6" y="19" width="52" height="26" rx="13" />
        </clipPath>
      </defs>
      <g clipPath="url(#logo-capsule)">
        <rect x="6" y="19" width="52" height="26" fill="currentColor" />
        <rect x="6" y="19" width="24" height="26" fill="#6366f1" />
      </g>
      <path
        className="fill-background"
        d="M43 24l2.2 5.8L51 32l-5.8 2.2L43 40l-2.2-5.8L35 32l5.8-2.2z"
      />
    </svg>
  );
}
