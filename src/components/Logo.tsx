const authorUrl = 'https://github.com/ezequielzacanino'

// The app mark, linking to its author: an accent disc whose check draws itself on mount.
export function Logo({ size = 2 }: { size?: number }) {
  return (
    <a className="logo" href={authorUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
      <svg viewBox="0 0 48 48" width={`${size}rem`} height={`${size}rem`} aria-hidden="true">
        <circle className="logo-disc" cx="24" cy="24" r="22" />
        <path className="logo-check" d="M14.5 25.5l7 6.5 12-15" pathLength={1} />
      </svg>
    </a>
  )
}
