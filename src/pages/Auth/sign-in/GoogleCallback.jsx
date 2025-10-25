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
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')
    const userName = searchParams.get('userName')
    const avatar = searchParams.get('avatar')
    const vip = searchParams.get('vip')
    const address = searchParams.get('address')
    const phone = searchParams.get('phone')
    const isGoogleAccount = searchParams.get('isGoogleAccount')

    if (!accessToken || !refreshToken) {
      toast.error('Đăng nhập thất bại hoặc thiếu dữ liệu.')
      navigate('/sign-in')
      return
    }

    document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60}`
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`

    dispatch(setUserInfo({ userId, email, userName, avatar, vip, address, phone, isGoogleAccount }))
    toast.success('Đăng nhập Google thành công!')
    navigate('/dashboard')
  }, [searchParams, dispatch, navigate])

  return null
}
