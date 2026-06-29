import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateBoardDetailsAPI, deleteBoardAPI, changeAdminAPI } from '~/apis/boards'
import useConfirmDialog from '~/helpers/hooks/useConfirmDialog'
import { getErrorMessage } from '~/utils/messageHelper'

export const useBoardOperations = (board, setBoard) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(board?.title)
  const [visibility, setVisibility] = useState(board?.visibility)
  const [memberId, setMemberId] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [visibilityLoading, setVisibilityLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpdateTitle = async () => {
    try {
      await updateBoardDetailsAPI(board._id, { title: editedTitle.trim() })
      setBoard({ ...board, title: editedTitle.trim() })
      setIsEditing(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi khi cập nhật tiêu đề'))
    } finally {
      setIsEditing(false)
    }
  }

  const handleVisibilityChange = async (isPrivate) => {
    try {
      setVisibilityLoading(true)
      await updateBoardDetailsAPI(board._id, { visibility: isPrivate ? 'PRIVATE' : 'PUBLIC' })
      setVisibility(isPrivate ? 'PRIVATE' : 'PUBLIC')
      toast.success('Trạng thái bảng đã thay đổi')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi khi thay đổi trạng thái bảng'))
    } finally {
      setVisibilityLoading(false)
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
      toast.error(getErrorMessage(error, 'Lỗi khi thay đổi trạng thái bảng'))
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
      toast.error(getErrorMessage(error, 'Lỗi khi xóa bảng'))
    }
  }

  const handleChangeAdmin = async () => {
    try {
      await changeAdminAPI(board._id, memberId)
      toast.success('Thay đổi admin thành công')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Lỗi khi thay đổi admin'))
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
    visibility,
    setVisibility,
    visibilityLoading,
    memberId,
    setMemberId,
    openDialog,
    setOpenDialog,
    handleUpdateTitle,
    handleVisibilityChange,
    handleChangStateBoard,
    handleConfirmDeleteBoard,
    handleConfirmChangeAdmin
  }
}
