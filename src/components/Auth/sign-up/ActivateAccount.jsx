import { useSearchParams, useNavigate } from 'react-router-dom'
import { activateAccountAPI } from '~/apis/auth'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const ActivateAccount = () => {
  const [search] = useSearchParams()
  const email = search.get('email')
  const token = search.get('token')
  const navigate = useNavigate()
  const handleActivateAccount = async () => {
    try {
      if (!email) return
      await activateAccountAPI({ email: email, token: token })
      toast.success('Đã kích hoạt tài khoản thành công')
      setTimeout(() => {
        navigate('/sign-in')
      }, 2000)
    } catch (error) {
      toast.error('Lỗi rồi')
    }
  }

  useEffect(() => {
    handleActivateAccount()
  }, [email])

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      Tài khoản đã được kích hoạt thành công. Chúc bạn 1 ngày mới tốt lành
    </div>
  )
}

export default ActivateAccount
