import { ICreateUserDTO } from '../../../../modules/users/useCases/createUser/ICreateUserDTO'
import { InMemoryUsersRepository } from '../../../../modules/users/repositories/in-memory/InMemoryUsersRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';

import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
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
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
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

    await createStatementUseCase.execute(statement);
    const statements = await getBalanceUseCase.execute({ user_id: id || '' })

    expect(statements.balance).toBe(statement.amount);
  });
});
