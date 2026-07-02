import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateBoardDetailsAPI, deleteBoardAPI, transferOwnershipAPI } from '~/apis/boards'
import useConfirmDialog from '~/helpers/hooks/useConfirmDialog'
import { handleError } from '~/utils/messageHelper'

export const useBoardOperations = (board, setBoard) => {
  const [isEditing, setIsEditing] = useState(false)
  // Draft chi co y nghia khi dang edit. Khi khong edit, render board.title tu prop.
  const [editedTitle, setEditedTitle] = useState('')
  // Khi user click edit, init draft tu board.title hien tai
  useEffect(() => {
    if (isEditing) setEditedTitle(board?.title || '')
  }, [isEditing, board?.title])

  const [memberId, setMemberId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()

  const handleUpdateTitle = async () => {
    try {
      const trimmed = editedTitle.trim()
      await updateBoardDetailsAPI(board._id, { title: trimmed })
      setBoard({ ...board, title: trimmed })
      setIsEditing(false)
    } catch (error) {
      handleError(error, 'Lỗi khi cập nhật tiêu đề')
    } finally {
      setIsEditing(false)
    }
  }

  const handleChangStateBoard = async () => {
    try {
      const newBoardState = board?.boardState === 'OPEN' ? 'CLOSED' : 'OPEN'
      await updateBoardDetailsAPI(board._id, { boardState: newBoardState })
      setBoard({ ...board, boardState: newBoardState })
      if (newBoardState === 'CLOSED') {
        toast.success('Bảng đã được đóng và dữ liệu sẽ không thể chỉnh sửa')
      }
    } catch (error) {
      handleError(error, 'Lỗi khi thay đổi trạng thái bảng')
    }
  }

  const handleDeleteBoard = async () => {
    try {
      await deleteBoardAPI(board._id)
      toast.success('Xóa bảng thành công')
      setTimeout(() => {
        navigate('/dashboard')
      }, [1000])
    } catch (error) {
      handleError(error, 'Lỗi khi xóa bảng')
    }
  }

  const handleChangeAdmin = async () => {
    try {
      await transferOwnershipAPI(board._id, memberId)
      toast.success('Chuyển quyền Owner thành công')
      navigate('/dashboard')
    } catch (error) {
      handleError(error, 'Lỗi khi chuyển quyền Owner')
    }
  }

  const handleConfirmDeleteBoard = useConfirmDialog({
    type: 'bảng',
    title: board?.title,
    action: handleDeleteBoard
  })

  const handleConfirmChangeAdmin = useConfirmDialog({
    type: 'bảng',
    title: board?.title,
    action: handleChangeAdmin,
    isChange: true
  })

  return {
    isEditing,
    setIsEditing,
    editedTitle,
    setEditedTitle,
    memberId,
    setMemberId,
    openDialog,
    setOpenDialog,
    handleUpdateTitle,
    handleChangStateBoard,
    handleConfirmDeleteBoard,
    handleConfirmChangeAdmin
  }
}
