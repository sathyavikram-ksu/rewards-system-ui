export const HOST_URL = 'http://localhost:8080/';
export const ACCESS_TOKEN = 'accessToken';
export const USER_NAME = 'userName';

export function getUrl(uri: string) {
    return HOST_URL + uri;
}