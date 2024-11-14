import axios from 'axios';
const domain = new URL(window.location.href);
const baseUrl = `${domain.origin}/API/<%= fullNamespace %>`;

export async function getAsync(endPoint) {
    var url = `${baseUrl}/${endPoint}`;
       let axiosConfig = {
        method: 'get',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };
    return new Promise(function (resolve, reject) {
        axios({
            ...axiosConfig
        }).then((response) => {
            if (response.status === 200) {
                resolve(response.data);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export async function saveAsync(item, endPoint, editMode) {
    var url = `${baseUrl}/${endPoint}`;
    let axiosConfig = {
        method: editMode ? 'put' : 'post',
        url: url,
        data: item,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
    };
    return new Promise(function (resolve, reject) {
        axios({
            ...axiosConfig
        }).then((response) => {
            if (response.status === 200) {
                resolve(response.data);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getResx(filename, onSuccess) {
    doFetch(`${baseUrl}/Resx/GetResx?filename=${filename}`,
        undefined,
        undefined,
        onSuccess);
}

function doFetch(url, setOptions, data, onSuccess) {
    // default options
    let options = {
        method: 'GET',
        // headers go here
        headers: {
            'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : null,
        credentials: 'include'
    }
    if (setOptions) {
        options = { ...options, ...setOptions }
    }
    const req = new Request(url)

    fetch(req, options)
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else {
                return null
            }
        })
        .then((json) => {
            if (typeof (onSuccess) === 'function') {
                onSuccess(typeof (json) === 'string' ? JSON.parse(json) : json)
            }
        })
}