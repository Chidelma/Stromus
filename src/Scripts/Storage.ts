import Amplify, { Storage } from 'aws-amplify';

export default class Store {

    store:any;

    constructor(env:any) {

        Amplify.configure({
            Auth : {
                identityPoolId: env.IDENTITY_POOL_ID,
                region: env.REGION,
                identityPoolRegion: env.REGION,
                userPoolId: env.USER_POOL_ID,
                userPoolWebClientId: env.USER_POOL_WEB_CLIENT_ID
            },
            Storage: {
                AWSS3: {
                    bucket: 'strom-storage', //REQUIRED -  Amazon S3 bucket name
                    region: env.REGION
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