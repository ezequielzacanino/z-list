import { categorize } from './categorize'
import type { Category, Item } from './types'

// Aisle names, in the order a shop is usually walked.
export const aisleLabels: Record<Category, string> = {
  fruta: 'Frutas',
  verdura: 'Verduras',
  carne: 'Carnes',
  pescado: 'Pescados',
  lacteos: 'Lácteos',
  panaderia: 'Panadería',
  almacen: 'Almacén',
  bebidas: 'Bebidas',
  limpieza: 'Limpieza',
  higiene: 'Higiene',
  hogar: 'Hogar',
  ropa: 'Ropa',
  mascota: 'Mascotas',
  tecnologia: 'Tecnología',
  papeleria: 'Librería',
  generico: 'Otros',
}

// Items grouped by aisle, keeping their order inside each group.
export function groupByAisle(items: Item[]) {
  return (Object.keys(aisleLabels) as Category[])
    .map((category) => ({
      category,
      items: items.filter((item) => categorize(item.name) === category),
    }))
    .filter((group) => group.items.length)
}
