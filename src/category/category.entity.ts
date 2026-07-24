import { TransactionEntity } from 'src/transactions/transaction.entity';
import { UserEntity } from 'src/users/users.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CategoryEntity{

    @PrimaryGeneratedColumn('increment')
    id:string;

    @Column()
    description:string;

    @CreateDateColumn({
        type:'timestamp'
    })
    createDate:Date;

    @ManyToOne(() => UserEntity, (user) => user, {nullable:true})
    user:UserEntity;

    @OneToMany(() => TransactionEntity, (transaction) => transaction.category, {nullable:true})
    transactions:TransactionEntity[];
}