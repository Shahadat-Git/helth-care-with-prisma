import jwt, { JwtPayload, Secret } from "jsonwebtoken";
const generateToken = (
  payload: {
    email: string;
    role: string;
  },
  secret: Secret,
  expiresIn: string
) => {
  const token = jwt.sign(
    {
      email: payload.email,
      role: payload.role,
    },
    secret,
    { algorithm: "HS256", expiresIn }
  );

  return token;
};

const verifyToken = (token: string, secret: Secret) =>
  jwt.verify(token, secret) as JwtPayload;

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
