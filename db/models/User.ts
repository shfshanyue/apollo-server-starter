import { Table, Column, Model, AutoIncrement, PrimaryKey } from 'sequelize-typescript'

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
  createTime: Date;
}
