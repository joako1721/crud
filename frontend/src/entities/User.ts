export interface User {
    id: number;
    username: string;
    email: string;
    permissions: number;
    password: string;
}

export const enum Permissions {
    view   = 1 << 0,
    create = 1 << 1,
    modify = 1 << 2,
    delete = 1 << 3,
}