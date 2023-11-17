import { defineStore } from 'pinia'
import state from './store/state'
import getters from './store/getters'
import actions from './store/actions'

const useStore = defineStore('store', {
  state: () => state,
  getters,
  actions
})

export { useStore }
