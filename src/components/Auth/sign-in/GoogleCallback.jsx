import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '~/redux/features/comon'

export default function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const accessToken = searchParams.get('accessToken')
      const refreshToken = searchParams.get('refreshToken')
      const userId = searchParams.get('userId')
      const email = searchParams.get('email')
      const userName = searchParams.get('userName')
      const avatar = searchParams.get('avatar')
      const vip = searchParams.get('vip') === 'true'
      const address = searchParams.get('address') || ''
      const phone = searchParams.get('phone') || ''
      const isGoogleAccount = searchParams.get('isGoogleAccount') === 'true'
      const organization = searchParams.get('organization') || ''

      if (!accessToken || !refreshToken || !userId || !email) {
        toast.error('Đăng nhập thất bại hoặc thiếu dữ liệu.')
        navigate('/sign-in')
        return
      }

      document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60}`
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`

      dispatch(
        setUserInfo({
          userId,
          email,
          userName: userName || '',
          avatar: avatar || '',
          vip,
          address,
          phone,
          isGoogleAccount,
          organization
        })
      )

      navigate('/dashboard')
    } catch (error) {
      toast.error('Có lỗi xảy ra trong quá trình đăng nhập.')
      navigate('/sign-in')
    }
  }, [searchParams, dispatch, navigate])

  return null
}
