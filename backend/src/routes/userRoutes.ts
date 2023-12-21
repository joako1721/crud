import express from 'express';
import { listUsers, createUser, getUser, deleteUser, modifyUser } from '../controllers/userController';
import { checkNoOverrideCurrentUser, checkPermissions, checkToken } from '../controllers/authController';
import { Permissions } from '../entity/User';

const router = express.Router();

router.get('/', checkToken, listUsers);

router.post('/',checkToken, checkPermissions(Permissions.create), createUser);

router.get('/:id', checkToken, checkPermissions(Permissions.view), getUser);

router.post('/:id', checkToken, checkPermissions(Permissions.modify), modifyUser);

router.delete('/:id', checkToken, checkPermissions(Permissions.delete), checkNoOverrideCurrentUser, deleteUser);



export default router;