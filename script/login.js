import { db } from "./firebase.js";
import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔥 LOGIN
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const q = query(
        collection(db, "users"),
        where("username", "==", username),
        where("password", "==", password)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
        const user = snap.docs[0].data();

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLogin", "true");

        // window.location.href = "/views/dashboard/";
        window.location.href = "/Anoms-Transc-KasirMieAyam/views/dashboard/";
    } else {
        document.getElementById("error").innerText =
            "Username atau password salah";
    }
}

// 🔥 GLOBAL
window.login = login;