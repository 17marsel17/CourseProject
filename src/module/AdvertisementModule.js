import { AdvertisementModel } from '../model/Advertisement.js';

export class AdvertisementModule {
    async find(params) {

        return await AdvertisementModel.find({
                shortText: {$regex: params.shortText}, 
                description: {$regex: params.description}, 
                userId: params.userId, 
                tags: params.tags, 
                isDeleted: false
            });
    }

    async findById(id) {
        
        return await AdvertisementModel.findById(id);
    }

    async create(data) {

            try {
                const newAdvertisement = new AdvertisementModel(data);

                return newAdvertisement.save(data);
            } catch (e) {
                console.log(e);
            }
    }

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
