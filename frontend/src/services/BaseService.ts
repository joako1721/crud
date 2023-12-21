import axios, { AxiosResponse } from "axios";
import { checkResponse } from "../helpers/Helper";

export const instance = axios.create();

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = 'Bearer ' + token;
    
    return config;
}, error=>Promise.reject(error));

instance.interceptors.response.use((response)=>response, error=>{
    checkResponse(error.response);
    Promise.reject(error)
});

export const API_URL = 'http://localhost:3000/';

export interface ApiResponse<T> {
    error: boolean;
    data?: T;
    message?:string;
}

export interface AxiosApiResponse<T> extends AxiosResponse<ApiResponse<T>> {}

export class BaseService {
    public baseURL: string;
    constructor(baseURL: string = '') {
        this.baseURL = API_URL + baseURL;
    }
    async get<T>(url: string = ''): Promise<AxiosApiResponse<T>> {
        return instance.get<ApiResponse<T>, any>(this.baseURL + url);
    }

    async post<T>(url: string = '', data: any): Promise<AxiosApiResponse<T>> {
        return instance.post<ApiResponse<T>, any>(this.baseURL + url, data);
    }

    async put<T>(url: string = '', data: any): Promise<AxiosApiResponse<T>> {
        return instance.put<ApiResponse<T>, any>(this.baseURL + url, data);
    }

    async delete<T>(url: string = ''): Promise<AxiosApiResponse<T>> {
        return instance.delete<ApiResponse<T>, any>(this.baseURL + url);
    }
}