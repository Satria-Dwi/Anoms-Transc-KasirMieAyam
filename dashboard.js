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

        const todayStr = new Date().toISOString().slice(0, 10);

        snapshot.forEach(doc => {
            const data = doc.data();

            // 🔥 ambil tanggal (prioritas: waktu)
            const trxDate = data.waktu?.toDate
                ? data.waktu.toDate()
                : new Date(data.tanggal);

            if (!trxDate || isNaN(trxDate)) return;

            const trxStr = trxDate.toISOString().slice(0, 10);

            // 💰 hari ini
            if (trxStr === todayStr) {
                pendapatanHariIni += Number(data.total || 0);
                transaksiHariIni++;
            }

            // 📊 chart
            const tgl = trxDate.toLocaleDateString("id-ID");

            if (!perHari[tgl]) perHari[tgl] = 0;
            perHari[tgl] += Number(data.total || 0);
        });

        // 🔥 UPDATE UI
        document.getElementById("pendapatanHariIni").innerText = rupiah(pendapatanHariIni);
        document.getElementById("transaksiHariIni").innerText = transaksiHariIni;

        // 📈 CHART
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