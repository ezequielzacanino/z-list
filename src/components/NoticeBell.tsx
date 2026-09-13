// A bell, filled while this member hears about what others add to the list.
export function NoticeBell({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      className="ghost"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Dejar de avisarme lo que agregan' : 'Avisarme lo que agregan'}
    >
      <svg
        viewBox="0 0 24 24"
        fill={enabled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
        <path d="M10 20.5a2.2 2.2 0 0 0 4 0" fill="none" />
      </svg>
    </button>
  )
}
