import { screen } from "test"

const getIconName = (icon: HTMLElement) => icon.dataset["icon"]
const getAllIcons = () => screen.getAllByRole("img", { hidden: true })
const filterIconByName = (name: string) => (icon: HTMLElement) =>
  getIconName(icon) === name

export const queryAllIconsByName = (name: string) =>
  getAllIcons().filter(filterIconByName(name))

export const queryIconByName = (name: string) => queryAllIconsByName(name)[0]

export const getAllIconsByName = (name: string) => {
  const icons = getAllIcons()
  const matches = icons.filter(filterIconByName(name))
  if (matches.length === 0) {
    throw new Error(
      `Could not find an icon with name "${name}". Available icons: ${[...new Set(icons.map(getIconName))].join(", ")}`
    )
  }
  return matches as [HTMLElement, ...HTMLElement[]]
}

export const getIconByName = (name: string) => {
  const matches = getAllIconsByName(name)
  if (matches.length !== 1) {
    throw new Error(`Found ${matches.length} icons with the name "${name}".`)
  }
  return matches[0]
}

export const iconMatchers = {
  queryAllIconsByName,
  queryIconByName,
  getAllIconsByName,
  getIconByName,
}
