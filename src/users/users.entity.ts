import { CategoryEntity } from 'src/category/category.entity';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users_entity')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({length:255, nullable:false})
    name:string;

    @Column({unique:true, nullable:false})
    email:string;

    @Column({length:255, nullable: false})
    password:string;

    @OneToMany(() => CategoryEntity, (category) => category.user)
    category:CategoryEntity[];

    @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
    transactions:TransactionEntity[];

    @Column({
        type:'decimal',
        precision: 10,
        scale: 2,
        default: 0
    })
    balance:number;
}