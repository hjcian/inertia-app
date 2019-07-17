export const dataStore = {
    isStored: false,
    data: null,
    refresh() {
      this.isStored = false
      this.data = null
    },
    save(data) {
      this.isStored = true
      this.data = data
    }
  }