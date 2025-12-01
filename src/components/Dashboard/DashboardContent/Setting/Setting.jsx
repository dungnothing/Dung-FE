import { Box, Typography, Button } from '@mui/material'
import { deleteManyBoardAPI } from '~/apis/boards'
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { toast } from 'react-toastify'
import { textColor } from '~/utils/constants'

function Setting() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const handleDeleteAllBoard = async () => {
    try {
      await deleteManyBoardAPI()
      setOpenDeleteDialog(false)
      toast.success('Đã xóa hết bảng!')
    } catch (error) {
      toast.error('Lỗi rồi bạn hiền')
    }
  }

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        CÀI ĐẶT{' '}
      </Typography>
      <Typography variant="body6" sx={{ color: textColor }}>
        Xóa hết tất cả các bảng
      </Typography>
      <Button onClick={handleOpenDeleteDialog} variant="contained" sx={{ m: 2 }}>
        Xóa
      </Button>
      {/**Dialog xac nhan xoa */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ color: textColor }}>Xóa hết sạch sành sanh</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: textColor }}>
            Bạn có chắc chắn muốn xóa hết bảng không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAllBoard} color="error" autoFocus variant="contained">
            Xác nhận
          </Button>
          <Button onClick={handleCloseDeleteDialog} color="primary" variant="outlined">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Setting
