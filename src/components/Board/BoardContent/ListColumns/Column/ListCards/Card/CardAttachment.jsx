import AttachFileIcon from '@mui/icons-material/AttachFile'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { textColor } from '~/utils/constants'
import { Typography } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import { Box, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { toast } from 'react-toastify'
import useConfirmDialog from '~/helpers/components/useConfirmDialog'
import { removeFileAPI } from '~/apis/cards'

const caculateSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log2(bytes) / 10)
  return (bytes / Math.pow(2, i * 10)).toFixed(2) + ' ' + sizes[i]
}

const RenderAttachment = ({ title, size, url }) => {
  return (
    <div className="flex items-center px-3 border border-[#DCDCDC] rounded-lg w-full py-2">
      <div className="flex gap-3 items-center w-full">
        <ArticleIcon fontSize="medium" sx={{ color: textColor }} />
        <div className="flex flex-col w-full overflow-hidden">
          <Typography
            className="text-[16px] leading-[24px] font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-[400px] w-full"
            sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#B6C2CF' : '#292929') }}
          >
            {title}
          </Typography>
          <Typography
            className="text-[14px] leading-[20px] font-normal"
            sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#B6C2CF' : '#7C7C7C') }}
          >
            {caculateSize(size)}
          </Typography>
        </div>
        <a href={url} target="_blank" rel="noreferrer">
          <OpenInNewIcon fontSize="small" sx={{ color: textColor }} />
        </a>
      </div>
    </div>
  )
}

function CardAttachment({ card, fetchBoarData }) {
  const [anchorElMore, setAnchorElMore] = useState(null)
  const [fileDelete, setFileDelete] = useState(null)

  const handleDeleteFile = async () => {
    try {
      const formData = { cardId: card._id, fileLink: fileDelete.url }
      await removeFileAPI(card._id, formData)
      fetchBoarData()
    } catch (error) {
      toast.error('Loi roi')
    } finally {
      setAnchorElMore(null)
      setFileDelete(null)
    }
  }

  const confirmDeleteFile = useConfirmDialog({
    type: 'tập tin',
    title: fileDelete?.name,
    action: handleDeleteFile,
    onCancel: () => {
      setAnchorElMore(null)
      setFileDelete(null)
    }
  })

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2">
        <AttachFileIcon fontSize="small" sx={{ color: textColor }} />
        <Typography sx={{ color: textColor }}>Tập tin đính kèm</Typography>
      </div>
      {card?.files?.map((file, index) => (
        <div className="flex items-center gap-2 pl-6" key={index}>
          <RenderAttachment title={file.name} size={file.bytes} url={file.url} />
          <Box>
            <MoreVertIcon
              sx={{ color: textColor, cursor: 'pointer' }}
              onClick={(e) => {
                setAnchorElMore(e.currentTarget)
                setFileDelete(file)
              }}
              aria-label="More File Options"
            />
            <Menu anchorEl={anchorElMore} open={Boolean(anchorElMore)} onClose={() => setAnchorElMore(null)}>
              <MenuItem
                onClick={() => {
                  navigator.clipboard.writeText(card?.files?.url)
                  setAnchorElMore(null)
                  toast.info('Đã sao chép vào bộ nhớ')
                }}
              >
                Sao chép liên kết
              </MenuItem>
              <MenuItem
                onClick={() => {
                  confirmDeleteFile()
                  setAnchorElMore(null)
                }}
              >
                Gỡ tệp
              </MenuItem>
            </Menu>
          </Box>
        </div>
      ))}
    </div>
  )
}

export default CardAttachment
