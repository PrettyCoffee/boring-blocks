import { screen } from "test"

const getIconName = (icon: HTMLElement) => icon.dataset["icon"]
const getAllIcons = () => screen.queryAllByRole("img", { hidden: true })
const filterIconByName = (name: string) => (icon: HTMLElement) =>
  getIconName(icon) === name

export const queryAllByIconName = (name: string) =>
  getAllIcons().filter(filterIconByName(name))

export const queryByIconName = (name: string) =>
  queryAllByIconName(name)[0] ?? null

export const getAllByIconName = (name: string) => {
  const icons = getAllIcons()
  const matches = icons.filter(filterIconByName(name))
  if (matches.length === 0) {
    const availableIcons = [...new Set(icons.map(getIconName))].join(", ")
    throw new Error(
      `Could not find an icon with name "${name}". Available icons: ${availableIcons || "none"}`
    )
  }
  return matches as [HTMLElement, ...HTMLElement[]]
}

export const getByIconName = (name: string) => {
  const matches = getAllByIconName(name)
  if (matches.length !== 1) {
    throw new Error(`Found ${matches.length} icons with the name "${name}".`)
  }
  return matches[0]
}

export const iconMatchers = {
  queryAllByIconName,
  queryByIconName,
  getAllByIconName,
  getByIconName,
}
