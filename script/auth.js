export function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
        // window.location.href = "/";
        window.location.href = "/Anoms-Transc-KasirMieAyam/";
    }
}