import { Avatar, AvatarGroup, Tooltip, Box } from '@mui/material'
import { ChevronsUp } from 'lucide-react'

function UserAvatars({ allUserInBoard }) {
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
        <Tooltip title={allUserInBoard.admin.adminName + ' (Admin)'}>
          <Avatar
            alt={allUserInBoard.admin.adminName}
            src={allUserInBoard.admin.adminAvatar}
            sx={{ position: 'relative' }}
          />
        </Tooltip>
        {allUserInBoard.members.map((user, index) => (
          <Tooltip title={user.memberName} key={index}>
            <Avatar alt={user.memberName} src={user.memberAvatar} />
          </Tooltip>
        ))}
      </AvatarGroup>
      {/* Crown positioned absolutely over the first avatar */}
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
    </Box>
  )
}

export default UserAvatars
