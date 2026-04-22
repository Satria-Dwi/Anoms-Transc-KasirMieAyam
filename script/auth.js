export function checkAuth(allowedRoles = []) {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // ❌ belum login
    if (!currentUser) {
        window.location.href = "/";
        return;
    }

    // ❌ tidak punya role
    if (!currentUser.role) {
        window.location.href = "/";
        return;
    }

    // ❌ role tidak diizinkan
    if (allowedRoles.length && !allowedRoles.includes(currentUser.role)) {
        alert("Akses ditolak!");
        // window.location.href = "/dashboard.html";
        window.location.href = "/Anoms-Transc-KasirMieAyam/views/dashboard/";
        return;
    }
}