import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from 'typeorm/index';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn() 
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    email: string;

    @Column()
    address: string;

    @Column()
    private_key: string;

    @Column()
    usdt_amout:number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date; 

}
