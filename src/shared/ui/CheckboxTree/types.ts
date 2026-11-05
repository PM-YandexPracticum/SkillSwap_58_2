export type TreeItem = {
  id: string
  label: string
  children?: TreeItem[]
}

export interface CheckboxTreeProps {
  title?: string
  items: TreeItem[]
  selectedIds?: string[]
  defaultSelectedIds?: string[]
  onChange?: (selectedIds: string[]) => void
  className?: string
  showAllLabel?: string
  hideLabel?: string
}