import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';

import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { ICreateStatementDTO } from './ICreateStatementDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('Statements by user', () => {
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

  });

  it('should be able to create deposit by user', async () => {
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

    expect(deposit).toHaveProperty('id');
  });

  it('should be able to create withdraw by user', async () => {
    const user: ICreateUserDTO = {
      email: 'everton@gmail.com',
      password: '1234',
      name: 'User test',
    };

    const userCreated = await createUserUseCase.execute(user);

    const { id } = userCreated;

    const statementDeposit: ICreateStatementDTO = {
      user_id: id || '',
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'oi'
    }

    await createStatementUseCase.execute(statementDeposit);

    const statementWithdraw: ICreateStatementDTO = {
      user_id: id || '',
      type: OperationType.WITHDRAW,
      amount: 10,
      description: 'oi'
    }

    const withdraw = await createStatementUseCase.execute(statementWithdraw);

    expect(withdraw).toHaveProperty('id');
  });
});
