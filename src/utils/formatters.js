export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// Function để format thời gian hiển thị (vd: 5m trước, 2h trước, etc.)
export const checkTime = (time) => {
  const currentTime = new Date().getTime()
  const timeAgo = new Date(time).getTime()
  const diffTime = (currentTime - timeAgo) / 1000
  const diffMinutes = Math.floor(diffTime / 60)
  const diffHours = Math.floor(diffTime / 3600)
  const diffDays = Math.floor(diffTime / 86400)
  const diffWeeks = Math.floor(diffTime / 604800)

  if (diffMinutes == 0) {
    return 'Vừa xong'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m trước`
  }

  if (diffHours < 24) {
    return `${diffHours}h trước`
  }

  if (diffDays < 7) {
    return `${diffDays}d trước`
  }

  if (diffWeeks < 4) {
    return `${diffWeeks}w trước`
  }

  return `${Math.floor(diffTime / 2592000)} tháng trước`
}

// Dung de tao ra 1 card moi khi 1 column trong, trong do card do duoc an di khoi giao dien nguoi dung
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placehorlder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}
