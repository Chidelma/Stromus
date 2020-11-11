import type { _part_sort, _admin, _comment, _user, _event, _organ, _post, _role, _like, _rsvp, _chat, _msg } from './Interface';
import { invokeApi } from './Fetch';

export default class Dynamo {

    async putItem(table_name:string, data:_admin | _comment | _user | _event | _organ | _post | _role | _like | _rsvp | _chat | _msg):Promise<boolean> {

        let res:any = await invokeApi('http://localhost:4000/putitem', { table_name, data });

        //console.log(res);

        return res.msg;
    }

    async getItem(table_name:string, data:_part_sort):Promise<any> {

        let res:any = await invokeApi('http://localhost:4000/getitem', { table_name, data });

        //console.log(res);

        return res.msg;
    }

    async removeItem(table_name:string, data:_part_sort):Promise<boolean> {

        let res:any = await invokeApi('http://localhost:4000/removeitem', { table_name, data });

        //console.log(res);

        return res.msg;
    }

    async updateItem(table_name:string, data:_part_sort, key_attr:string, value_attr:string):Promise<any> {

        let res:any = await invokeApi('http://localhost:4000/updateitem', { table_name, data, key_attr, value_attr });

        //console.log(res);
        
        return res.msg;
    }

    async queryItem(table_name:string, data:_part_sort):Promise<any[]> {

        let res:any = await invokeApi('http://localhost:4000/queryitem', { table_name, data });

        //console.log(res);

        return res.msg;
    }

    async queryIndex(table_name:string, index_name:string, data:_part_sort):Promise<any[]> {

        let res:any = await invokeApi('http://localhost:4000/queryindex', { table_name, index_name, data });

        //console.log(res);
        
        return res.msg;
    }

    async upDownLikes(data:_part_sort, value:number):Promise<boolean> {

        let res:any = await invokeApi('http://localhost:4000/updownlikes', { data, value });

        //console.log(res);

        return res.msg;
    }

    async getCount(table_name:string, data:_part_sort):Promise<number> {

        let res:any = await invokeApi('http://localhost:4000/getcount', { table_name, data });

        //console.log(res);
        
        return res.msg;
    }
}