import { toast } from 'react-toastify';
import BaseUrl from './Config';
import secureLocalStorage from "react-secure-storage";
export { call_api, call_secure_api, BaseUrl, call_secure_get_api }
const access_token = secureLocalStorage.getItem("admin_access_token");
function call_api(url, options) {
    return new Promise((resolve, reject) => {
        fetch(BaseUrl.api_url + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options)
        }).then(result => {
            result.json().then((res) => {
                resolve(res);
            }).catch((error) => {
                reject(error);
            })
        });
    });
}
function call_secure_api(url, options) {
    document.body.classList.add('loader-active');
    return new Promise((resolve, reject) => {
        fetch(BaseUrl.api_url + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + access_token },
            body: JSON.stringify(options)
        }).then(result => {
            if (result.status === 401) {
                secureLocalStorage.removeItem("admin_authenticated");
                secureLocalStorage.removeItem("admin_access_token");
                toast.error(result.message);
                window.location.href="/master/login" 
                // throw new Error('Unauthorized');
                return;
              }
            result.json().then((res) => {
                document.body.classList.remove('loader-active');
                resolve(res);
            }).catch((error) => {
                document.body.classList.remove('loader-active');
                reject(error);
            })
        });
    });
}
function call_secure_get_api(url) {
    document.body.classList.add('loader-active');
    return new Promise((resolve, reject) => {
        fetch(BaseUrl.api_url + url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + access_token }
        }).then(result => {
            if (result.status === 401) {
                secureLocalStorage.removeItem("admin_authenticated");
                secureLocalStorage.removeItem("admin_access_token");
                toast.error(result.message);
                window.location.href="/master/login" 
                // throw new Error('Unauthorized');
                return;
              }
            result.json().then((res) => {
                document.body.classList.remove('loader-active');
                resolve(res);
            }).catch((error) => {
                document.body.classList.remove('loader-active');
                reject(error);
            })
        });
    });
}