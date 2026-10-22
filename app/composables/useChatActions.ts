import { LazyModalConfirm, LazyModalRename } from '#components'

interface ChatListItem {
  id: string
  label: string
  to: string
  icon?: string
  createdAt: string | Date
}

export function useChatActions() {
  const toast = useToast()
  const overlay = useOverlay()
  const { t } = useI18n()
  // Mutations carry the CSRF token header
  const { $csrfFetch } = useNuxtApp()

  const renameModal = overlay.create(LazyModalRename)
  const deleteModal = overlay.create(LazyModalConfirm, {
    props: {
      title: t('chat.ui.delete_title'),
      description: t('chat.ui.delete_description'),
      color: 'error',
    },
  })

  async function renameChat(id: string, currentTitle?: string | null): Promise<string | null> {
    const instance = renameModal.open({ title: currentTitle ?? '' })
    const result = await instance.result

    if (!result || result === currentTitle) return null

    try {
      await $csrfFetch(`/api/chats/${id}/title`, {
        method: 'PATCH' as never,
        body: { title: result },
      })

      const chatsCache = useNuxtData<ChatListItem[]>('chats')
      if (chatsCache.data.value) {
        chatsCache.data.value = chatsCache.data.value.map(c =>
          c.id === id ? { ...c, label: result } : c
        )
      }

      const chatCache = useNuxtData<{ title: string | null }>(`chat-${id}`)
      if (chatCache.data.value) {
        chatCache.data.value = { ...chatCache.data.value, title: result }
      }

      return result
    } catch {
      toast.add({
        description: t('chat.ui.rename_failed'),
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })

      return null
    }
  }

  async function deleteChat(id: string): Promise<boolean> {
    const instance = deleteModal.open()
    const result = await instance.result

    if (!result) return false

    try {
      await $csrfFetch(`/api/chats/${id}`, {
        method: 'DELETE' as never,
      })

      toast.add({
        title: t('chat.ui.deleted_title'),
        description: t('chat.ui.deleted_description'),
        icon: 'i-lucide-trash',
      })

      const chatsCache = useNuxtData<ChatListItem[]>('chats')
      if (chatsCache.data.value) {
        chatsCache.data.value = chatsCache.data.value.filter(c => c.id !== id)
      }

      // The caller leaves the deleted chat (the popup goes back to its list)
      return true
    } catch {
      toast.add({
        description: t('chat.ui.delete_failed'),
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })

      return false
    }
  }

  return {
    renameChat,
    deleteChat,
  }
}
