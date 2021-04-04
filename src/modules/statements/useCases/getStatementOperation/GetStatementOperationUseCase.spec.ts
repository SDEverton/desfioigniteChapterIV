import { ICreateUserDTO } from '../../../../modules/users/useCases/createUser/ICreateUserDTO'
import { InMemoryUsersRepository } from '../../../../modules/users/repositories/in-memory/InMemoryUsersRepository';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';

import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('Get Balance by user', () => {
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able to list balance by user', async () => {
    const user: ICreateUserDTO = {
      email: 'everton@gmail.com',
      password: '1234',
      name: 'User test',
    };

    const userCreated = await createUserUseCase.execute(user);

    const { id } = userCreated;

    const statement: ICreateStatementDTO = {
      user_id: id || '',
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'oi'
    }

    const deposit = await createStatementUseCase.execute(statement);
    const statements = await getStatementOperationUseCase.execute({ user_id: id || '', statement_id: deposit.id || '' })

    expect(statements).toHaveProperty('id');
  });
});
