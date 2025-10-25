const isEmail = (input) => {
  // Regex kiểm tra định dạng email cơ bản
  // Regex này không hoàn hảo cho mọi trường hợp, nhưng đủ tốt cho phần lớn mục đích
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}

const isCardNumber = (input) => {
  return /^\d{16}$/.test(input)
}

const isCardExpiryDate = (input) => {
  return /^(0[1-9]|1[0-2])[/\\]\d{2}$/.test(input)
}

const isCardCvv = (input) => {
  return /^\d{3}$/.test(input)
}

const isCardName = (input) => {
  return /^[A-Z\s]+$/.test(input.trim())
}

export default { isEmail, isCardNumber, isCardExpiryDate, isCardCvv, isCardName }
