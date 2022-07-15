import { User, UserModel } from '../model/User.js';

export class UserModule {
    async create(data) {

            try {
                const newUser = new User(data);
                return newUser.save(data);
            } catch (e) {
                console.log(e);
            }
    };

    async findByEmail(email) {

            try {
                const user = await UserModel.findOne({email: email});

                if (!user) {
                    return null;
                }

                return user;
            } catch (e) {
                console.log(e);
            }
    };
}
