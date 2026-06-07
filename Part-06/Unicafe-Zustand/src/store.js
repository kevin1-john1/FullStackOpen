import { create } from 'zustand'

const useFeedbackStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    giveGood: () => set(state => ({ good: state.good + 1 })),
    giveNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    giveBad: () => set(state => ({ bad: state.bad + 1 })),
  },
}))

export const useGood = () => useFeedbackStore(state => state.good)
export const useNeutral = () => useFeedbackStore(state => state.neutral)
export const useBad = () => useFeedbackStore(state => state.bad)
export const useFeedbackActions = () => useFeedbackStore(state => state.actions)