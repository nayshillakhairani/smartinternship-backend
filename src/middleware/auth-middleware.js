import dotenv from "dotenv";
dotenv.config();
import ResponseError from "../error/response-error.js";
import jwt from "jsonwebtoken";
import prisma from "../application/database.js";
const { JWT_SECRET_KEY = "secret" } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new ResponseError(400, "you're not authorized!");
    }

    const token = authorization.split("Bearer ")[1];
    const data = jwt.verify(token, JWT_SECRET_KEY);

    if (!data) {
      throw new ResponseError(400, "you're not authorized!");
    }

    req.user = {
      id: data.id,
      name: data.name,
      email: data.email,
      permissions: data.permissions,
      role: data.role,
    };

    next();
  } catch (e) {
    next(e);
  }
};

const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role.toUpperCase() == "USER") {
      throw new ResponseError(400, "you're not authorized!");
    }
    next();
  } catch (error) {
    next(error);
  }
};

const superAdminOnly = async (req, res, next) => {
  try {
    if (req.user.role.toUpperCase() == "SUPERADMIN") {
      next();
    } else {
      throw new ResponseError(400, "you're not authorized!");
    }
  } catch (error) {
    next(error);
  }
};

const permission = (permission) => async (req, res, next) => {
  try {
    if (req.user && req.user.permissions && req.user.permissions.includes(permission)) {
      next();
    } else {
      throw new ResponseError(400, "You're not authorized!");
    }
  } catch (error) {
    next(error);
  }
};

export default { authMiddleware, adminOnly, superAdminOnly, permission };
