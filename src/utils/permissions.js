const PERMISSIONS = {
  VIEW_BOARD: true,
  CHANGE_BOARD_TITLE: false,
  CHANGE_BOARD_STATUS: false,
  CHANGE_BOARD_VISIBILITY: false,
  DELETE_BOARD: false,
  INVITE_MEMBER: false,
  INVITE_ADMIN: false,
  KICK_MEMBER: false,
  KICK_ADMIN: false,
  CHANGE_MEMBER_ROLE: false,
  TRANSFER_OWNERSHIP: false,
  LEAVE_BOARD: true,
  CREATE_COLUMN: false,
  DELETE_COLUMN: false,
  UPDATE_COLUMN: false,
  MOVING_COLUMN: false,
  LOCK_COLUMN: false,
  CREATE_CARD: false,
  MOVING_CARD: false,
  DELETE_CARD: false,
  UPDATE_CARD: false,
  COMMENT_CARD: false,
  JOIN_CARD: false,
  LEAVE_CARD: false,
  // Legacy alias
  CHANGE_ADMIN: false
}

const PERMISSIONS_MAP = {
  GUEST: {
    ...PERMISSIONS,
    LEAVE_BOARD: false
  },

  OBSERVER: {
    ...PERMISSIONS,
    COMMENT_CARD: true
  },

  MEMBER: {
    ...PERMISSIONS,
    CREATE_CARD: true,
    MOVING_CARD: true,
    DELETE_CARD: true,
    UPDATE_CARD: true,
    COMMENT_CARD: true,
    JOIN_CARD: true,
    LEAVE_CARD: true
  },

  ADMIN: {
    ...PERMISSIONS,
    CHANGE_BOARD_TITLE: true,
    CHANGE_BOARD_STATUS: true,
    INVITE_MEMBER: true,
    KICK_MEMBER: true,
    CHANGE_MEMBER_ROLE: true,
    CREATE_COLUMN: true,
    DELETE_COLUMN: true,
    UPDATE_COLUMN: true,
    MOVING_COLUMN: true,
    LOCK_COLUMN: true,
    CREATE_CARD: true,
    MOVING_CARD: true,
    DELETE_CARD: true,
    UPDATE_CARD: true,
    COMMENT_CARD: true,
    JOIN_CARD: true,
    LEAVE_CARD: true
  },

  OWNER: {
    ...PERMISSIONS,
    CHANGE_BOARD_TITLE: true,
    CHANGE_BOARD_STATUS: true,
    CHANGE_BOARD_VISIBILITY: true,
    DELETE_BOARD: true,
    INVITE_MEMBER: true,
    INVITE_ADMIN: true,
    KICK_MEMBER: true,
    KICK_ADMIN: true,
    CHANGE_MEMBER_ROLE: true,
    TRANSFER_OWNERSHIP: true,
    LEAVE_BOARD: false, // Owner phai transfer truoc khi rời
    CREATE_COLUMN: true,
    DELETE_COLUMN: true,
    UPDATE_COLUMN: true,
    MOVING_COLUMN: true,
    LOCK_COLUMN: true,
    CREATE_CARD: true,
    MOVING_CARD: true,
    DELETE_CARD: true,
    UPDATE_CARD: true,
    COMMENT_CARD: true,
    JOIN_CARD: true,
    LEAVE_CARD: true,
    // Legacy alias
    CHANGE_ADMIN: true
  }
}

const BOARD_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  OBSERVER: 'OBSERVER'
}

// Card action trong column bi lock -> chi Owner/Admin duoc thao tac
const canActOnLockedColumn = (role) => role === BOARD_ROLES.OWNER || role === BOARD_ROLES.ADMIN

export { PERMISSIONS_MAP, BOARD_ROLES, canActOnLockedColumn }
