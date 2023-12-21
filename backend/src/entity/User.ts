import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"


export const enum Permissions {
    view   = 1 << 0,    // 1  puede ver usuarios
    create = 1 << 1,    // 2  puede crear usuarios
    modify = 1 << 2,    // 4  puede modificar usuarios
    delete = 1 << 3,    // 8  puede eliminar usuarios
}



@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    permissions: number

}
