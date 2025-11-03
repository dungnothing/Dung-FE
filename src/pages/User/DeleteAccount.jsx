import { useState } from 'react'
import { Checkbox, Button, Box } from '@mui/material'
import { toast } from 'react-toastify'
import { deleteAccountAPI } from '~/apis/auth'
import { logout } from '~/redux/features/comon'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const DeleteAccountSection = () => {
  const [checked, setChecked] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDelee = async () => {
    try {
      await deleteAccountAPI()
      dispatch(logout())
      document.cookie = 'accessToken=; path=/; max-age=0'
      document.cookie = 'refreshToken=; path=/; max-age=0'
      toast.success('Xóa thành công', {
        onClose: () => navigate('/')
      })
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  return (
    <Box className="bg-white flex flex-col w-full">
      <Box className="flex flex-col gap-1 border-b border-gray-200 p-6">
        <p className="text-[16px] font-medium">Xóa tài khoản</p>
        <p className="text-[14px] font-normal text-gray-300">
          Tài khoản của bạn sẽ bị xóa vĩnh viễn, không thể khôi phục lại
        </p>
      </Box>
      <Box className="flex flex-col gap-2 p-6">
        <Box className="flex items-center gap-2">
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <p>Xác nhận xóa tài khoản</p>
        </Box>
        <Button
          className="w-fit"
          variant="contained"
          sx={{ color: 'white', bgcolor: '#ef4770', borderRadius: '10px' }}
          disabled={!checked}
          onClick={handleDelee}
        >
          Xóa tài khoản
        </Button>
      </Box>
    </Box>
  )
}

export default DeleteAccountSection
