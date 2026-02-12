import { Box, TextField, Typography, Avatar, Button, IconButton } from '@mui/material'
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic'
import DeleteIcon from '@mui/icons-material/Delete'
import { textColor } from '~/utils/constants'
import { toast } from 'react-toastify'
import { createCommentAPI, getCommentsAPI, deleteCommentAPI } from '~/apis/cards'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { checkTime } from '~/utils/formatters'
import { useCommentSocketHandlers } from '~/sockets/comment'
import { useParams } from 'react-router-dom'

function CardComments({ card, isBoardClosed, onCommentCountChange }) {
  const user = useSelector((state) => state.comon.user)
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [content, setContent] = useState('')
  const { boardId } = useParams()

  // Pagination states
  const [comments, setComments] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const limit = 20

  // Load initial comments
  useEffect(() => {
    const loadInitialComments = async () => {
      try {
        const result = await getCommentsAPI(card._id, 1, limit)
        setComments(result.comments || [])
        setTotalCount(result.totalCount || 0)
        setCurrentPage(result.currentPage || 1)
        setHasMore(result.hasMore || false)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi tải comments')
        setComments([])
        setTotalCount(0)
        setCurrentPage(1)
        setHasMore(false)
      }
    }

    loadInitialComments()
  }, [card._id])

  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(totalCount)
    }
  }, [totalCount, onCommentCountChange])

  useCommentSocketHandlers(card._id, setComments, setTotalCount)

  const handleLoadMore = async () => {
    try {
      setIsLoadingMore(true)
      const nextPage = currentPage + 1
      const result = await getCommentsAPI(card._id, nextPage, limit)

      setComments((prev) => [...prev, ...(result.comments || [])])
      setCurrentPage(result.currentPage || nextPage)
      setHasMore(result.hasMore || false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi tải thêm comments')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleCreateComment = async () => {
    try {
      setIsCommentLoading(true)
      const formData = {
        cardId: card._id,
        boardId: boardId,
        content: content
      }
      const newComment = await createCommentAPI(formData)
      setComments((prevComments) => [newComment, ...prevComments])
      setTotalCount((prev) => prev + 1)
      setContent('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi tạo comment')
    } finally {
      setIsCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentAPI(commentId, boardId)

      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId))
      setTotalCount((prev) => prev - 1)

      toast.success('Comment đã được xóa')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi xóa comment')
    }
  }

  return (
    <Box sx={{ pt: 1, flexDirection: 'column', gap: 1.5, display: 'flex', width: '38%', pr: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutoAwesomeMosaicIcon sx={{ color: textColor }} />
          <Typography sx={{ pl: 1, color: textColor }}>Hoạt động</Typography>
        </Box>
        {totalCount > 0 && (
          <Typography sx={{ color: textColor, fontSize: '12px' }}>
            {comments.length}/{totalCount} comments
          </Typography>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder="Viết bình luận..."
        disabled={isCommentLoading || isBoardClosed}
        variant="outlined"
        size="small"
        value={content}
        sx={{
          pl: 4,
          color: textColor,
          '& .MuiInputBase-input': {
            cursor: isCommentLoading || isBoardClosed ? 'not-allowed' : 'text'
          }
        }}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCreateComment()
          }
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: '420px',
          pr: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {comments?.map((comment) => (
          <Box
            key={comment._id}
            sx={{
              display: 'flex',
              gap: 2,
              pl: 2,
              alignItems: 'flex-start',
              width: '100%'
            }}
          >
            <Avatar
              alt={comment.userInfo?.userName}
              src={comment.userInfo?.avatar || ''}
              sx={{ width: 35, height: 35 }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#E2E5E9'),
                p: 1,
                borderRadius: '12px',
                position: 'relative'
              }}
            >
              <div className="flex gap-1 items-center justify-between">
                <div className="flex gap-1 items-center">
                  <div style={{ color: textColor }} className="font-[500] text-[15px]">
                    {comment.userInfo?.userName}
                  </div>
                  <div className={`text-[12px] color-${textColor}`}>{checkTime(comment.createdAt)}</div>
                </div>
                {user?.userId === comment.userInfo?._id && !isBoardClosed && (
                  <IconButton size="small" onClick={() => handleDeleteComment(comment._id)} sx={{ p: 0.5 }}>
                    <DeleteIcon sx={{ fontSize: 14, color: '#ff4444' }} />
                  </IconButton>
                )}
              </div>
              <div style={{ color: textColor }} className="text-[13px] whitespace-pre-line break-words break-all">
                {comment.content}
              </div>
            </Box>
          </Box>
        ))}

        {hasMore && (
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Button
              variant="text"
              size="small"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              sx={{
                color: textColor,
                fontSize: '12px',
                textTransform: 'none'
              }}
            >
              {isLoadingMore ? 'Đang tải...' : 'Xem thêm'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CardComments
