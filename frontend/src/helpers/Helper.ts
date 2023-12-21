import { User } from "../entities/User";
import { router } from "../main";
import { AxiosApiResponse } from "../services/BaseService"
import Swal, { SweetAlertOptions } from 'sweetalert2';


export const checkResponse = (response: AxiosApiResponse<any>) => {
    if(response.data.error){
        let opt: SweetAlertOptions = {
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            title: 'Error',
            icon: 'error',
            timer: 1000,
        } 

        if(response.status == 400){
            console.log(response.data.message?.replace(/\n/g, '<br>'))
            opt.title = 'Bad Request'
            opt.html = response.data.message?.replace(/\n/g, '<br>');
            opt.toast = false;
            opt.showConfirmButton = true;
            opt.position = 'center';
            opt.timer = undefined;
        }
        
        if(response.status == 403 || response.status == 401){
            opt.title = 'Unauthorized'
            localStorage.removeItem('token');
            router.push('/login');
        }

        Swal.fire(opt)
    }
    return response;
}

export const getCurrentUser = (): User|null =>{
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user) as User) : null;
}