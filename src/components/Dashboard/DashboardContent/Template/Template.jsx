/* eslint-disable react-hooks/exhaustive-deps */

import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Dialog,
  IconButton,
  Button,
  DialogTitle,
  DialogContent
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { textColor } from '~/utils/constants'
import { useState, useEffect } from 'react'
import CreateTemplate from './CreateTemplate'
import { getTemplateAPI, fetchBoardDetailsAPI } from '~/apis/boards'
import { toast } from 'react-toastify'
import ContentLoading from '~/helpers/components/ContentLoading'

function BoardTemplateCreator() {
  const [open, setOpen] = useState(false)
  const [templateId, setTemplateId] = useState()

  // State cho preview full screen
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null)

  // State lưu danh sách templates từ API
  const [templateData, setTemplateData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getTemplate = async () => {
      try {
        setIsLoading(true)
        const templates = await getTemplateAPI()
        setTemplateData(templates)
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Không thể tải danh sách template')
      } finally {
        setIsLoading(false)
      }
    }
    getTemplate()
  }, [])

  const handleOpenPreview = async (e, templateId) => {
    e.stopPropagation()
    try {
      setLoadingPreview(true)
      setPreviewOpen(true)
      const detail = await fetchBoardDetailsAPI(templateId)
      setPreviewTemplate(detail)
    } catch (error) {
      toast.error('Không thể tải chi tiết template')
      setPreviewOpen(false)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleClosePreview = () => {
    setPreviewOpen(false)
    setPreviewTemplate(null)
  }

  return (
    <Box sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ color: textColor }}>
        Chọn mẫu bảng
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <ContentLoading message="Đang tải danh sách mẫu..." minHeight="400px" />
        </Box>
      ) : templateData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Typography variant="h6" sx={{ color: textColor }}>
            Chưa có template nào
          </Typography>
        </Box>
      ) : (
        <Box className="grid grid-cols-3 gap-4 mt-4 w-full">
          {templateData.map((template, index) => (
            <Card
              key={template._id || index}
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
                <CardMedia
                  component="img"
                  image={template.coverImage || 'https://via.placeholder.com/400x200?text=No+Image'}
                  sx={{ height: 140, width: '100%', objectFit: 'cover' }}
                />
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
                      onClick={(e) => handleOpenPreview(e, template._id)}
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
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            width: '70vw',
            height: '70vh',
            maxWidth: 'none'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1d2125' : 'background.default'),
            borderBottom: 1,
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#FFF4EA' : 'divider')
          }}
        >
          <Typography variant="h5" sx={{ color: textColor, fontWeight: 600 }}>
            {previewTemplate?.title || 'Xem trước template'}
          </Typography>
          <IconButton onClick={handleClosePreview} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'background.default'),
            p: 0,
            height: 'calc(100% - 64px)',
            overflow: 'hidden'
          }}
        >
          {loadingPreview ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <ContentLoading message="Đang tải thông tin mẫu..." minHeight="400px" />
            </Box>
          ) : previewTemplate ? (
            <Box sx={{ height: '100%', p: 3, overflowX: 'auto', overflowY: 'hidden' }}>
              {/* Trello Board Layout - Horizontal Columns */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  height: '100%',
                  alignItems: 'flex-start'
                }}
              >
                {previewTemplate.columns?.map((column) => (
                  <Box
                    key={column._id}
                    sx={{
                      minWidth: 280,
                      maxWidth: 280,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'),
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Column Header */}
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderBottom: 1,
                        borderColor: 'divider'
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: textColor,
                          fontWeight: 600,
                          fontSize: '0.95rem'
                        }}
                      >
                        {column.title}
                      </Typography>
                    </Box>

                    {/* Cards Container */}
                    <Box
                      sx={{
                        p: 2,
                        overflow: 'auto',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                      }}
                    >
                      {column.cards.length === 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.875rem'
                          }}
                        >
                          Chưa có thẻ nào
                        </Typography>
                      )}
                      {column.cards.map((card) => (
                        <Card
                          key={card._id}
                          sx={{
                            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'background.paper'),
                            boxShadow: (theme) =>
                              theme.palette.mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
                            cursor: 'default',
                            '&:hover': {
                              boxShadow: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? '0 2px 6px rgba(0,0,0,0.4)'
                                  : '0 2px 4px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: textColor,
                                fontSize: '0.875rem',
                                lineHeight: 1.5,
                                wordBreak: 'break-word'
                              }}
                            >
                              {card.title}
                            </Typography>
                            {card.description && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  mt: 1,
                                  display: 'block',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {card.description}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>

      <CreateTemplate open={open} onClose={() => setOpen(false)} templateId={templateId} />
    </Box>
  )
}

export default BoardTemplateCreator
