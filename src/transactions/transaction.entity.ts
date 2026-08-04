import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance } from 'typeorm'
import { CategoryEntity } from 'src/category/category.entity';
import { PaymentMethod, TransactionType } from 'src/enum/enums';
import { UserEntity } from 'src/users/users.entity';

@Entity('transaction_entity')
@TableInheritance({column: {type: 'varchar', name:'type'}})
export class TransactionEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(() => UserEntity, (user) => user.transactions)
    user:UserEntity;

    @Column({nullable:false})
    description:string;

    @Column({
        nullable:false,
        type: 'enum',
        enum: TransactionType
    })
    type:TransactionType;

    @Column({
        type:'decimal',
        precision: 10,
        scale: 2
    })
    value:number;

    @ManyToOne(() => CategoryEntity, (category) => category.transactions)
    category:CategoryEntity;
    
    @Column({
        nullable: false,
        type:'enum',
        enum: PaymentMethod
    })
    paymentMethod:PaymentMethod;

    @CreateDateColumn({
        type:'timestamp'
    })
    transactionDate:Date;

}