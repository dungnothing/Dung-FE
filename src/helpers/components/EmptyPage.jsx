import empty_lesson from '~/assets/empty_lesson.svg'
import clsx from 'clsx'

const EmptyList = ({ className, title = 'Không có dữ liệu', size = 152, height = 320 }) => {
  return (
    <div
      style={{ height: height, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#FFFFF') }}
      className={clsx('w-full flex flex-col items-center justify-center rounded-b-[8px]', className)}
    >
      <div className="mb-2">
        <img src={empty_lesson} style={{ width: size, height: size }} alt="" />
      </div>
      <p className="text-[16px]/[24px] font-medium text-[#6A6A6A]">{title}</p>
    </div>
  )
}

export default EmptyList
