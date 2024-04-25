const usersRepository = require('./users-repository');
const { hashPassword } = require('../../../utils/password');
const { errorType, errorResponder } = require('../../../core/errors');
/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Check if email get taken
 * @param {string} email - Email
 * @returns {Promise}
 */
async function emailCheck(email) {
  const check = await usersRepository.emailCheck(email);
  return check;
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  //check if email already exists
  const check = await emailCheck(email);
  if (check) {
    throw errorResponder(errorTypes.EMAIL_ALREADY_TAKEN, 'Email got taken');
  }

  // Validate password
  if (password.length < 6) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Password must be at least 8 characters long'
    );
  }

  if (password !== password_confirm) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Passwords do not match'
    );
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  //check if email already taken
  const emailCheck = await usersRepository.createUser(email);

  if (emailCheck && user.email !== email) {
    throw errorResponder(errorTypes.EMAIL_ALREADY_TAKEN, 'Email already taken');
  }

  try {
    await usersRepository.updateUser(user._id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  emailCheck,
  createUser,
  updateUser,
  deleteUser,
};
