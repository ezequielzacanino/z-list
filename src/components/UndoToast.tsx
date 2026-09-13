export function UndoToast({ label, onUndo }: { label: string; onUndo: () => void }) {
  return (
    <div className="undo" role="status">
      <span>{label}</span>
      <button onClick={onUndo}>Deshacer</button>
    </div>
  )
}
