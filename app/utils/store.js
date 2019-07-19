import { parseCSV, isCSVFormatValid } from '../utils/firstrade'
import dump from '../utils/dump.json'
// const data = null
const data = parseCSV(dump)

export const dataStore = {
    isStored: false,
    data: data,
    refresh() {
      this.isStored = false
      this.data = null
    },
    save(data) {
      this.isStored = true
      this.data = data
      console.log('saved data: ', this.data)
    }
  }