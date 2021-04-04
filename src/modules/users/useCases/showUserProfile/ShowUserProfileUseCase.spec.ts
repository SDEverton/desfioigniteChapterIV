import { ICreateUserDTO } from '../../../../modules/users/useCases/createUser/ICreateUserDTO'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { ShowUserProfileUseCase } from '../showUserProfile/ShowUserProfileUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe('List profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to list user', async () => {
    const user: ICreateUserDTO = {
      email: 'everton@gmail.com',
      password: '1234',
      name: 'User test',
    };

    const userCreated = await createUserUseCase.execute(user);

    const { id } = userCreated;

    const result = await showUserProfileUseCase.execute(id || '');

    expect(result).toHaveProperty('id');
  });
});
