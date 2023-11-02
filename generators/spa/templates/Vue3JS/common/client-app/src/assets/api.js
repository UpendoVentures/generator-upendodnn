export
    function getConfig(dnnConfig, onSuccess) {
    doFetch(dnnConfig, `${dnnConfig.apiBaseUrl}/Item/GetConfig`, undefined, undefined, onSuccess);
}
export
    function getResx(dnnConfig, filename, onSuccess) {
    doFetch(dnnConfig,
        `${dnnConfig.apiBaseUrl}API/<%= fullNamespace %>/Resx/GetResx?filename=${filename}`,
        undefined,
        undefined,
        onSuccess);
}
function doFetch(dnnConfig, url, setOptions, data, onSuccess) {
    // default options
    let options = {
        method: 'GET',
        // headers go here
        headers: {
            'Content-Type': 'application/json',
            moduleid: dnnConfig.moduleId,
            tabid: dnnConfig.tabId,
            RequestVerificationToken: dnnConfig.rvt
        },
        body: data ? JSON.stringify(data) : null
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