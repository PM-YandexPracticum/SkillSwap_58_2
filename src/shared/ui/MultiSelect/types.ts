export interface Option {
  id: string
  label: string
}

export interface MultiSelectProps {
  options: Option[]
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
  label?: string
  placeholder?: string
  className?: string
}