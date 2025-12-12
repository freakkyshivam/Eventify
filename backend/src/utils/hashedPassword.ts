import argon2 from "argon2";

export const hashedPassword = async (password: string): Promise<string> => {
  try {
    const hashPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 15360,
      timeCost: 2,
      parallelism: 1,
    });

    return hashPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};
