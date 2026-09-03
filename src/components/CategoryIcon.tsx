import type { ReactNode } from 'react'
import type { Category } from '../lib/types'

// Line-only glyphs on a 24x24 grid, drawn in the current text color.
const glyphs: Record<Category, ReactNode> = {
  fruta: (
    <>
      <path d="M12 8.4c-1.6-1.9-4.5-1.7-5.7.4-1.4 2.4-.4 6.1 1.6 8.4 1 1.1 2.3 1.4 4.1 1.4s3.1-.3 4.1-1.4c2-2.3 3-6 1.6-8.4-1.2-2.1-4.1-2.3-5.7-.4z" />
      <path d="M12 8.4V5.6" />
      <path d="M12 6.2c1-2 3.1-2.5 4.3-2.3.2 1.5-.6 3.1-2 3.5-1 .3-1.9-.2-2.3-1.2z" />
    </>
  ),
  verdura: (
    <>
      <path d="M20 4.2C11.2 4.2 4.2 8.3 4.2 15c0 2.8 2.2 5 5 5 7 0 10.8-6.9 10.8-15.8z" />
      <path d="M5 19.2C8.4 15.8 12.4 11.9 16.2 9.2" />
    </>
  ),
  carne: (
    <>
      <ellipse cx="14.8" cy="9.2" rx="6.4" ry="5" transform="rotate(-40 14.8 9.2)" />
      <path d="M10.6 13.4 7.6 16.4" />
      <path d="M10.64 17.74a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 1 1 3.4 0z" />
      <path d="M7.96 15.06a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 1 1 3.4 0z" />
    </>
  ),
  pescado: (
    <>
      <path d="M19 12c-2.3-3.3-5.2-5.2-8.5-5.2S4.3 8.7 2 12c2.3 3.3 5.2 5.2 8.5 5.2S16.7 15.3 19 12z" />
      <path d="M19 12c0-1.3.9-2.6 2.6-3.5v7c-1.7-.9-2.6-2.2-2.6-3.5z" />
      <path d="M7.2 10.6h.01" />
    </>
  ),
  lacteos: (
    <>
      <path d="M7 10.3 9.9 6.3h4.2L17 10.3V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
      <path d="M7 10.3h10" />
      <path d="M9.9 6.3h4.2" />
    </>
  ),
  panaderia: (
    <>
      <path d="M4 14.2c0-4 3.6-7.2 8-7.2s8 3.2 8 7.2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
      <path d="M9 10.4 7.6 13" />
      <path d="M12.4 10 11 12.6" />
      <path d="M15.8 10.4 14.4 13" />
    </>
  ),
  bebidas: (
    <>
      <path d="M10 3.2h4v3.3c0 .5.15 1 .45 1.4l1.1 1.5c.3.4.45.9.45 1.4V19a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8.2c0-.5.15-1 .45-1.4l1.1-1.5c.3-.4.45-.9.45-1.4z" />
      <path d="M8 13.2h8" />
    </>
  ),
  almacen: (
    <>
      <path d="M7 4.6h10a1 1 0 0 1 1 1v2.2H6V5.6a1 1 0 0 1 1-1z" />
      <path d="M6.6 7.8h10.8V19a2 2 0 0 1-2 2H8.6a2 2 0 0 1-2-2z" />
      <path d="M8.6 14.6c1.1-1 2.3-1 3.4 0s2.3 1 3.4 0" />
    </>
  ),
  limpieza: (
    <>
      <path d="M10 4.2h4v2.6h-4z" />
      <path d="M10.5 6.8v3.4" />
      <path d="M13.5 6.8v3.4" />
      <path d="M9 10.2h6a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6.8a2 2 0 0 1 2-2z" />
      <path d="M16.2 5.4h2.4" />
      <path d="M16.2 3.4 18.4 2.6" />
      <path d="M16.2 7.4 18.4 8.2" />
    </>
  ),
  higiene: (
    <>
      <path d="M4.2 12.2h9.6a2 2 0 0 1 2 2v3.8a2 2 0 0 1-2 2H4.2a2 2 0 0 1-2-2v-3.8a2 2 0 0 1 2-2z" />
      <path d="M20 7.6a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0z" />
      <path d="M22.2 12.6a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0z" />
    </>
  ),
  hogar: (
    <>
      <path d="M3.6 10.6 12 4.2l8.4 6.4" />
      <path d="M5.6 12.2v7.3a1 1 0 0 0 1 1h10.8a1 1 0 0 0 1-1v-7.3" />
    </>
  ),
  ropa: (
    <path d="M8.6 4 6 5.2 3.8 8.2l2.6 2 1-1v9.4a1 1 0 0 0 1 1h7.2a1 1 0 0 0 1-1V9.2l1 1 2.6-2L18 5.2 15.4 4a3.4 3.4 0 0 1-6.8 0z" />
  ),
  mascota: (
    <>
      <path d="M12 12.6c2.6 0 4.8 2 4.8 4.4 0 1.7-1.3 2.8-3 2.8-.6 0-1.2-.2-1.8-.4-.6.2-1.2.4-1.8.4-1.7 0-3-1.1-3-2.8 0-2.4 2.2-4.4 4.8-4.4z" />
      <path d="M9 10.3a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z" />
      <path d="M12.2 7.9a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z" />
      <path d="M15.4 7.9a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z" />
      <path d="M18.6 10.3a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z" />
    </>
  ),
  tecnologia: (
    <>
      <path d="M9 3.2v3.6" />
      <path d="M15 3.2v3.6" />
      <path d="M6.6 6.8h10.8v3.6a5.4 5.4 0 0 1-10.8 0z" />
      <path d="M12 15.8v5" />
    </>
  ),
  papeleria: (
    <>
      <path d="M16.6 4.9a2.1 2.1 0 0 1 3 3L9 18.5l-4 1 1-4z" />
      <path d="M15.4 6.1 18.4 9.1" />
    </>
  ),
  generico: (
    <>
      <path d="M4.4 8.4 12 4.4l7.6 4v7.2L12 19.6l-7.6-4z" />
      <path d="M4.4 8.4 12 12.4l7.6-4" />
      <path d="M12 12.4v7.2" />
    </>
  ),
}

export function CategoryIcon({ category, size = 22 }: { category: Category; size?: number }) {
  return (
    <svg
      className="category-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyphs[category]}
    </svg>
  )
}
