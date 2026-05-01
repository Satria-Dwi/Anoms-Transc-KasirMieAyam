import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= FIREBASE =================
const firebaseConfig = {
    apiKey: "AIzaSyB-vWhdcOYRayZ8YHACJ-fvzpci0eWKRGQ",
    authDomain: "anos-kasirmieayam.firebaseapp.com",
    projectId: "anos-kasirmieayam",
};

// 🔥 INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 FORMAT RUPIAH
function rupiah(angka) {
    return new Intl.NumberFormat("id-ID").format(angka);
}

// 🔥 CHART
let chart;

// 🔥 LOAD DASHBOARD
function loadDashboard() {
    onSnapshot(collection(db, "transaksi"), (snapshot) => {

        let pendapatanHariIni = 0;
        let transaksiHariIni = 0;
        let perHari = {};

        const todayStr = new Date().toLocaleDateString("sv-SE");

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            // 🔥 ambil tanggal dari createdAt (utama), fallback aman
            const trxDate = data.createdAt?.toDate
                ? data.createdAt.toDate()
                : data.createdAt
                    ? new Date(data.createdAt)
                    : data.waktu_raw
                        ? new Date(data.waktu_raw)
                        : data.waktu
                            ? new Date(data.waktu)
                            : null;

            if (!trxDate || isNaN(trxDate.getTime())) return;

            const trxStr = trxDate.toLocaleDateString("sv-SE");

            // 💰 hitung hari ini
            if (trxStr === todayStr) {
                pendapatanHariIni += Number(data.total || 0);
                transaksiHariIni++;
            }

            // 📊 chart
            const tgl = trxDate.toLocaleDateString("id-ID");

            if (!perHari[tgl]) perHari[tgl] = 0;
            perHari[tgl] += Number(data.total || 0);
        });

        // 🔥 urutkan tanggal lama → baru
        perHari = Object.fromEntries(
            Object.entries(perHari).sort((a, b) => {
                const d1 = new Date(a[0].split("/").reverse().join("-"));
                const d2 = new Date(b[0].split("/").reverse().join("-"));
                return d1 - d2;
            })
        );

        // 🔥 UPDATE UI
        document.getElementById("pendapatanHariIni").innerText = rupiah(pendapatanHariIni);
        document.getElementById("transaksiHariIni").innerText = transaksiHariIni;

        // 📈 CHART (tetap bentuk lama)
        const ctx = document.getElementById("salesChart");

        if (ctx) {
            if (chart) chart.destroy();

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: Object.keys(perHari),
                    datasets: [{
                        label: "Penjualan",
                        data: Object.values(perHari)
                    }]
                }
            });
        }

    });
}

// 🔥 AUTO JALAN
window.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});