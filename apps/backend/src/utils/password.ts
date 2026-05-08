import argon2 from "argon2";

const PASSWORD_HASH_OPTIONS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

export const hashPassword = async (password: string) => {
  return argon2.hash(password, PASSWORD_HASH_OPTIONS);
};

export const verifyPassword = async (
  passwordHash: string,
  plainPassword: string,
) => {
  return argon2.verify(passwordHash, plainPassword, PASSWORD_HASH_OPTIONS);
};
