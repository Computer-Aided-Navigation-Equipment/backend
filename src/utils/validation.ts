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
export const validateUsername = (username: string) => {
  if (username.length < 4 || username.length > 20) {
    return "Username must be between 4 and 20 characters long.";
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return "Username must contain only alphanumeric characters.";
  }

  return null; // null indicates no error
};

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
