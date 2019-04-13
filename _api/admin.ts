import {Router} from 'express';
import * as basicAuth from 'express-basic-auth';

const admin = Router();

admin.use(basicAuth({
  users: { 'admin': 'supersecret' }
}))

admin.get('/', (req, res) => res.send('Hello'))

export default admin;
