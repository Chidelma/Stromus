import type Organ from './Organ';
import type Message from './Message';

export interface _admin {
    id:string,
    photo:string,
    first_name:string,
    last_name:string,
    email:string,
    birthday:string,
    address:string,
    city:string,
    state:string,
    code:string,
    country:string
}

export interface _event {
    id:string,
    organ_id:string,
    title:string,
    desc:string,
    date_time:string,
    location:string
}

export interface _comment {
    id:string,
    post_id:string,
    user_id:string

    name:string,
    msg:string,
    date:string,
    photo:string
}

export interface _organ {
    id:string,
    admin_id:string,

    photo:string,
    name:string,
    founded:string,
    address:string,
    city:string,
    state:string,
    code:string,
    country:string
}

export interface _post {
    id:string,
    organ_id:string,
    user_id:string,

    photo:string,
    name:string,
    date:string,
    msg:string
}

export interface _role {

    organ_id:string,
    user_id:string,

    add_post:boolean,
    edit_post:boolean,
    delete_post:boolean,

    add_user:boolean,
    edit_user:boolean,
    delete_user:boolean,

    add_event:boolean,
    edit_event:boolean,
    delete_event:boolean
}

export interface _user {

    id:string,
    organ_id:string,

    photo:string,
    first_name:string,
    last_name:string,
    email:string
}

export interface _tab {

    label:string,
    value:number,
    component:any,
    organ?:Organ
}

export interface _chatbox {

    name:string,
    value:number,
    chat_id?:string,
    user_id?:string,
    messages:Message[]
}

export interface _like {

    post_id:string,
    user_id:string
}

export interface _rsvp {

    event_id:string,
    user_id:string
}

export interface _chat {

    organ_id:string,
    chat_id:string
}

export interface _msg {

    id:string,
    chat_id:string,

    user_id:string,
    message:string,
    date:string,
    name:string,
    photo:string
}

export interface _part_sort {

    part_key:string,
    part_value:string,
    sort_key?:string,
    sort_value?:string
}

export function clone<T>(instance: T): T {
    const copy = new (instance.constructor as { new (): T })();
    Object.assign(copy, instance);
    return copy;
}