import Box from '@mui/material/Box'
import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Button from '@mui/material/Button'
import ListCards from './ListCards/ListCards'
import theme from '~/theme'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { textColor } from '~/utils/constants'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useConfirm } from 'material-ui-confirm'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { Typography } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { Plus } from 'lucide-react'
import { updateColumnDetailsAPI } from '~/apis/columns'
import { handleError } from '~/utils/messageHelper'

function Column({
  column,
  createNewCard,
  deleteColumnDetails,
  boardState,
  isBoardClosed,
  fetchBoarData,
  isOverlay,
  setBoard,
  board
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyless = {
    /**
     * Su dung CSS.Tranform se sinh ra bug bang bi keo dai va xau
     * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
     */
    // touchAction: 'none', // Danh cho sensor default dang PointerSensor
    transform: CSS.Translate.toString(transform),
    transition,
    // height max 100% boi vi neu khong thi se co loi column ngan thi phai keo tu phan giua, them do la {...listeners} trong box chu khong phai trong div
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isOverlay ? 500 : 'auto'
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const orderedCards = column?.cards || []
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [columnTitle, setColumnTitle] = useState(column?.title || '')

  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Không được để trống')
      return
    }
    if (newCardTitle.length > 50) {
      toast.error('Tiêu đề không được quá 50 kí tự')
      return
    }
    // Goi API o day
    // Tao du lieu Card goi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    createNewCard(newCardData)
    setNewCardTitle('')
  }

  const handleUpdateColumnTitle = async () => {
    try {
      await updateColumnDetailsAPI(column._id, { title: columnTitle.trim() })
      setIsEditingTitle(false)
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard }
        const columnIndex = newBoard.columns.findIndex((col) => col._id === column._id)
        if (columnIndex !== -1) {
          newBoard.columns[columnIndex].title = columnTitle.trim()
        }
        return newBoard
      })
    } catch (error) {
      setColumnTitle(column?.title || '')
      setIsEditingTitle(false)
      handleError(error)
    }
  }

  const handleKeyDownForTitle = (event) => {
    if (event.key === 'Enter') {
      event.target.blur()
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addNewCard()
    }
    if (event.key === 'Escape') {
      toggleOpenNewCardForm()
      setNewCardTitle('')
    }
  }

  // Xu li xoa mot column va card ben trong no
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    handleClose()
    confirmDeleteColumn({
      title: 'Xóa cột',
      description: (
        <span>
          Bạn có chắc muốn xóa cột{' '}
          <span style={{ fontFamily: 'cursive', fontStyle: 'italic', color: 'purple' }}>{column?.title}</span> chứ?
        </span>
      ),
      confirmationText: 'Xóa',
      cancellationText: 'Hủy'

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
      // cancellationButtonProps: { color:'inherit' },

      // Con nhieu tinh nang muon thi tu tim hieu
    })
      .then(() => {
        deleteColumnDetails(column._id)
      })
      .catch(() => {})
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyless}>
      <Box
        sx={{
          minWidth: '270px',
          maxWidth: '270px',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#f2f3f5'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
          opacity: isOverlay ? 0.5 : undefined
        }}
      >
        {/* Box Column Header */}
        <Box
          sx={{
            p: 2,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {isEditingTitle ? (
            <TextField
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              onBlur={handleUpdateColumnTitle}
              onKeyDown={handleKeyDownForTitle}
              variant="outlined"
              size="small"
              sx={{
                minWidth: '180px',
                maxWidth: '180px'
              }}
              slotProps={{
                htmlInput: {
                  maxLength: 50
                }
              }}
            />
          ) : (
            <Typography
              sx={{ color: textColor, maxWidth: '204px', fontWeight: 600, breakAfter: 'always', overflow: 'hidden' }}
              onClick={() => setIsEditingTitle(true)}
            >
              {column?.title}
            </Typography>
          )}
          {!isBoardClosed && (
            <Box>
              <Tooltip title="More options">
                <ExpandMoreIcon
                  sx={{ color: textColor, cursor: 'pointer' }}
                  id="demo-positioned-dropdown"
                  aria-controls={open ? 'demo-positioned-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                disableRestoreFocus
                disableAutoFocusItem
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                slotProps={{
                  paper: {
                    sx: {
                      p: 0.5
                    }
                  }
                }}
              >
                <MenuItem onClick={handleDeleteColumn}>
                  <ListItemIcon>
                    <DeleteForeverIcon className="delete-forever-icon" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText sx={{ color: textColor }}>Xóa cột</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        {/* List Card */}
        <ListCards
          board={board}
          cards={orderedCards}
          boardState={boardState}
          isBoardClosed={isBoardClosed}
          fetchBoarData={fetchBoarData}
          setBoard={setBoard}
        />

        {/* Box Column Footer */}
        {(!isBoardClosed || isOverlay) && (
          <Box
            sx={{
              height: theme.trello.columnFooterHeight,
              p: 2
            }}
          >
            {!openNewCardForm ? (
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  startIcon={<Plus size={16} />}
                  onClick={toggleOpenNewCardForm}
                  sx={{
                    color: textColor,
                    borderColor: textColor,
                    width: '100%',
                    justifyContent: 'flex-start',
                    '&:hover': { backgroundColor: (theme) => theme.palette.action.hover }
                  }}
                >
                  Thêm mới
                </Button>
                <Box {...attributes} {...listeners}>
                  <DragIndicatorIcon sx={{ cursor: 'grab', color: textColor }} />
                </Box>
              </Box>
            ) : (
              <ClickAwayListener onClickAway={toggleOpenNewCardForm}>
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    gap: '1'
                  }}
                >
                  <TextField
                    label="Nhập tên thẻ..."
                    type="text"
                    size="small"
                    variant="outlined"
                    autoFocus
                    data-no-dnd="true"
                    value={newCardTitle}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      setNewCardTitle(e.target.value)
                    }}
                    sx={{
                      '& label': { color: 'text.primary' },
                      '& input': {
                        color: (theme) => theme.palette.primary.main,
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                      },
                      '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                        '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                        '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                      },
                      '& .MuiOutlinedInput-input': {
                        borderRadius: 1
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => {
                        addNewCard()
                        toggleOpenNewCardForm()
                      }}
                      sx={{
                        boxShadow: 'none',
                        border: '0.5px solid',
                        borderColor: (theme) => theme.palette.success.main,
                        '&:hover': { bgcolor: (theme) => theme.palette.success.main },
                        marginLeft: 1
                      }}
                    >
                      Thêm
                    </Button>
                    <CloseIcon
                      fontSize="small"
                      sx={{ color: (theme) => theme.palette.warning.light, cursor: 'pointer' }}
                      onClick={toggleOpenNewCardForm}
                    />
                  </Box>
                </Box>
              </ClickAwayListener>
            )}
          </Box>
        )}
      </Box>
    </div>
  )
}

export default Column
