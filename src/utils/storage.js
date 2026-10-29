export function getData(key, fallback = null) {
  try {
    const value = localStorage.getItem(`hostelhub_${key}`)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

export function setData(key, value) {
  localStorage.setItem(`hostelhub_${key}`, JSON.stringify(value))
  return value
}

export function removeData(key) {
  localStorage.removeItem(`hostelhub_${key}`)
}