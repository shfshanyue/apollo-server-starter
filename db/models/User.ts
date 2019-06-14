import { Table, Column, Model, AutoIncrement, PrimaryKey } from 'sequelize-typescript'
import { ENUM } from 'sequelize'

@Table({
  modelName: 'users'
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
}
