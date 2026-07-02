import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { textColor } from '~/utils/constants'
import { BOARD_ROLES } from '~/utils/permissions'

function DialogChangeAdmin({ open, onClose, allUserInBoard, setMemberId, handleConfirmChangeAdmin, memberId }) {
  const members = Array.isArray(allUserInBoard) ? allUserInBoard : []
  // Loai Owner khoi danh sach chon (khong the transfer cho chinh Owner)
  const candidates = members.filter((m) => m.role !== BOARD_ROLES.OWNER)

  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '400px' } }}>
      <DialogTitle sx={{ color: textColor }}>Chuyển quyền Owner</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={candidates}
          getOptionLabel={(option) => option.userName || ''}
          isOptionEqualToValue={(option, value) => option.userId?.toString() === value?.userId?.toString()}
          onChange={(event, value) => setMemberId(value?.userId?.toString() || '')}
          renderInput={(params) => <TextField {...params} placeholder="Chọn thành viên" variant="outlined" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: textColor }}>
          Hủy
        </Button>
        <Button
          variant="outlined"
          onClick={handleConfirmChangeAdmin}
          sx={{ color: textColor, borderColor: 'purple' }}
          disabled={!memberId}
        >
          Chuyển
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogChangeAdmin
