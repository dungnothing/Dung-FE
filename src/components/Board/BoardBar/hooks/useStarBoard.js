import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addStarBoardAPI, removeStarBoardAPI } from '~/apis/boards'
import { setStarBoards } from '~/redux/features/comon'

export const useStarBoard = (board) => {
  const common = useSelector((state) => state.comon)
  const dispatch = useDispatch()
  const [starLoading, setStarLoading] = useState(false)

  const handleStarBoard = async () => {
    try {
      setStarLoading(true)
      const isStar = common?.starBoards?.some((star) => star._id === board._id)
      if (isStar) {
        await removeStarBoardAPI(board._id)
        dispatch(setStarBoards(common.starBoards.filter((star) => star._id !== board._id)))
      } else {
        await addStarBoardAPI(board._id)
        dispatch(setStarBoards([...common.starBoards, { _id: board._id, title: board.title }]))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
    } finally {
      setStarLoading(false)
    }
  }

  const isStarred = common?.starBoards?.some((star) => star._id === board._id)

  return {
    handleStarBoard,
    isStarred,
    starLoading
  }
}
