import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
