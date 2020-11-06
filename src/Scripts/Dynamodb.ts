const Dynamite = require('dynamite');
import type { _part_sort, _admin, _comment, _user, _event, _organ, _post, _role, _like, _rsvp } from './Interface';

export default class Dynamo {

    client:any;

    constructor() {

        this.client = new Dynamite.Client({
            region: 'ca-central-1',
            accessKeyId: 'AKIARWWN5B3V7K4JMOO7',
            secretAccessKey: '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'
        });
    }

    async putItem(table_name:string, data:_admin | _comment | _user | _event | _organ | _post | _role | _like | _rsvp):Promise<boolean> {

        let added:boolean = false;

        let item:any = await this.client.putItem(table_name, data).execute();

        if(item.result != undefined)
            added = true;

        return added;
    }

    async getItem(table_name:string, data:_part_sort):Promise<any> {

        let item:any = await this.client.getItem(table_name)
                                        .setHashKey(data.part_key, data.part_value)
                                        .setRangeKey(data.sort_key, data.sort_value)
                                        .execute();

        return item.result;
    }

    async removeItem(table_name:string, data:_part_sort):Promise<boolean> {

        let deleted:boolean = false;

        let item:any = await this.client.deleteItem(table_name)
                                        .setHashKey(data.part_key, data.part_value)
                                        .setRangeKey(data.sort_key, data.sort_value)
                                        .execute();

        if(item.result == null)
            deleted = true;

        return deleted;
    }

    async updateItem(table_name:string, data:_part_sort, key_attr:string, value_attr:string):Promise<any> {

        let item:any = await this.client.newUpdateBuilder(table_name)
                                        .setHashKey(data.part_key, data.part_value)
                                        .setRangeKey(data.sort_key, data.sort_value)
                                        .enableUpsert()
                                        .putAttribute(key_attr, value_attr)
                                        .execute();

        return item.result;
    }

    async queryItem(table_name:string, data:_part_sort):Promise<any[]> {

        let items:any = await this.client.newQueryBuilder(table_name)
                                         .setHashKey(data.part_key, data.part_value)
                                         .execute();

        return items.result;
    }

    async queryIndex(table_name:string, index_name:string, data:_part_sort):Promise<any[]> {

        let items:any = await this.client.newQueryBuilder(table_name)
                                         .setIndexName(index_name)
                                         .setHashKey(data.part_key, data.part_value)
                                         .execute();

        return items.result;
    }

    async upDownLikes(data:_part_sort, value:number):Promise<boolean> {

        let changed:boolean = false;

        let item:any = await this.client.newUpdateBuilder('POSTS')
                                        .setHashKey(data.part_key, data.part_value)
                                        .setRangeKey(data.sort_key, data.sort_value)
                                        .enableUpsert()
                                        .addToAttribute('likes', value)
                                        .execute();

        if(item.result != undefined)
            changed = true

        return changed;
    }

    async getCount(table_name:string, data:_part_sort):Promise<number> {

        let items:any = await this.client.newQueryBuilder(table_name)
                                         .setHashKey(data.part_key, data.part_value)
                                         .getCount()
                                         .execute();

        return items.Count;
    }
}