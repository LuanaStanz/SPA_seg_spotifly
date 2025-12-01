export async function apiGET(url) {
const token = sessionStorage.getItem('access_token');
const res = await fetch(url, {
headers: { Authorization: `Bearer ${token}` }
});
return res.json();
}


export async function apiPUT(url) {
const token = sessionStorage.getItem('access_token');
return fetch(url, {
method: 'PUT',
headers: { Authorization: `Bearer ${token}` }
});
}


export async function apiPOST(url) {
const token = sessionStorage.getItem('access_token');
return fetch(url, {
method: 'POST',
headers: { Authorization: `Bearer ${token}` }
});
}