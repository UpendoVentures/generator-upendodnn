import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();
            fetch(url,{
                method: "GET",
                headers: {
                    "ModuleId": 389,
                    "RequestVerificationToken": "vt4k-ZjhQv_b6yTjs5I0DhumWcY_8sMm52euNE-MzEFLJVg3EtMu5GkKRGtWCgowSCPA58POdpzdprZA0",
                    "TabId": 36
                },
                signal: abortCont.signal
            })
                .then(res => {
                    if (!res.ok) { // error coming back from server
                        throw Error("could not fetch the data for that resource");
                    } 
                    return res.json();
                })
                .then(data => {
                    setIsPending(false);
                    setData(data);
                    setError(null);
                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        console.log("fetch aborted");
                    } else {
                    // auto catches network / connection error
                        setIsPending(false);
                        setError(err.message);
                    }
                });

            // abort the fetch
            return () => abortCont.abort();
    }, [url]);

    return { data, isPending, error };
};
 
export default useFetch;