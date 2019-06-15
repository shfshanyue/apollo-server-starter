import { Table, Column, Model, AutoIncrement, PrimaryKey, HasMany } from 'sequelize-typescript'
import { ENUM } from 'sequelize'
import { Todo } from './Todo';

@Table({
  tableName: 'users'
})
export class User extends Model<User> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  createTime: Date;

  @Column(ENUM('USER', 'ADMIN'))
  role: 'USER' | 'ADMIN';

  @HasMany(() => Todo)
  todos: Todo[]
}
