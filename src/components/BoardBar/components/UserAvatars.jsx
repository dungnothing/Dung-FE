import { Avatar, AvatarGroup, Tooltip, Box } from '@mui/material'
import { ChevronsUp } from 'lucide-react'
import { BOARD_ROLES } from '~/utils/permissions'

const ROLE_LABEL = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
  OBSERVER: 'Observer'
}

function UserAvatars({ allUserInBoard }) {
  const members = Array.isArray(allUserInBoard) ? allUserInBoard : []
  const rolePriority = { OWNER: 0, ADMIN: 1, MEMBER: 2, OBSERVER: 3 }
  const sorted = [...members].sort((a, b) => (rolePriority[a.role] ?? 99) - (rolePriority[b.role] ?? 99))
  const owner = sorted.find((m) => m.role === BOARD_ROLES.OWNER)
  const others = sorted.filter((m) => m.role !== BOARD_ROLES.OWNER)

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <AvatarGroup
        max={5}
        sx={{
          gap: '2px',
          '& .MuiAvatar-root': {
            width: '34px',
            height: '34px',
            fontSize: '16px',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }
        }}
      >
        {owner && (
          <Tooltip title={`${owner.userName} (${ROLE_LABEL.OWNER})`}>
            <Avatar alt={owner.userName} src={owner.avatar} sx={{ position: 'relative' }} />
          </Tooltip>
        )}
        {others.map((m, index) => (
          <Tooltip title={`${m.userName} (${ROLE_LABEL[m.role] || m.role})`} key={m.userId?.toString() ?? index}>
            <Avatar alt={m.userName} src={m.avatar} />
          </Tooltip>
        ))}
      </AvatarGroup>
      {owner && (
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            left: 22,
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            zIndex: 10
          }}
        >
          <ChevronsUp strokeWidth={4} color="#172b4d" />
        </Box>
      )}
    </Box>
  )
}

export default UserAvatars
