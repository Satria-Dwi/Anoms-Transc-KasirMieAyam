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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= STATE =================
let semuaData = [];

// ================= LOAD REALTIME =================
function loadData() {
    onSnapshot(collection(db, "transaksi"), (snapshot) => {

        const docs = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        semuaData = docs;

        renderData(docs);
        updateSummary(docs);
    });
}

// ================= RENDER TABLE =================
window.renderData = function (docs) {
    const list = document.getElementById("list");
    if (!list) return;

    let html = "";

    docs.forEach((d) => {

        const waktu = d.waktu?.toDate
            ? d.waktu.toDate().toLocaleString("id-ID")
            : "-";

        const items = (d.items || [])
            .map(i => `${i.nama} (${i.qty})`)
            .join(", ");

        html += `
        <tr>
            <td>${waktu}</td>
            <td>${d.kasir || "-"}</td>
            <td>${items}</td>
            <td>Rp ${formatRupiah(d.total || 0)}</td>
            <td>
                <button onclick="hapusTransaksi('${d.id}')">Hapus</button>
            </td>
        </tr>
        `;
    });

    list.innerHTML = html;
};

// ================= DELETE =================
window.hapusTransaksi = async function (id) {
    if (confirm("Yakin mau hapus transaksi ini?")) {
        await deleteDoc(doc(db, "transaksi", id));
    }
};

// ================= SUMMARY =================
function updateSummary(docs) {
    const total = docs.reduce((a, b) => a + (b.total || 0), 0);

    const totalEl = document.getElementById("total");
    const jumlahEl = document.getElementById("jumlahTransaksi");

    if (totalEl) totalEl.innerText = formatRupiah(total);
    if (jumlahEl) jumlahEl.innerText = docs.length;
}

// ================= FILTER TANGGAL =================
window.filterTanggal = function () {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;

    if (!start || !end) {
        alert("Isi tanggal dulu!");
        return;
    }

    let startDate = new Date(start);
    let endDate = new Date(end);
    endDate.setHours(23, 59, 59);

    let filtered = semuaData.filter(d => {
        let tgl = d.waktu?.toDate ? d.waktu.toDate() : new Date(d.tanggal);
        return tgl >= startDate && tgl <= endDate;
    });

    renderData(filtered);
    updateSummary(filtered);
};

// ================= RESET FILTER =================
window.resetFilter = function () {
    renderData(semuaData);
    updateSummary(semuaData);
};

// ================= EXPORT CSV =================
window.exportCSV = function () {
    let csv = "Waktu,Kasir,Item,Total\n";

    semuaData.forEach(d => {
        const waktu = d.waktu?.toDate
            ? d.waktu.toDate().toLocaleString("id-ID")
            : "-";

        const items = (d.items || [])
            .map(i => `${i.nama}(${i.qty})`)
            .join(" | ");

        csv += `${waktu},${d.kasir || "-"},${items},${d.total}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rekapan.csv";
    a.click();
};

// ================= FORMAT RUPIAH =================
function formatRupiah(angka) {
    return angka.toLocaleString("id-ID");
}

// ================= HOME =================
window.bukaHome = function () {
    location.href = "/";
};

// ================= START =================
loadData();