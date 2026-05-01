import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= FIREBASE =================
const firebaseConfig = {
    apiKey: "AIzaSyB-vWhdcOYRayZ8YHACJ-fvzpci0eWKRGQ",
    authDomain: "anos-kasirmieayam.firebaseapp.com",
    projectId: "anos-kasirmieayam",
};

// ================= INIT =================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= FORMAT =================
function rupiah(angka) {
    return new Intl.NumberFormat("id-ID").format(angka);
}

let chart = null;

// ================= LOAD DASHBOARD =================
function loadDashboard() {
    onSnapshot(collection(db, "transaksi"), (snapshot) => {
        let pendapatanHariIni = 0;
        let transaksiHariIni = 0;
        let perHari = {};

        const today = new Date();
        const todayStr = today.toLocaleDateString("sv-SE");

        // 🔥 siapkan 7 hari terakhir (termasuk hari ini)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            const key = d.toLocaleDateString("sv-SE"); // yyyy-mm-dd
            const label = d.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit"
            }); // 01/05

            last7Days.push({ key, label });
            perHari[key] = 0; // default 0 biar tanggal kosong tetap tampil
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            const trxDate = data.createdAt?.toDate
                ? data.createdAt.toDate()
                : data.createdAt
                    ? new Date(data.createdAt)
                    : data.waktu_raw
                        ? new Date(data.waktu_raw)
                        : data.waktu
                            ? new Date(data.waktu)
                            : null;

            if (!trxDate || isNaN(trxDate)) return;

            const trxStr = trxDate.toLocaleDateString("sv-SE");

            // 💰 Hari ini
            if (trxStr === todayStr) {
                pendapatanHariIni += Number(data.total || 0);
                transaksiHariIni++;
            }

            // 📊 hanya hitung 7 hari terakhir
            if (perHari[trxStr] !== undefined) {
                perHari[trxStr] += Number(data.total || 0);
            }
        });

        // 🔥 UPDATE UI
        document.getElementById("pendapatanHariIni").innerText = rupiah(pendapatanHariIni);
        document.getElementById("transaksiHariIni").innerText = transaksiHariIni;

        // 📈 chart data 7 hari (kiri lama → kanan baru)
        const labels = last7Days.map(d => d.label);
        const values = last7Days.map(d => perHari[d.key]);

        const ctx = document.getElementById("salesChart");

        if (ctx) {
            if (chart) chart.destroy();

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels,
                    datasets: [{
                        label: "Penjualan 7 Hari",
                        data: values,
                        tension: 0.35,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    });
}

// ================= START =================
window.addEventListener("DOMContentLoaded", loadDashboard);