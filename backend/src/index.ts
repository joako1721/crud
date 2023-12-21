import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import bcrypt from 'bcrypt';
import { AppDataSource } from "./data-source"
import { Permissions, User } from "./entity/User"

AppDataSource.initialize().then(async () => {
    await AppDataSource.manager.find(User).then(async(users)=>{
        if(users && users.length != 0) return;
        // En caso de que no exista ningun usuario en la base de datos creo el usuario admin
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(process.env.DEFAULT_PASSWORD || "admin", salt).catch(error => console.log(error));

        const user = new User();
        user.username = "admin";
        user.password = hash;
        user.email = "admin@example.com";
        user.permissions = (Permissions.create | Permissions.delete | Permissions.modify | Permissions.view);

        await AppDataSource.manager.save(user);

    }).then(()=>{

        const PORT: number = parseInt(process.env.PORT || '3000', 10);
        
        app.listen(PORT, () => {
            console.log(`Server is running in ${PORT}`);
        });

    })
}).catch(error => console.log(error));
