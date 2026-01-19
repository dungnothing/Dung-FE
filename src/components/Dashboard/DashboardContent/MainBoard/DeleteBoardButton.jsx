import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { deleteBoardAPI } from '~/apis/boards'
import useConfirmDialog from '~/helpers/hooks/useConfirmDialog'

function DeleteBoardButton({ boardId, boardTitle, onDeleteSuccess, setLoading }) {
  const handleDeleteBoard = async () => {
    try {
      setLoading(true)
      await deleteBoardAPI(boardId)
      toast.success('Xóa bảng thành công')

      // Gọi callback để refresh danh sách bảng
      if (onDeleteSuccess) {
        onDeleteSuccess(boardId)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa bảng')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = useConfirmDialog({
    type: 'bảng',
    title: boardTitle,
    action: handleDeleteBoard
  })

  const handleClick = (e) => {
    e.stopPropagation() // Ngăn chặn sự kiện click lan ra card
    handleConfirmDelete()
  }

  return (
    <Button
      onClick={handleClick}
      sx={{
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        width: '24px',
        height: '24px',
        minWidth: 'unset',
        '&:hover': { bgcolor: '#d32f2f' }
      }}
    >
      <DeleteIcon sx={{ fontSize: '16px' }} />
    </Button>
  )
}

export default DeleteBoardButton
