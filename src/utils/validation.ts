export const validatePassword = (password: string) => {
  const minLength = 8;
  if (password.length < minLength) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!(hasUppercase && hasLowercase && hasNumber)) {
    return false;
  }

  // Optionally, you could add more checks for special characters, etc.
  return true;
};

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
