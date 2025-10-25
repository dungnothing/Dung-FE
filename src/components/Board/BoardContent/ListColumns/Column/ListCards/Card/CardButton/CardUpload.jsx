import { Button, Tooltip, CircularProgress } from '@mui/material'
import { textColor } from '~/utils/constants'

function CardUpload({ title, icon, loading = false, disabled = false, accept, inputRef, onChange }) {
  return (
    <div>
      <Tooltip title={title}>
        <Button
          startIcon={
            loading ? (
              <div className="flex items-center gap-2">
                <CircularProgress size={20} />
                {icon}
              </div>
            ) : (
              icon
            )
          }
          sx={{
            color: textColor,
            border: '1px solid #DCDFE4',
            width: '100%'
          }}
          onClick={() => inputRef.current.click()}
          disabled={loading || disabled}
        />
      </Tooltip>
      <input type="file" ref={inputRef} style={{ display: 'none' }} onChange={onChange} accept={accept} />
    </div>
  )
}

export default CardUpload
