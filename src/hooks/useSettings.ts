import { useState, useEffect } from 'react'

export interface AppSettings {
  compact: boolean
  auditDigest: boolean
  reduceMotion: boolean
  darkMode: boolean
}

const DEFAULTS: AppSettings = { compact: false, auditDigest: true, reduceMotion: false, darkMode: false }
const KEY = 'lv_settings'
const EVENT = 'lv-settings-change'

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch { return DEFAULTS }
}

function applyReduceMotion(on: boolean) {
  document.documentElement.setAttribute('data-reduce-motion', String(on))
}

function applyDarkMode(on: boolean) {
  document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light')
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  useEffect(() => {
    applyReduceMotion(settings.reduceMotion)
    applyDarkMode(settings.darkMode)

    const handler = () => {
      const next = loadSettings()
      setSettings(next)
      applyReduceMotion(next.reduceMotion)
      applyDarkMode(next.darkMode)
    }
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
  }, [])

  const update = (key: keyof AppSettings, value: boolean) => {
    const next = { ...settings, [key]: value }
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(EVENT))
    setSettings(next)
    if (key === 'reduceMotion') applyReduceMotion(value)
    if (key === 'darkMode') applyDarkMode(value)
  }

  return { settings, update }
}
