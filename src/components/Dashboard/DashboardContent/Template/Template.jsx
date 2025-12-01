/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Card, CardContent, Typography, CardMedia, Dialog, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { useState, useEffect } from 'react'
import CreateTemplate from './CreateTemplate'
import { getTemplateAPI } from '~/apis/boards'
import { toast } from 'react-toastify'
import hangngay from '~/assets/preview-template/hangngay.png'
import hoctap from '~/assets/preview-template/hoctap.png'
import duan from '~/assets/preview-template/duan.png'
import sotay from '~/assets/preview-template/sotay.png'

function BoardTemplateCreator() {
  const [open, setOpen] = useState(false)
  const [templateId, setTemplateId] = useState()

  // State cho preview full screen
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null)

  const [templateData, setTemplateData] = useState([
    {
      title: 'Kế hoạch hàng ngày',
      description: 'Một mẫu bảng việc nhà giúp bạn quản lý công việc hàng ngày của mình một cách hiệu quả.',
      image: 'https://i.pinimg.com/736x/e6/b9/c1/e6b9c1decfae8e63c78edf62d1328f3f.jpg',
      previewImage: hangngay
    },
    {
      title: 'Học tập',
      description: 'Một bảng phân công, phân chia công việc học tập cho các thành viên trong nhóm.',
      image: 'https://i.pinimg.com/736x/ee/0c/5b/ee0c5bbe5c188bbec78e972c79c3a26a.jpg',
      previewImage: hoctap
    },
    {
      title: 'Quản lý dự án',
      description:
        'Sử dụng cấu trúc này để xây dựng quy trình làm việc lý tưởng cho nhóm của bạn, bao gồm cả các dự án nhỏ.',
      image: 'https://i.pinimg.com/474x/1f/14/ff/1f14ff9d10edecac0d86fe0a2fd7ed13.jpg',
      previewImage: duan
    },
    {
      title: 'Xây dựng sổ tay nhân viên',
      description: 'Với mẫu này, bạn có thể tạo một sổ tay nhân viên cho công ty của mình.',
      image: 'https://i.pinimg.com/736x/7e/e4/86/7ee486600d5a7467a3a7eab1c8748d88.jpg',
      previewImage: sotay
    }
  ])

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const templates = await getTemplateAPI()
        setTemplateData(
          templateData?.map((template, index) => {
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

  const handleOpenPreview = (e, image) => {
    e.stopPropagation()
    setPreviewImage(image)
    setPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewOpen(false)
    setPreviewImage('')
  }

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
              boxShadow: 2,
              position: 'relative'
            }}
            onClick={() => {
              setTemplateId(template._id)
              setOpen(true)
            }}
            onMouseEnter={() => setHoveredCardIndex(index)}
            onMouseLeave={() => setHoveredCardIndex(null)}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia component="img" image={template.image} sx={{ height: 140, width: '100%' }} />
              {hoveredCardIndex === index && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: '0.3s'
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => handleOpenPreview(e, template.previewImage)}
                    sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f0f0f0' } }}
                  >
                    Xem trước
                  </Button>
                </Box>
              )}
            </Box>
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

      <Dialog fullScreen open={previewOpen} onClose={handleClosePreview}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClosePreview}
            aria-label="close"
            sx={{ position: 'absolute', top: 16, right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
            disableRipple
          >
            <CloseIcon />
          </IconButton>
          <img
            src={previewImage}
            alt="Template Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </Box>
      </Dialog>

      <CreateTemplate open={open} onClose={() => setOpen(false)} templateId={templateId} />
    </Box>
  )
}

export default BoardTemplateCreator
