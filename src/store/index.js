import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const modules = (() => {
  /**
   * Add store module in the /store directory and it will automatically
   * read it and load it with the name of the file as the module name
   */
  const requireState = require.context("@/store", false, /(?<!index).js$/)
  let modules = {}

  requireState.keys().forEach(fileName => {
    const moduleName = fileName.split("/")[1].split(".")[0]
    const module = requireState(fileName).default

    modules = {
      ...modules,
      [moduleName]: module
    }
  })

  return modules
})()

export default new Vuex.Store({
  modules,
})