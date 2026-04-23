import { type Dispatch, useState } from "react"

import { Checkbox, type CheckboxProps } from "./checkbox"
import { CheckboxEditor } from "./checkbox-editor"
import { hstack } from "../../../styles/stack"
import { cn } from "../../../utils/cn"
import { createId } from "../../../utils/create-id"
import { PenLineIcon, PlusIcon, TrashIcon, XIcon } from "../../icons"
import { AnimateHeight } from "../../utility/animate-height"
import { ErrorBoundary } from "../../utility/error-boundary"
import { showDialog } from "../dialog"
import { Divider } from "../divider"
import { IconButton } from "../icon-button"
import { TextInput } from "../text-input"

type ChecklistItem = Pick<CheckboxProps, "label" | "checked"> & { id: string }

interface AddNewItemProps {
  onAdd: Dispatch<ChecklistItem>
}
const AddNewItem = ({ onAdd }: AddNewItemProps) => {
  const [label, setLabel] = useState("")

  const addItem = () => {
    onAdd({ id: createId(), checked: false, label })
    setLabel("")
  }

  return (
    <div className={cn(hstack({ gap: 2 }), "relative")}>
      <TextInput
        placeholder="Todo label"
        value={label}
        onChange={setLabel}
        onKeyDown={({ key }) => key === "Enter" && addItem()}
        className="pr-7"
      />
      <IconButton
        className="absolute top-1 right-1"
        icon={PlusIcon}
        title="Add todo"
        onClick={addItem}
        size="sm"
        disabled={!label}
      />
    </div>
  )
}

interface ChecklistHeaderProps extends AddNewItemProps {
  title: string
  setIsEditing: Dispatch<boolean>
  isEditing: boolean
}
const ChecklistHeader = ({
  title,
  onAdd,
  isEditing,
  setIsEditing,
}: ChecklistHeaderProps) => (
  <>
    <div className={cn(hstack({ align: "center" }), "h-8 pl-2")}>
      <span className="flex-1 text-lg">{title}</span>
      <IconButton
        icon={isEditing ? XIcon : PenLineIcon}
        iconColor={isEditing ? "default" : "gentle"}
        title="Toggle editing"
        onClick={() => setIsEditing(!isEditing)}
        size="sm"
        className={cn(
          !isEditing &&
            "[[data-checklist]:not(:hover,:has(*:focus-visible))_&]:hidden"
        )}
      />
    </div>
    <AnimateHeight duration={200} className="-mx-1">
      <div className="p-1">
        {isEditing && (
          <div className="py-1">
            <AddNewItem onAdd={onAdd} />
          </div>
        )}
      </div>
    </AnimateHeight>
    <Divider className="mb-2" color="gentle" />
  </>
)

interface ChecklistProps {
  title: string
  noItemsLabel?: string
  items: ChecklistItem[]
  onChange: Dispatch<ChecklistItem[]>
}
export const Checklist = ({
  title,
  noItemsLabel = "The list is currently empty",
  items,
  onChange,
}: ChecklistProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (data: Partial<ChecklistItem>) => {
    onChange(
      items.map(item => (item.id !== data.id ? item : { ...item, ...data }))
    )
  }

  const handleDelete = ({ id, label }: ChecklistItem) => {
    showDialog({
      title: "Delete checklist item",
      description: `Do you really want to delete the item with the description "${label}"? This action cannot be undone.`,
      confirm: {
        caption: "Delete",
        look: "destructive",
        onClick: () => onChange(items.filter(item => item.id !== id)),
      },
    })
  }

  return (
    <ErrorBoundary>
      <div data-checklist>
        <ChecklistHeader
          title={title}
          onAdd={item => onChange([...items, item])}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
        {items.length === 0 ? (
          <div className="grid place-items-center pt-2 pb-4 text-text-gentle">
            {noItemsLabel}
          </div>
        ) : (
          <ul className="space-y-1">
            {items.map(item =>
              isEditing ? (
                <li key={item.id} className="relative">
                  <CheckboxEditor
                    placeholder="Start typing..."
                    label={item.label}
                    checked={item.checked}
                    onLabelChange={label => handleChange({ ...item, label })}
                    onCheckedChange={checked =>
                      handleChange({ ...item, checked })
                    }
                    className="pr-10"
                  />
                  <IconButton
                    icon={TrashIcon}
                    title="Delete item"
                    hideTitle
                    size="sm"
                    iconColor="gentle"
                    onClick={() => handleDelete(item)}
                    className="absolute top-1 right-1 [:not(:hover,:has(*:focus-visible))>&]:opacity-0"
                  />
                </li>
              ) : (
                <li key={item.id}>
                  <Checkbox
                    label={item.label}
                    checked={item.checked}
                    onCheckedChange={checked =>
                      handleChange({ ...item, checked })
                    }
                  />
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </ErrorBoundary>
  )
}
