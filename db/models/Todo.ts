import { Table, Column, Model, AutoIncrement, PrimaryKey, BelongsTo, ForeignKey } from 'sequelize-typescript'
import { ENUM } from 'sequelize'
import { User } from './User'

@Table({
  tableName: 'todo'
})
export class Todo extends Model<Todo> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

  @Column
  createTime: Date;

  @Column(ENUM('UNDO', 'DONE'))
  status: 'UNDO' | 'DONE';

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User
}
