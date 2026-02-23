export function getAuthHeader() {
    const token = localStorage.getItem("destimatch_token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
}