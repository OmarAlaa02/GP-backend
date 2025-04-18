import userModel from './user.model.js';

class userServices{
    async getUserData(userId){
        const user = await userModel.findOne({
            where: { user_id: userId },
        });
        console.log("requested user ",user);
        return user;
    } 
}

export default new userServices();