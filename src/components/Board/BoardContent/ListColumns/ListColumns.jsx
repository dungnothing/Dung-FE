import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { textColor } from '~/utils/constants'
import ClickAwayListener from '@mui/material/ClickAwayListener'

function ListColumns({
  board,
  columns,
  createNewColumn,
  createNewCard,
  deleteColumnDetails,
  boardState,
  fetchBoarData,
  permissions,
  setBoard
}) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Không được để trống')
      return
    }
    if (newColumnTitle.length > 50) {
      toast.error('Tiêu đề không được quá 50 kí tự')
      return
    }
    setOpenNewColumnForm(false)
    const newColumnData = {
      title: newColumnTitle
    }
    createNewColumn(newColumnData)
    setNewColumnTitle('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addNewColumn()
    }
    if (event.key === 'Escape') {
      setOpenNewColumnForm(false)
      setNewColumnTitle('')
    }
  }

  return (
    <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 1 }
        }}
      >
        {columns?.map((column) => (
          <Column
            board={board}
            key={column._id}
            column={column}
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
            boardState={boardState}
            fetchBoarData={fetchBoarData}
            permissions={permissions}
            setBoard={setBoard}
          />
        ))}
        {/* Add new column .... */}
        {!openNewColumnForm ? (
          permissions?.CREATE_COLUMN &&
          boardState === 'OPEN' && (
            <Box
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333446' : '#AAABAF'),
                '&:hover': { bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : '#DED3C4') }
              }}
            >
              <Button
                startIcon={<AddBoxIcon />}
                sx={{
                  color: textColor,
                  width: '100%',
                  justifyContent: 'flex-start',
                  pl: 2.5,
                  py: 1
                }}
                onClick={() => setOpenNewColumnForm(true)}
              >
                Thêm cột mới
              </Button>
            </Box>
          )
        ) : (
          <ClickAwayListener
            onClickAway={() => {
              if (!newColumnTitle) setOpenNewColumnForm(false)
            }}
          >
            <Box
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                p: 1,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333446' : '#DED3C4'),
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <TextField
                label="Nhập tiêu đề cột..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                value={newColumnTitle}
                onChange={(e) => {
                  setNewColumnTitle(e.target.value)
                }}
                onKeyDown={handleKeyDown}
                sx={{
                  '& label': { color: textColor },
                  '& input': { color: textColor },
                  '& label.Mui-focused': { color: textColor },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: textColor },
                    '&:hover fieldset': { borderColor: textColor },
                    '&.Mui-focused fieldset': { borderColor: textColor }
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => {
                    addNewColumn()
                    setOpenNewColumnForm(false)
                  }}
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >
                  Thêm
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: textColor,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: (theme) => theme.palette.warning.main }
                  }}
                  onClick={() => setOpenNewColumnForm(false)}
                />
              </Box>
            </Box>
          </ClickAwayListener>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
