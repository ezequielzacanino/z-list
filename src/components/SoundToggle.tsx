import { useMuted } from '../hooks/useMuted'

// A speaker with sound waves, or crossed out while muted.
export function SoundToggle() {
  const { muted, toggleMuted } = useMuted()

  return (
    <button
      className="ghost"
      onClick={toggleMuted}
      aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
      aria-pressed={muted}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        {muted ? (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        ) : (
          <path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
        )}
      </svg>
    </button>
  )
}
