import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const auth = (roles=[]) => {
    return async(req,res,next) => {
        try{
            const token = req.header('Authorization')?.replace('Bearer ','');
            if(!token) throw new Error('Authentication required');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({_id: decoded._id});
            if(!user) throw new Error('User not found');

            if(roles.length && !roles.includes(user.role)){
                throw new Error('Unauthorized access');
            }

            req.user = user;
            req.token = token;

            next();
        }catch(e){
            res.status(401).send({error: e.message});
        }
    }
}

export default auth;