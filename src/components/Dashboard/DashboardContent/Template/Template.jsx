/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Card, CardContent, Typography, CardMedia } from '@mui/material'
import { textColor } from '~/utils/constants'
import { useState, useEffect } from 'react'
import CreateTemplate from './CreateTemplate'
import { getTemplateAPI } from '~/apis/boards'
import { toast } from 'react-toastify'

function BoardTemplateCreator() {
  const [open, setOpen] = useState(false)
  const [templateId, setTemplateId] = useState()

  const [templateData, setTemplateData] = useState([
    {
      title: 'Kế hoạch hàng ngày',
      description: 'Một mẫu bảng việc nhà giúp bạn quản lý công việc hàng ngày của mình một cách hiệu quả.',
      image: 'https://i.pinimg.com/736x/e6/b9/c1/e6b9c1decfae8e63c78edf62d1328f3f.jpg'
    },
    {
      title: 'Học tập',
      description: 'Một bảng phân công, phân chia công việc học tập cho các thành viên trong nhóm.',
      image: 'https://i.pinimg.com/736x/ee/0c/5b/ee0c5bbe5c188bbec78e972c79c3a26a.jpg'
    },
    {
      title: 'Quản lý dự án',
      description:
        'Sử dụng cấu trúc này để xây dựng quy trình làm việc lý tưởng cho nhóm của bạn, bao gồm cả các dự án nhỏ.',
      image: 'https://i.pinimg.com/474x/1f/14/ff/1f14ff9d10edecac0d86fe0a2fd7ed13.jpg'
    },
    {
      title: 'Xây dựng sổ tay nhân viên',
      description: 'Với mẫu này, bạn có thể tạo một sổ tay nhân viên cho công ty của mình.',
      image: 'https://i.pinimg.com/736x/7e/e4/86/7ee486600d5a7467a3a7eab1c8748d88.jpg'
    }
  ])

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const templates = await getTemplateAPI()
        setTemplateData(
          templateData.map((template, index) => {
            template._id = templates[index]._id
            return template
          })
        )
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
    getTemplate()
  }, [])

  return (
    <Box sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ color: textColor }}>
        Chọn mẫu bảng
      </Typography>
      <Box className="grid grid-cols-3 gap-4 mt-4 w-full">
        {templateData.map((template, index) => (
          <Card
            key={index}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              },
              width: '100%',
              boxShadow: 2
            }}
            onClick={() => {
              setTemplateId(template._id)
              setOpen(true)
            }}
          >
            <CardMedia component="img" image={template.image} sx={{ height: 140, width: '100%' }} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ color: textColor }}>
                {template.title}
              </Typography>
              <Typography variant="body2" sx={{ color: textColor }}>
                {template.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <CreateTemplate open={open} onClose={() => setOpen(false)} templateId={templateId} />
    </Box>
  )
}

export default BoardTemplateCreator
