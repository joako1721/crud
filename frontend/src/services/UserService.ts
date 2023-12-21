import { User } from "../entities/User";
import { AxiosApiResponse, BaseService } from "./BaseService";

export class UserService extends BaseService {
    constructor() {
        super('users');
    }

    listUsers(): Promise<AxiosApiResponse<User[]>> {
        return this.get<User[]>('/');
    }

    createUser(user: User): Promise<AxiosApiResponse<User>> {
        return this.post<User>('/', user);
    }

    getUser(id: string): Promise<AxiosApiResponse<User>> {
        return this.get<User>('/' + id);
    }

    modifyUser(user: User): Promise<AxiosApiResponse<User>> {
        return this.post<User>('/' + user.id.toString(), user);
    }

    deleteUser(id: string): Promise<AxiosApiResponse<boolean>> {
        return this.delete<boolean>('/' + id);
    }

}