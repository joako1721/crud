import { AxiosApiResponse, BaseService } from "./BaseService";


export class AuthService extends BaseService {

    constructor() {
        super('auth');
    }

    login(username: string, password: string): Promise<AxiosApiResponse<string>> {
        return this.post<string>('/login',
            {
                username: username,
                password: password
            }
        );
    }

}