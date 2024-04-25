const joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword: {
    body: {
      oldPassword: joi.string().required().label('Old password'),
      newPassword: joi.string().min(6).max(32).required().label('New password'),
      confirmNewPassword: joi
        .string()
        .valid(joi.ref('New password'))
        .required()
        .label('Confirm new password'),
    },
  },
};
