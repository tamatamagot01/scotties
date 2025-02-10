import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ใช้ encryption ของ password ด้วย bcrypt
export const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
};

// ใช้การตรวจสอบ password ด้วย bcrypt
export const verifyPassword = async (
  password: string,
  encryptedPassword: string
) => {
  const verifiedStatus = await bcrypt.compare(password, encryptedPassword);
  return verifiedStatus;
};

// ใช้สร้าง token ด้วย jsonwebtoken
export const createToken = async (userId: number, roleId: number) => {
  const token = jwt.sign(
    { id: userId, roleId: roleId },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: "30d",
    }
  );
  return token;
};

export const verifyToken = async (token: string) => {
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY!) as Record<
    string,
    number
  >;
  return decode;
};
