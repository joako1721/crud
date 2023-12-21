import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Permissions, User } from '../entity/User';
import { jsonResponseError, jsonResponseForbidden, jsonResponseOk, jsonResponseServerError, jsonResponseUnauthorized } from '../responseHelper';
import * as bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

const jwtSecret = process.env.SECRET || 'secret'

export const checkNoOverrideCurrentUser = (req: Request, res: Response, next: NextFunction) => {
    let {id} = req.params
    if(id == res.locals.user.id) return res.status(400).json(jsonResponseError("You can't modify your own user"));
    next();
}

export const checkPermissions = (permissions: number) => {
    if (!permissions) permissions = 0;
    return (req: Request, res: Response, next: NextFunction) => {
        if (!(res.locals.user.permissions & permissions)) return res.status(401).json(jsonResponseUnauthorized());
        next();
    }
}

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization) return res.status(401).json(jsonResponseUnauthorized());
    const token = authorization.split(' ')[0] === 'Bearer' ? authorization.split(' ')[1] : null
    if (!token) return res.status(401).json(jsonResponseUnauthorized());

    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) return res.status(401).json(jsonResponseUnauthorized());
        res.locals.user = decoded;
        next();
    });
};

interface LoginBodyRequest {
    username: string;
    password: string;
}

export const login = async (req: Request, res: Response) => {
    let { username, password } = req.body as LoginBodyRequest;

    if (!password) return res.status(404).json(jsonResponseError("Invalid user or password"))
    if (!username) return res.status(404).json(jsonResponseError("Invalid user or password"))

    await AppDataSource.manager.findOneBy(User, { username: username }).then(async (user) => {
        if (!user) return res.status(404).json(jsonResponseError("Invalid user or password"));

        await bcrypt.compare(password, user.password).then((isPasswordValid) => {
            if(!isPasswordValid) return res.status(404).json(jsonResponseError("Invalid user or password"))
            const token = jwt.sign(
                {
                    id: user.id,
                    permissions: user.permissions,
                    email: user.email,
                },
                jwtSecret
            )
            if(!token) return res.status(404).json("Invalid user or password")

            res.status(200).json(jsonResponseOk(token));

        })

    }).catch((error) => {
        console.log(error)
        res.status(500).json(jsonResponseServerError());
    });

};
