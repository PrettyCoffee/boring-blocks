import { type PropsWithChildren, useEffect, useMemo, useState } from "react"

import { type I18n, type MessageDescriptor, setupI18n } from "@lingui/core"

import { messages as de } from "./_de.json"
import { messages as en } from "./_en.json"
import { createContext } from "../utils/create-context"

const defaultLanguage = "en"
const catalog = { en, de }
const i18n = setupI18n({
  locales: Object.keys(catalog),
  locale: defaultLanguage,
  messages: catalog,
})

interface L10nProviderState {
  i18n: I18n
  locale: string
  language: "en" | "de"
}
const Context = createContext<L10nProviderState>("L10nProvider")

export const L10nProvider = ({
  locale,
  language: languageProp,
  children,
}: PropsWithChildren<Omit<L10nProviderState, "i18n">>) => {
  const language = languageProp in catalog ? languageProp : defaultLanguage
  const [activeLanguage, setActiveLanguage] = useState<"en" | "de">()

  useEffect(() => {
    i18n.activate(language)
    // enforce rerendering consumers when language changes
    setActiveLanguage(language)
  }, [language])

  return (
    <Context
      value={useMemo(
        () => ({ i18n, locale, language: activeLanguage ?? language }),
        [activeLanguage, language, locale]
      )}
    >
      {children}
    </Context>
  )
}

const useL10n = () => Context.useRequiredValue()

export const useLocale = () => useL10n().locale
export const useLanguage = () => useL10n().language

export function useTrans(): typeof i18n
export function useTrans(msg: MessageDescriptor): string
export function useTrans(msg?: MessageDescriptor) {
  const { i18n } = useL10n()
  if (msg) return i18n._(msg)
  return i18n
}
