import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getAllAccessibleBoardsAPI, fetchBoardDetailsAPI } from '~/apis/boards'
import { Card, CardMedia, Typography, Box, Grid } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useNavigate } from 'react-router-dom'
import { textColor } from '~/utils/constants'
import CircularProgress from '@mui/material/CircularProgress'
import EmptyList from '~/helpers/components/EmptyPage'

function Task() {
  const [taskList, setTaskList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true)

        // Bước 1: Lấy danh sách boards
        const boards = await getAllAccessibleBoardsAPI()

        // Nếu không có board nào, set empty và thoát
        if (!boards || boards.length === 0) {
          setTaskList([])
          setIsLoading(false)
          return
        }

        // Bước 2: Lấy chi tiết từng board
        const boardDetailsPromises = boards.map((board) => fetchBoardDetailsAPI(board._id))
        const boardDetails = await Promise.all(boardDetailsPromises)

        // Bước 3: Tính toán task list từ board details
        const tasks = boardDetails.flatMap(
          (board) =>
            board?.columns?.flatMap(
              (column) =>
                column?.cards
                  ?.filter((card) => card?.endTime) // Chỉ lấy card có deadline
                  .map((card) => ({
                    ...card,
                    boardTitle: board.title,
                    boardId: board._id,
                    columnTitle: column?.title
                  })) || []
            ) || []
        )

        setTaskList(tasks)
      } catch (error) {
        toast.error(error?.message || 'Có lỗi xảy ra khi tải nhiệm vụ')
        setTaskList([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const formatDate = (time) => {
    return new Date(time).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // Hiển thị nội dung chính
  return (
    <Box sx={{ width: '100%', p: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ color: textColor }} variant="h6">
        Nhiệm vụ của bạn ở đây
      </Typography>

      {/* Hiển thị loading khi đang tải */}
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            minHeight: '300px'
          }}
        >
          <CircularProgress />
          <Typography>Đang tải nhiệm vụ...</Typography>
        </Box>
      ) : taskList.length === 0 ? (
        <EmptyList title="Không có nhiệm vụ" />
      ) : (
        <Grid spacing={2} container>
          {taskList.map((task) => (
            <Grid item key={task._id}>
              <Card sx={{ p: 2, minWidth: 400, minHeight: 250, borderRadius: 2 }}>
                <CardMedia
                  sx={{ height: 120, cursor: 'pointer', borderRadius: 1 }}
                  image={'https://i.pinimg.com/736x/36/9f/6f/369f6f9d06575f4d0629f4f8bf8347f8.jpg'}
                  onClick={() => navigate(`/boards/${task?.boardId}`)}
                />
                <Typography sx={{ mt: 1, color: textColor }}>Nội dung: {task?.title}</Typography>
                <Typography sx={{ mt: 1, color: textColor }}>
                  Thuộc: {task?.boardTitle} / {task?.columnTitle}
                </Typography>
                <Typography sx={{ m: 1, display: 'flex', alignItems: 'center', gap: 1, color: textColor }}>
                  <AccessTimeIcon fontSize="small" />
                  Thời hạn: {formatDate(task?.endTime)}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default Task
