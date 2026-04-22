const getLocalStorage = (key: string) => {
  const value = window.localStorage.getItem(key)
  if (!value) return null
  return value
}

const setLocalStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value)
}

export { getLocalStorage, setLocalStorage }
