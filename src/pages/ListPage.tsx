import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import { useListOptions } from '../hooks/useListOptions'
import { useList } from '../hooks/useList'
import { useProfiles } from '../hooks/useProfiles'
import { useMembers } from '../hooks/useMembers'
import { useInvites } from '../hooks/useInvites'
import { useHomeScreen } from '../hooks/useHomeScreen'
import { ItemDetail } from '../components/ItemDetail'
import { ItemRow } from '../components/ItemRow'
import { QuickAdd } from '../components/QuickAdd'
import { HomeScreenHint } from '../components/HomeScreenHint'
import { SharePanel } from '../components/SharePanel'
import { fieldLabels } from '../lib/presets'
import { inviteUrl } from '../lib/invites'
import { isStandalone } from '../lib/homescreen'
import { normalize } from '../lib/categorize'
import { listAsText } from '../lib/shareText'
import type { Item, QuickAddField } from '../lib/types'

// Checked items shown before the history asks to unfold further.
const HISTORY_PAGE = 20

export function ListPage({ userId }: { userId: string }) {
  const { listId } = useParams<{ listId: string }>()
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  const [editingFields, setEditingFields] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [inviteNotice, setInviteNotice] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [showingHint, setShowingHint] = useState(false)
  const [historyLimit, setHistoryLimit] = useState(HISTORY_PAGE)
  const [typed, setTyped] = useState('')
  const filter = useMemo(() => normalize(typed), [typed])
  const navigate = useNavigate()
  const { list, error: listError, updateList, deleteList } = useList(listId!)
  const {
    items,
    loading,
    error,
    online,
    pending,
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
    moveItem,
  } = useItems(listId!, userId)
  const {
    memberIds,
    error: membersError,
    load: reloadMembers,
    addMemberByEmail,
    removeMember,
  } = useMembers(listId!)
  const { names, error: namesError } = useProfiles(memberIds)
  const itemIds = useMemo(() => items.map((item) => item.id), [items])
  const { byItem: optionsByItem, error: optionsError } = useListOptions(listId!, itemIds)
  const {
    invites,
    error: invitesError,
    createInvite,
    inviteByEmail,
    revokeInvite,
  } = useInvites(listId!, userId)
  const homeScreen = useHomeScreen(listId!, list?.name ?? '')

  // The tab and the installed window carry the list's name.
  const listName = list?.name
  useEffect(() => {
    if (listName) document.title = listName
    return () => {
      document.title = 'Z-list'
    }
  }, [listName])

  // Attribution is shown only for items somebody else added.
  function authorName(item: Item) {
    return item.created_by && item.created_by !== userId ? names[item.created_by] : undefined
  }

  // An account already open joins on the spot; one that does not exist gets a mail.
  async function invite(email: string) {
    if (await addMemberByEmail(email)) {
      setInviteNotice('Listo, ya tiene la lista.')
      return true
    }
    const mailed = await inviteByEmail(email)
    if (mailed) {
      setInviteNotice(`Le mandamos un mail a ${email} para que cree su cuenta.`)
      await reloadMembers()
    }
    return mailed
  }

  // WhatsApp carries a link that opens this invitation alone, revocable from the panel.
  async function shareOnWhatsApp() {
    const token = await createInvite()
    if (!token) return
    const text = `Te comparto la lista "${list!.name}": ${inviteUrl(token)}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  // The open items as text, through the share sheet or the clipboard.
  async function shareAsText() {
    const text = listAsText(list!.name, open)
    if (navigator.share) await navigator.share({ text }).catch(() => undefined)
    else {
      await navigator.clipboard.writeText(text)
      setInviteNotice('Lista copiada como texto.')
    }
  }

  // Leaving the list means losing access to it.
  async function remove(memberId: string) {
    await removeMember(memberId)
    if (memberId === userId) navigate('/')
  }

  // Deleting takes the list away from everyone, so it asks once before going.
  async function removeList() {
    if (await deleteList()) navigate('/')
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
  // The history reads newest first, so the last tick lands right under the open zone.
  const done = items
    .filter((item) => item.done_at)
    .sort((a, b) => b.done_at!.localeCompare(a.done_at!))
  // What is being typed to add also narrows both zones to the names containing it.
  const shown = (zone: Item[]) => zone.filter((item) => normalize(item.name).includes(filter))
  const visibleOpen = shown(ordered)
  const visibleDone = shown(done)
  const openItem = items.find((item) => item.id === openItemId)
  // An occurrence that already spawned its copy is a closed record and cannot reopen.
  const copied = new Set(items.map((item) => item.source_item_id))

  return (
    <div className="stack">
      <header className="row">
        <Link to="/" className="ghost" aria-label="Volver">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <h1>{list.name}</h1>
        <div className="row actions">
          <button className="ghost" onClick={() => setSharing(!sharing)}>
            Compartir
          </button>
          <button className="ghost" onClick={() => setEditingFields(!editingFields)}>
            Campos
          </button>
          {!isStandalone() && (
            <button
              className="ghost"
              onClick={() =>
                homeScreen.canInstall ? homeScreen.install() : setShowingHint(!showingHint)
              }
            >
              Instalar
            </button>
          )}
          <button
            className="toggle"
            onClick={() => updateList({ sort_by_priority: !list.sort_by_priority })}
          >
            {list.sort_by_priority ? '↓ Prioridad' : '↕ Manual'}
          </button>
        </div>
      </header>

      {!online && (
        <p className="notice">
          {pending
            ? `Sin conexión: ${pending} ${pending === 1 ? 'cambio guardado' : 'cambios guardados'} acá, se mandan cuando vuelva.`
            : 'Sin conexión. Lo que cambies se manda cuando vuelva.'}
        </p>
      )}

      {error && <p className="error">{error}</p>}
      {namesError && <p className="error">{namesError}</p>}
      {optionsError && <p className="error">{optionsError}</p>}
      {membersError && <p className="error">{membersError}</p>}
      {invitesError && <p className="error">{invitesError}</p>}

      {showingHint && <HomeScreenHint />}

      {sharing && (
        <SharePanel
          memberIds={memberIds}
          names={names}
          currentUserId={userId}
          ownerId={list.created_by}
          invites={invites}
          notice={inviteNotice}
          onInvite={invite}
          onShareOnWhatsApp={shareOnWhatsApp}
          onShareAsText={shareAsText}
          onRevoke={revokeInvite}
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

      <QuickAdd fields={list.quick_add_fields} onAdd={addItem} onTyping={setTyped} />

      {!items.length && <p className="muted">La lista está vacía. Agregá algo arriba.</p>}
      {filter && !visibleOpen.length && !visibleDone.length && (
        <p className="muted">Nada con ese nombre. Enter lo agrega.</p>
      )}

      <ul className="items">
        {visibleOpen.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            options={optionsByItem[item.id]}
            authorName={authorName(item)}
            onToggle={() => toggleItem(item)}
            onOpen={() => setOpenItemId(item.id)}
            onMoveUp={
              index && !list.sort_by_priority && !filter
                ? () => moveItem(item.id, ordered[index - 2], ordered[index - 1])
                : undefined
            }
            onMoveDown={
              index < ordered.length - 1 && !list.sort_by_priority && !filter
                ? () => moveItem(item.id, ordered[index + 1], ordered[index + 2])
                : undefined
            }
          />
        ))}
      </ul>

      {visibleDone.length > 0 && (
        <section className="history">
          <h2>Historial</h2>
          <ul className="items">
            {visibleDone.slice(0, historyLimit).map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                options={optionsByItem[item.id]}
                authorName={authorName(item)}
                onToggle={copied.has(item.id) ? undefined : () => toggleItem(item)}
                onOpen={() => setOpenItemId(item.id)}
              />
            ))}
          </ul>
          {visibleDone.length > historyLimit && (
            <button
              className="ghost history-more"
              onClick={() => setHistoryLimit(historyLimit + HISTORY_PAGE)}
            >
              Ver {Math.min(HISTORY_PAGE, visibleDone.length - historyLimit)} más
            </button>
          )}
        </section>
      )}

      {list.created_by === userId &&
        (confirmingDelete ? (
          <div className="row">
            <button className="danger" onClick={removeList}>
              Borrar la lista y todo lo que tiene
            </button>
            <button className="ghost" onClick={() => setConfirmingDelete(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <button className="danger" onClick={() => setConfirmingDelete(true)}>
            Borrar la lista
          </button>
        ))}

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
