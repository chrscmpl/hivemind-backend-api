import { User } from 'src/users/entities/user.entity';

export type SanitizedUser = Omit<User, 'password'>;
