import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import { useListOptions } from '../hooks/useListOptions'
import { useList } from '../hooks/useList'
import { useProfiles } from '../hooks/useProfiles'
import { useMembers } from '../hooks/useMembers'
import { useInvites } from '../hooks/useInvites'
import { useHomeScreen } from '../hooks/useHomeScreen'
import { usePresence } from '../hooks/usePresence'
import { usePush } from '../hooks/usePush'
import { useAdditionNotices } from '../hooks/useAdditionNotices'
import { useUndo } from '../hooks/useUndo'
import { ItemDetail } from '../components/ItemDetail'
import { ItemRow } from '../components/ItemRow'
import { QuickAdd } from '../components/QuickAdd'
import { HomeScreenHint } from '../components/HomeScreenHint'
import { SharePanel } from '../components/SharePanel'
import { Logo } from '../components/Logo'
import { BudgetSummary } from '../components/BudgetSummary'
import { PlantBadge } from '../components/PlantBadge'
import { PresenceBar } from '../components/PresenceBar'
import { NoticeBell } from '../components/NoticeBell'
import { OpenItems } from '../components/OpenItems'
import { History } from '../components/History'
import { UndoToast } from '../components/UndoToast'
import { fieldLabels } from '../lib/presets'
import { inviteUrl } from '../lib/invites'
import { isStandalone } from '../lib/homescreen'
import { normalize } from '../lib/categorize'
import { listAsText } from '../lib/shareText'
import { feedback } from '../lib/feedback'
import { suggestions } from '../lib/suggest'
import { species } from '../plants/species'
import type { DragHandle, Item, QuickAddField, SortMode } from '../lib/types'

const nextMode: Record<SortMode, SortMode> = {
  manual: 'priority',
  priority: 'category',
  category: 'manual',
}

const modeLabels: Record<SortMode, string> = {
  manual: '↕ Manual',
  priority: '↓ Prioridad',
  category: '▦ Góndola',
}

