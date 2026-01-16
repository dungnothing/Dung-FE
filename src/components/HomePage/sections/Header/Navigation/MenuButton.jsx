import { useNavigate } from 'react-router-dom'

const MenuButton = ({ title, icon, path, onClose }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) {
      navigate(path)
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <div
      className="flex w-full items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#F0F3FF] hover:text-[#5034FF] rounded-lg"
      onClick={handleClick}
    >
      {icon}
      <p className="text-[16px]/[24px] font-[350]">{title}</p>
    </div>
  )
}

export default MenuButton
