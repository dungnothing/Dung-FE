import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { textColor } from '~/utils/constants'

function DialogChangeAdmin({ open, onClose, allUserInBoard, setMemberId, handleConfirmChangeAdmin, memberId }) {
  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '400px' } }}>
      <DialogTitle sx={{ color: textColor }}>Thay đổi admin</DialogTitle>
      <DialogContent>
        <Autocomplete
          placeholder="Chọn thành viên"
          variant="outlined"
          options={allUserInBoard?.members}
          getOptionLabel={(option) => option.userName || ''}
          onChange={(event, value) => {
            setMemberId(value?._id || '')
          }}
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
          Thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogChangeAdmin
