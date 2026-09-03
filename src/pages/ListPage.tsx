import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import { useList } from '../hooks/useList'
import { useProfiles } from '../hooks/useProfiles'
import { useMembers } from '../hooks/useMembers'
import { ItemDetail } from '../components/ItemDetail'
import { ItemRow } from '../components/ItemRow'
import { QuickAdd } from '../components/QuickAdd'
import { SharePanel } from '../components/SharePanel'
import { fieldLabels } from '../lib/presets'
import type { Item, QuickAddField } from '../lib/types'

export function ListPage({ userId }: { userId: string }) {
  const { listId } = useParams<{ listId: string }>()
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  const [editingFields, setEditingFields] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [inviteNotice, setInviteNotice] = useState<string | null>(null)
  const navigate = useNavigate()
  const { list, error: listError, updateList } = useList(listId!)
  const { items, loading, error, addItem, updateItem, toggleItem, deleteItem, moveItem } = useItems(
    listId!,
    userId,
  )
  const { names, error: namesError } = useProfiles()
  const {
    memberIds,
    error: membersError,
    addMemberByEmail,
    removeMember,
  } = useMembers(listId!)

  // Attribution is shown only for items somebody else added.
  function authorName(item: Item) {
    return item.created_by && item.created_by !== userId ? names[item.created_by] : undefined
  }

  // Only an account that already exists can be added to the list.
  async function invite(email: string) {
    const added = await addMemberByEmail(email)
    setInviteNotice(added ? 'Listo, ya tiene la lista.' : 'No hay ninguna cuenta con ese email.')
    return added
  }

  // Leaving the list means losing access to it.
  async function remove(memberId: string) {
    await removeMember(memberId)
    if (memberId === userId) navigate('/')
  }

  function toggleField(field: QuickAddField) {
    const fields = list!.quick_add_fields.includes(field)
      ? list!.quick_add_fields.filter((value) => value !== field)
      : [...list!.quick_add_fields, field]
    updateList({ quick_add_fields: fields })
  }

  if (listError) return <p className="error">{listError}</p>
  if (loading || !list) return <p className="notice">Cargando…</p>

  const open = items.filter((item) => !item.done_at)
  const ordered = list.sort_by_priority
    ? [...open].sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity))
    : open
  const done = items.filter((item) => item.done_at)
  const openItem = items.find((item) => item.id === openItemId)

  return (
    <div className="stack">
      <header className="row">
        <Link to="/" className="ghost">
          ←
        </Link>
        <h1>{list.name}</h1>
        <button className="ghost" onClick={() => setSharing(!sharing)}>
          Compartir
        </button>
        <button className="ghost" onClick={() => setEditingFields(!editingFields)}>
          Campos
        </button>
        <button
          className="toggle"
          onClick={() => updateList({ sort_by_priority: !list.sort_by_priority })}
        >
          {list.sort_by_priority ? '↓ Prioridad' : '↕ Manual'}
        </button>
      </header>

      {error && <p className="error">{error}</p>}
      {namesError && <p className="error">{namesError}</p>}
      {membersError && <p className="error">{membersError}</p>}

      {sharing && (
        <SharePanel
          memberIds={memberIds}
          names={names}
          currentUserId={userId}
          notice={inviteNotice}
          onInvite={invite}
          onRemove={remove}
        />
      )}

      {editingFields && (
        <div className="fields">
          {Object.entries(fieldLabels).map(([field, label]) => (
            <label key={field}>
              <input
                type="checkbox"
                checked={list.quick_add_fields.includes(field as QuickAddField)}
                onChange={() => toggleField(field as QuickAddField)}
              />
              {label}
            </label>
          ))}
        </div>
      )}

      <QuickAdd fields={list.quick_add_fields} onAdd={addItem} />

      <ul className="items">
        {ordered.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            authorName={authorName(item)}
            onToggle={() => toggleItem(item)}
            onOpen={() => setOpenItemId(item.id)}
            onMoveUp={
              index && !list.sort_by_priority
                ? () => moveItem(item.id, ordered[index - 2], ordered[index - 1])
                : undefined
            }
          />
        ))}
      </ul>

      {done.length > 0 && (
        <section className="history">
          <h2>Historial</h2>
          <ul className="items">
            {done.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                authorName={authorName(item)}
                onToggle={() => toggleItem(item)}
                onOpen={() => setOpenItemId(item.id)}
              />
            ))}
          </ul>
        </section>
      )}

      {openItem && (
        <ItemDetail
          item={openItem}
          onUpdate={(patch) => updateItem(openItem.id, patch)}
          onDelete={() => {
            deleteItem(openItem.id)
            setOpenItemId(null)
          }}
          onClose={() => setOpenItemId(null)}
        />
      )}
    </div>
  )
}
