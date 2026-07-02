import { Dialog, Box, Typography, IconButton, TextField, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { createNewBoardAPI, getListBackgroundAPI, addRecentBoardAPI, cloneTemplateAPI } from '~/apis/boards'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { handleError } from '~/utils/messageHelper'

function CreateBoard({ open, onClose, templateId = null }) {
  const navigate = useNavigate()
  const [listBackground, setListBackground] = useState([])
  const [loading, setLoading] = useState(false)

  // Visibility hien tam co dinh PRIVATE. Feature SHOWCASE/WORKSPACE lam sau, khong gui field tu FE.
  const defaultValues = {
    title: '',
    boardBackground: ''
  }

  const form = useForm({
    defaultValues,
    mode: 'all'
  })

  useEffect(() => {
    const loadListBackground = async () => {
      if (!open) return
      try {
        const listBackgroundData = await getListBackgroundAPI()
        setListBackground(listBackgroundData)

        form.reset({
          ...form.getValues(),
          boardBackground: listBackgroundData?.[0]?.url
        })
      } catch (error) {
        handleError(error, 'Có lỗi xảy ra khi tải danh sách background')
      }
    }
    loadListBackground()
  }, [form, open])

  const handleCreateNewBoard = async (data) => {
    try {
      setLoading(true)
      let newBoard
      if (templateId) {
        newBoard = await cloneTemplateAPI({
          templateId,
          title: data.title,
          boardBackground: data.boardBackground
        })
      } else {
        newBoard = await createNewBoardAPI({
          title: data.title,
          boardBackground: data.boardBackground
        })
      }

      await addRecentBoardAPI(newBoard._id)
      navigate(`/boards/${newBoard._id}`)
      toast.success('Tạo bảng mới thành công!')
    } catch (error) {
      handleError(error, 'Lỗi khi tạo bảng mới')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseDialog = () => {
    onClose()
    form.reset(defaultValues)
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      sx={{
        '& .MuiDialog-paper': {
          height: { xs: 'auto', sm: '400px' },
          width: { xs: '100%', sm: '520px' },
          borderRadius: '10px'
        }
      }}
      form={form}
    >
      <Box
        sx={{ px: 3, py: 2, flexDirection: 'column', gap: 2, display: 'flex' }}
        component="form"
        onSubmit={form.handleSubmit(handleCreateNewBoard)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Tạo bảng</Typography>
          <IconButton disableRipple onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle2">Phông nền</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {listBackground.map((bg, index) => {
            const isSelected = form.watch('boardBackground') === bg.url
            return (
              <Box
                key={index}
                onClick={() => form.setValue('boardBackground', bg.url)}
                sx={{
                  width: 60,
                  height: 40,
                  borderRadius: '6px',
                  backgroundImage: `url(${bg.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: isSelected ? '3px solid #1976d2' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            )
          })}
        </Box>
        <Typography variant="subtitle2">
          Tiêu đề bảng (tối thiểu 3 ký tự) <span className="text-red-500">*</span>
        </Typography>
        <TextField
          fullWidth
          autoFocus
          value={form.watch('title')}
          onChange={(e) => form.setValue('title', e.target.value)}
          sx={{ width: '100%' }}
        />

        <div className="flex justify-end w-full">
          <Button
            variant="outlined"
            type="submit"
            disabled={form.watch('title').length < 3 || loading}
            sx={{
              color: textColor,
              borderColor: textColor,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              minWidth: 'auto',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            Tạo mới
          </Button>
        </div>
      </Box>
    </Dialog>
  )
}

export default CreateBoard
