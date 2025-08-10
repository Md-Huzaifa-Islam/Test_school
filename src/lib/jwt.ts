import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-super-secret-refresh-key";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateTokens = (payload: JWTPayload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m", // 15 minutes
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d", // 7 days
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

export const extractTokenFromHeader = (authHeader: string | null): string => {
  if (!authHeader) {
    throw new Error("Authorization header is required");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header must start with Bearer");
  }

  return authHeader.substring(7);
};

export const getCurrentUser = (request: NextRequest): JWTPayload => {
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);
  return verifyAccessToken(token);
};

export const generateRandomToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
