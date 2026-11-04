import { useState, useMemo } from 'react'
import styles from './CheckboxTree.module.css'
import { Checkbox } from '../Checkbox'
import { LinkButton } from '../LinkButton'
import type { TreeItem, CheckboxTreeProps } from './types'

const TreeItemComponent = ({
  item,
  selectedIds,
  expandedIds,
  onToggleExpand,
  onToggleCheck,
}: {
  item: TreeItem
  selectedIds: string[]
  expandedIds: string[]
  onToggleExpand: (id: string) => void
  onToggleCheck: (id: string, isChecked: boolean) => void
}) => {
  const hasChildren = item.children && item.children.length > 0
  const isExpanded = expandedIds.includes(item.id)

  const childIds = useMemo(() => {
    return item.children?.map((child) => child.id) || []
  }, [item.children])

  const selectedChildrenCount = childIds.filter((id) => selectedIds.includes(id)).length

  const isChecked = hasChildren
    ? selectedChildrenCount === childIds.length && childIds.length > 0
    : selectedIds.includes(item.id)

  const isIndeterminate = hasChildren
    ? selectedChildrenCount > 0 && selectedChildrenCount < childIds.length
    : false

  return (
    <div className={styles.itemWrapper}>
      <div className={styles.itemRow}>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            label={item.label}
            checked={isChecked}
            indeterminate={isIndeterminate}
            onChange={(e) => onToggleCheck(item.id, e.target.checked)}
          />
        </div>
        {hasChildren && (
          <LinkButton
            isOpen={isExpanded}
            onClick={() => onToggleExpand(item.id)}
            aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            <span className={styles.hiddenLabel} />
          </LinkButton>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className={styles.childrenList}>
          {item.children!.map((child) => (
            <TreeItemComponent
              key={child.id}
              item={child}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onToggleCheck={onToggleCheck}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const CheckboxTree = ({
  title,
  items,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onChange,
  className,
  showAllLabel = 'Все категории',
  hideLabel = 'Скрыть категории',
}: CheckboxTreeProps) => {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultSelectedIds)
  const selectedIds = controlledSelectedIds ?? internalSelectedIds
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [isShowAll, setIsShowAll] = useState(false)

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleCheck = (id: string, isChecked: boolean) => {
    const item = findItemById(items, id)
    if (!item) return

    let newSelectedIds = [...selectedIds]

    if (item.children && item.children.length > 0) {
      const childIds = item.children.map((child) => child.id)
      if (isChecked) {
        childIds.forEach((childId) => {
          if (!newSelectedIds.includes(childId)) newSelectedIds.push(childId)
        })
      } else {
        newSelectedIds = newSelectedIds.filter((selectedId) => !childIds.includes(selectedId))
      }
    } else {
      if (isChecked) {
        if (!newSelectedIds.includes(id)) newSelectedIds.push(id)
      } else {
        newSelectedIds = newSelectedIds.filter((selectedId) => selectedId !== id)
      }
    }

    if (controlledSelectedIds === undefined) {
      setInternalSelectedIds(newSelectedIds)
    }
    onChange?.(newSelectedIds)
  }

  const visibleItems = isShowAll ? items : items.slice(0, 5)
  const hasMore = items.length > 5

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={styles.tree}>
        {visibleItems.map((item) => (
          <TreeItemComponent
            key={item.id}
            item={item}
            selectedIds={selectedIds}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
            onToggleCheck={handleToggleCheck}
          />
        ))}
      </div>

      {hasMore && (
        <LinkButton
          isOpen={isShowAll}
          onClick={() => setIsShowAll((prev) => !prev)}
          className={styles.showAll}
        >
          {isShowAll ? hideLabel : showAllLabel}
        </LinkButton>
      )}
    </div>
  )
}

function findItemById(items: TreeItem[], id: string): TreeItem | undefined {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findItemById(item.children, id)
      if (found) return found
    }
  }
  return undefined
}