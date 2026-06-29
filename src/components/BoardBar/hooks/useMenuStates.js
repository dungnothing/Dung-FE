import { useState } from 'react'

export const useMenuStates = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElMore, setAnchorElMore] = useState(null)
  const [open, setOpen] = useState(false)
  const [anchorFilter, setAnchorFilter] = useState(false)

  const closeAllMenus = () => {
    setAnchorEl(null)
    setAnchorElMore(null)
    setOpen(false)
    setAnchorFilter(false)
  }

  return {
    anchorEl,
    setAnchorEl,
    anchorElMore,
    setAnchorElMore,
    open,
    setOpen,
    anchorFilter,
    setAnchorFilter,
    closeAllMenus
  }
}
