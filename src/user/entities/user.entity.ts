import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity('user')
export class User {
    @PrimaryColumn() 
    id: number;
    
    @Column()
    name: string;
}
