import db from '../db.js'

const Wardrobe = {
    async create({id_user, weather, clothe, url}) {
        const [newItem] = await db('wardrobe')
            .insert({id_user, weather, clothe, url})
            .returning(['id', 'url']);
        return newItem;
    },

    async findByUserId(id_user) {
        const items = await db('wardrobe')
            .select('*')
            .where({id_user});
        return items;
    },
};

export default Wardrobe;