import { useConfirm } from 'material-ui-confirm'

function useConfirmDialog({ type, title, action, isChange = false, onCancel }) {
  const confirmDialog = useConfirm()

  const handleConfirmDialog = () => {
    confirmDialog({
      title: `Xác nhận ${isChange ? 'thay đổi' : 'xóa'} ${type}`,
      description: (
        <span>
          Bạn có chắc muốn {isChange ? 'thay đổi' : 'xóa'} {type}{' '}
          <span style={{ fontFamily: 'cursive', fontStyle: 'italic', color: 'purple' }}>{title}</span> chứ?
        </span>
      ),
      confirmationText: `${isChange ? 'Thay đổi' : 'Xóa'} `,
      cancellationText: 'Hủy'
    })
      .then(() => {
        action()
      })
      .catch(() => {
        if (onCancel) onCancel()
      })
  }

  return handleConfirmDialog
}

export default useConfirmDialog
