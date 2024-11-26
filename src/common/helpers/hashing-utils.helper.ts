import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

const saltRounds = +process.env.SALT_ROUNDS!;

if (isNaN(saltRounds) || Math.floor(saltRounds) !== saltRounds) {
  throw new Error('Invalid value for SALT_ROUNDS');
}

export async function hash(data: string): Promise<string> {
  return bcryptHash(data, saltRounds);
}

export const compare = bcryptCompare;
