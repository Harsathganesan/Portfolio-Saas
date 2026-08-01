import jwt from 'jsonwebtoken';

export const getJwtSecret = () => process.env.JWT_SECRET || 'super_secret_jwt_key_portfolio_saas_2026';

export const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};