export function ListPage({ userId }: { userId: string }) {
  const { listId } = useParams<{ listId: string }>()
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  const [editingFields, setEditingFields] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [inviteNotice, setInviteNotice] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [showingHint, setShowingHint] = useState(false)
  const [hidden, setHidden] = useState<string[]>([])
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
  const present = usePresence(listId!, userId)
  const push = usePush(userId)
  const notices = useAdditionNotices(listId!, userId)
  const undo = useUndo()

  // The tab and the installed window carry the list's name.
  const listName = list?.name
  useEffect(() => {
    if (listName) document.title = listName
    return () => {
      document.title = 'Z-list'
    }
  }, [listName])

  // Attribution is shown only for what somebody else did.
  function nameOfOther(id: string | null) {
    return id && id !== userId ? names[id] : undefined
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

  // Adding acknowledges itself with a short blip.
  async function add(...args: Parameters<typeof addItem>) {
    feedback('add')
    await addItem(...args)
  }

  // A past item comes back with what it carried last time.
  function addAgain(item: Item) {
    const { name, quantity, priority, notes, amount } = item
    return add({ name, quantity, priority, notes, amount })
  }

  // Checking the last open item earns its own cue.
  function toggle(item: Item) {
    if (item.done_at) feedback('uncheck')
    else feedback(open.length === 1 ? 'done' : 'check')
    toggleItem(item)
    undo.propose({
      label: item.done_at ? `Destildaste ${item.name}` : `Tildaste ${item.name}`,
      revert: () => updateItem(item.id, { done_at: item.done_at, checked_by: item.checked_by }),
    })
  }

  // The row disappears at once and the delete leaves only when the undo expires.
  function discard(item: Item) {
    setHidden((current) => [...current, item.id])
    setOpenItemId(null)
    undo.propose({
      label: `Borraste ${item.name}`,
      revert: () => setHidden((current) => current.filter((id) => id !== item.id)),
      commit: () => deleteItem(item.id),
    })
  }

  // Hearing about additions needs this device subscribed to notices first.
  async function toggleNotices() {
    if (!notices.enabled && !push.enabled) {
      await push.enable()
      if (Notification.permission !== 'granted') return
    }
    notices.toggle()
  }

  function reroll() {
    const step = 1 + Math.floor(Math.random() * (species.length - 1))
    updateList({ monster: (list!.monster + step) % species.length })
  }

  function drop(id: string, index: number) {
    if (ordered[index]?.id === id) return
    const rest = ordered.filter((item) => item.id !== id)
    moveItem(id, rest[index - 1], rest[index])
  }

  function toggleField(field: QuickAddField) {
    const fields = list!.quick_add_fields.includes(field)
      ? list!.quick_add_fields.filter((value) => value !== field)
      : [...list!.quick_add_fields, field]
    updateList({ quick_add_fields: fields })
  }

  if (listError) return <p className="error">{listError}</p>
  if (loading || !list) return <p className="notice">Cargando…</p>

  const kept = items.filter((item) => !hidden.includes(item.id))
  const open = kept.filter((item) => !item.done_at)
  const ordered =
    list.sort_mode === 'priority'
      ? [...open].sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity))
      : open
  // The history reads newest first, so the last tick lands right under the open zone.
  const done = kept
    .filter((item) => item.done_at)
    .sort((a, b) => b.done_at!.localeCompare(a.done_at!))
  // What is being typed to add also narrows both zones to the names containing it.
  const shown = (zone: Item[]) => zone.filter((item) => normalize(item.name).includes(filter))
  const visibleOpen = shown(ordered)
  const visibleDone = shown(done)
  const openItem = kept.find((item) => item.id === openItemId)
  // An occurrence that already spawned its copy is a closed record and cannot reopen.
  const copied = new Set(items.map((item) => item.source_item_id))
  const showsBudget =
    list.quick_add_fields.includes('amount') || kept.some((item) => item.amount !== null)

  function renderRow(item: Item, handle?: DragHandle) {
    return (
      <ItemRow
        key={item.id}
        item={item}
        options={optionsByItem[item.id]}
        authorName={nameOfOther(item.created_by)}
        checkerName={item.done_at ? nameOfOther(item.checked_by) : undefined}
        onToggle={copied.has(item.id) ? undefined : () => toggle(item)}
        onDelete={() => discard(item)}
        onOpen={() => setOpenItemId(item.id)}
        handle={handle}
      />
    )
  }

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
        <PlantBadge list={list} onReroll={reroll} />
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
          {push.supported && memberIds.length > 1 && (
            <NoticeBell enabled={notices.enabled} onToggle={toggleNotices} />
          )}
          <button
            className="toggle"
            onClick={() => updateList({ sort_mode: nextMode[list.sort_mode] })}
          >
            {modeLabels[list.sort_mode]}
          </button>
        </div>
      </header>

      {present.length > 0 && <PresenceBar userIds={present} names={names} />}

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
      {notices.error && <p className="error">{notices.error}</p>}
      {push.error && <p className="error">{push.error}</p>}

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

      {showsBudget && (
        <BudgetSummary
          items={kept}
          limit={list.budget_limit}
          onLimit={(limit) => updateList({ budget_limit: limit })}
        />
      )}

      <QuickAdd
        fields={list.quick_add_fields}
        suggestions={suggestions(kept, typed)}
        onAdd={add}
        onPick={addAgain}
        onTyping={setTyped}
      />

      {!kept.length && <p className="muted">La lista está vacía. Agregá algo arriba.</p>}
      {kept.length > 0 && !open.length && !filter && (
        <div className="all-done">
          <Logo size={3.5} />
          <p>Todo listo</p>
        </div>
      )}
      {filter && !visibleOpen.length && !visibleDone.length && (
        <p className="muted">Nada con ese nombre. Enter lo agrega.</p>
      )}

      <OpenItems
        items={visibleOpen}
        mode={list.sort_mode}
        draggable={list.sort_mode === 'manual' && !filter && visibleOpen.length > 1}
        renderRow={renderRow}
        onDrop={drop}
      />

      {visibleDone.length > 0 && (
        <History items={visibleDone} searching={Boolean(filter)} renderRow={renderRow} />
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
          onDelete={() => discard(openItem)}
          onClose={() => setOpenItemId(null)}
        />
      )}

      {undo.offer && <UndoToast label={undo.offer.label} onUndo={undo.undo} />}
    </div>
  )
}
