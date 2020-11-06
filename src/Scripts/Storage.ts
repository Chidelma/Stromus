import Amplify, { Storage } from 'aws-amplify';

export default class Store {

    store:any;

    constructor() {

        Amplify.configure({
            Auth : {
                identityPoolId: process.env.IDENTITY_POOL_ID,
                region: process.env.REGION,
                identityPoolRegion: process.env.REGION,
                userPoolId: process.env.USER_POOL_ID,
                userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID
            },
            Storage: {
                AWSS3: {
                    bucket: 'strom-storage', //REQUIRED -  Amazon S3 bucket name
                    region: process.env.REGION
                }
            }
        });

        this.store = Storage;
    }

    async uploadImage(image:any, dir_name:string, id:string):Promise<string> {

        let result:any = await this.store.put(dir_name + id + '.jpg', image, {
                                                contentType: 'image/png'
                                            });

        return result.key;                                  
    }

    async getImageUrl(key:string):Promise<string> {

        let signedUrl:string = await this.store.get(key);

        return signedUrl;
    }
}