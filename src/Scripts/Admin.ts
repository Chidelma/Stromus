import Organ from './Organ';
import type { _admin, _part_sort, _organ } from './Interface';
import { $dynamo } from './Init';

export default class Admin {

    private id:string;

    private photo:string;
    private first_name:string;
    private last_name:string;
    private email:string;
    private birthday:string;
    private address:string;
    private city:string;
    private state:string;
    private code:string;
    private country:string;

    private organs:Organ[];
    
    constructor() {  
        this.organs = [];
    }

    async set_admin(admin:_admin) {

        this.id = admin.id;
        this.photo = admin.photo;
        this.first_name = admin.first_name.toUpperCase();
        this.last_name = admin.last_name.toUpperCase();
        this.email = admin.email;

        this.birthday = admin.birthday;
        this.address = admin.address.toUpperCase();
        this.city = admin.city.toUpperCase();
        this.state = admin.state.toUpperCase();
        this.code = admin.code.toUpperCase();
        this.country = admin.country.toUpperCase();

        let key_value:_part_sort = {
            part_key: 'admin_id',
            part_value: admin.id
        }

        let organ_result:_organ[] = await $dynamo.queryItem('ORGANS', key_value);

        for(let i = 0; i < organ_result.length; i++) {
            
            let new_organ:Organ = new Organ(organ_result[i]);

            await new_organ.setup_users();
            await new_organ.setup_events();
            await new_organ.setup_posts();
            await new_organ.setup_chats();

            new_organ.sort_all();

            this.organs.push(new_organ);
        } 
    }

    set_organs(organs:Organ[]) {
        this.organs = organs;
    }

    add_organ(organ:Organ) {
        this.organs.push(organ);
    }

    get_organs():Organ[] {
        return this.organs;
    }

    get_id():string {
        return this.id;
    }

    get_photo():string {
        return this.photo;
    }

    get_first_name():string {
        return this.first_name;
    }

    get_last_name():string {
        return this.last_name;
    }

    get_email():string {
        return this.email;
    }

    get_birthday():string {
        return this.birthday;
    }

    get_address():string {
        return this.address;
    }

    get_city():string {
        return this.city;
    }

    get_state():string {
        return this.state;
    }

    get_code():string {
        return this.code;
    }

    get_country():string {
        return this.country;
    }
}