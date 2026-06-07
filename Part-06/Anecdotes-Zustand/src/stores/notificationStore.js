import { create } from 'zustand'

let timerId = null

const useNotificationStore = create(set => ({
  notification: '',
  actions: {
    showNotification: message => {
      set(() => ({ notification: message }))

      clearTimeout(timerId)

      timerId = setTimeout(() => {
        set(() => ({ notification: '' }))
      }, 5000)
    },
  },
}))

export const useNotification = () =>
  useNotificationStore(state => state.notification)

export const useNotificationActions = () =>
  useNotificationStore(state => state.actions)

export default useNotificationStore