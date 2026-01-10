/**
 * Utility để lấy error message từ response của Backend
 * Xử lý các trường hợp khác nhau của error structure
 *
 * @param {Error} error - Error object từ axios hoặc try-catch
 * @param {string} defaultMessage - Message mặc định nếu không tìm thấy message từ BE
 * @returns {string} Error message
 */
export const getErrorMessage = (error, defaultMessage = 'Đã có lỗi xảy ra') => {
  // Trường hợp 1: Error từ API response (axios error)
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  // Trường hợp 2: Error có message trực tiếp (network error, timeout, etc.)
  if (error?.message) {
    return error.message
  }

  // Trường hợp 3: Error là string
  if (typeof error === 'string') {
    return error
  }

  // Trường hợp 4: Không xác định được error
  return defaultMessage
}

/**
 * Utility để lấy success message từ response của Backend
 *
 * @param {Object} response - Response object từ axios
 * @param {string} defaultMessage - Message mặc định nếu không tìm thấy message từ BE
 * @returns {string} Success message
 */
export const getSuccessMessage = (response, defaultMessage = 'Thành công') => {
  // Trường hợp 1: Response có data.message
  if (response?.data?.message) {
    return response.data.message
  }

  // Trường hợp 2: Response có message trực tiếp
  if (response?.message) {
    return response.message
  }

  // Trường hợp 3: Không tìm thấy message
  return defaultMessage
}
