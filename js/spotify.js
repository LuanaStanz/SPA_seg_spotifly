export async function apiGET(url) {
    const token = sessionStorage.getItem('access_token');
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
}

export async function apiPUT(url, body = null) {
    const token = sessionStorage.getItem('access_token');
    return fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    });
}

export async function apiPOST(url, body = null) {
    const token = sessionStorage.getItem('access_token');
    return fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    });
}
