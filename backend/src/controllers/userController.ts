import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Permissions, User } from '../entity/User';
import { jsonResponseError, jsonResponseOk, jsonResponseServerError } from '../responseHelper';
import bcrypt from 'bcrypt';
import { ParamsDictionary } from 'express-serve-static-core';

export const listUsers = async (req: Request, res: Response) => {
  //Obtengo la lista de usuarios de la base de datos filtro los campos que no quiero mostrar
  await AppDataSource.manager.find(User).then((users) => {
    for (let user of users) {
      delete user.password;
    }

    res.status(200).json(jsonResponseOk(users));

  }).catch((error) => {
    res.status(500).json(jsonResponseServerError());
  });
};


interface CreateUserBodyRequest {
  username: string;
  password: string;
  email: string;
  permissions: number;
}

export const createUser = async (req: Request, res: Response) => {

  const { username, password, email, permissions } = req.body as CreateUserBodyRequest;

  var errors: string[] = [];
  if (!username) errors.push("The 'username' field is obligatory.");
  if (!password) errors.push("The 'password' filed is obligatory.");
  if (!email) errors.push("The 'email' field is obligatory.");

  if (email && /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(email) == false) errors.push("The email is not valid");

  if (errors && errors.length > 0) {
    return res.status(400).json(jsonResponseError(errors.join('\n')));
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt).catch(() => { return res.status(500).json(jsonResponseServerError()) });

  const user = new User();
  user.username = username;
  user.password = hash;
  user.email = email;
  user.permissions = permissions || Permissions.view;

  await AppDataSource.manager.save(user).then((user) => {
    res.status(200).json(jsonResponseOk(user));
  }).catch((error) => {
    if(error.code == 'ER_DUP_ENTRY') {
      return res.status(400).json(jsonResponseError("The username already exists."));
    }
    res.status(500).json(jsonResponseServerError());
  });

};


interface GetUserParamsRequest extends ParamsDictionary {
  id: string
}

export const getUser = async (req: Request, res: Response) => {

  const { id } = req.params as GetUserParamsRequest;

  if (!id) return res.status(400).json(jsonResponseError("The id is mandatory"));

  await AppDataSource.manager.findOneBy(User, { id: parseInt(id, 10) }).then((user) => {
    if(!user) return res.status(404).json(jsonResponseError("User not found"));

    delete user.password;
    res.status(200).json(jsonResponseOk(user));
  }).catch(() => {
    res.status(500).json(jsonResponseServerError());
  });


};

interface DeleteUserParamsRequest extends ParamsDictionary {
  id: string
}

export const deleteUser = async (req: Request, res: Response) => {

  const { id } = req.params as DeleteUserParamsRequest;

  if (!id) return res.status(400).json(jsonResponseError("The id is mandatory"));

  await AppDataSource.manager.findOneBy(User, { id: parseInt(id, 10) }).then(async (user) => {
    if (!user) return res.status(404).json(jsonResponseError("User not found"));

    await AppDataSource.manager.remove(user).then(() => res.status(200).json(jsonResponseOk(true)));
  }).catch(() => {
    res.status(500).json(jsonResponseServerError());
  });


};

interface ModifyUserParamsRequest extends ParamsDictionary {
  id: string
}

interface ModifyUserBodyRequest {
  username?: string;
  password?: string;
  email?: string;
  permissions?: number;
}

export const modifyUser = async (req: Request, res: Response) => {

  const { id } = req.params as ModifyUserParamsRequest;
  const { username, password, email, permissions } = req.body as ModifyUserBodyRequest;

  if (!id) return res.status(400).json(jsonResponseError("The id is mandatory"));

  await AppDataSource.manager.findOneBy(User, { id: parseInt(id, 10) }).then(async (user) => {

    if (!user) return res.status(404).json(jsonResponseError("User not found"));

    if(username == user.username && password == user.password && email == user.email && permissions == user.permissions){
      return res.status(200).json(jsonResponseOk(user));
    } 

    if (username) user.username = username;
    if (password){
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt).catch((e) => { return res.status(500).json(jsonResponseServerError()) });
      if(!hash) return;
      user.password = hash;
    }
    if (email){
      if(!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(email)) return res.status(400).json(jsonResponseError("The email is not valid"));
      user.email = email;
    } 
    if (permissions) user.permissions = permissions;

    AppDataSource.manager.save(user).then(() =>{
      res.status(200).json(jsonResponseOk(user));
    }).catch(() => {
      res.status(500).json(jsonResponseServerError());
    });

  })

};