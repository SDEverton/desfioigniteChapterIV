import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it('should be able to create a new user', async () => {
    const user = {
      name: 'Novo',
      email: 'novo@gmail.com',
      password: '12345'
    };

    await createUserUseCase.execute(user);

    const userCreated = await inMemoryUsersRepository.create(
      user
    );

    expect(userCreated).toHaveProperty('id');
  });
});
