import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { getAllAccessibleBoardsAPI, fetchBoardDetailsAPI } from '~/apis/boards'
import { Card, CardMedia, Typography, Box, Grid } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useNavigate } from 'react-router-dom'
import { textColor } from '~/utils/constants'
import CircularProgress from '@mui/material/CircularProgress'
import EmptyList from '~/helpers/components/EmptyPage'

function Task() {
  const [boardList, setBoardList] = useState([])
  const [boardData, setBoardData] = useState([])
  const [loadTask, setLoadTask] = useState(false)
  const [taskList, setTaskList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllAccessibleBoardsAPI()
        setBoardList(response)
      } catch (error) {
        toast.error(error.message)
      }
    }
    getData()
  }, [])

  useEffect(() => {
    if (boardList?.length === 0) return

    const fetchData = async () => {
      try {
        setLoadTask(true)
        const responses = await Promise.all(boardList?.map((board) => fetchBoardDetailsAPI(board._id)))
        setBoardData(responses)
      } catch (error) {
        toast.error('Lỗi lấy thông tin board')
      } finally {
        setLoadTask(false)
      }
    }
    fetchData()
  }, [boardList])

  // Quản lý task (nhiệm vụ)
  const computedTaskList = useMemo(() => {
    return boardData
      .flatMap(
        (board) =>
          board?.columns?.flatMap(
            (column) =>
              column?.cards?.map((card) => ({
                ...card,
                boardTitle: board.title,
                boardId: board._id,
                columnTitle: column?.title
              })) || []
          ) || []
      )
      .filter((card) => card?.endTime)
  }, [boardData])

  useEffect(() => {
    if (JSON.stringify(taskList) !== JSON.stringify(computedTaskList)) {
      setTaskList(computedTaskList)
    }
  }, [computedTaskList, taskList])

  const timeShow = (time) => {
    return new Date(time).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  if (loadTask) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          height: '100%',
          width: '100%'
        }}
      >
        <CircularProgress />
        <Typography>Đang tải đợi xíu :3</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', p: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ color: textColor }} variant="h6">
        Nhiệm vụ của bạn ở đây
      </Typography>
      {taskList.length === 0 ? (
        <EmptyList title="Không có nhiệm vụ" />
      ) : (
        <Grid spacing={2} container>
          {taskList.map((task) => (
            <Card key={task._id} sx={{ p: 2, width: 400, height: 250, overflow: 'auto', borderRadius: 2 }}>
              <CardMedia
                sx={{ height: 120, cursor: 'pointer' }}
                image={'https://i.pinimg.com/736x/36/9f/6f/369f6f9d06575f4d0629f4f8bf8347f8.jpg'}
                onClick={() => navigate(`/boards/${task?.boardId}`)}
              />
              <Typography sx={{ mt: 1, color: textColor }}>Nội dung: {task?.title}</Typography>
              <Typography sx={{ mt: 1, color: textColor }}>
                Thuộc: {task?.boardTitle} / {task?.columnTitle}
              </Typography>
              <Typography sx={{ m: 1, display: 'flex', alignItems: 'center', gap: 1, color: textColor }}>
                <AccessTimeIcon fontSize="small" />
                Thời hạn: {timeShow(task?.endTime)}
              </Typography>
            </Card>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default Task
