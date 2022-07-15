import mongoose from 'mongoose';
import { AdvertisementModel } from '../model/Advertisement';

class Advertisement {
    async find(params) {

        return await AdvertisementModel.find({
                shortText: {$regex: params.shortText}, 
                description: {$regex: params.description}, 
                userId: params.userId, 
                tags: params.tags, 
                isDeleted: false
            });
    }

    async create(data) {

            try {
                const newAdvertisement = new Advertisement(data);

                return newAdvertisement.save(data);
            } catch (e) {
                console.log(e);
            }
    };

    async remove(id) {

        try {
            await AdvertisementModel.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        isDeleted: true
                    }
                }
            );
        } catch (e) {
            console.log(e);
        }
    }
}
