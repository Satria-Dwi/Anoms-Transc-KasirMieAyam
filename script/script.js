import { checkAuth } from "./auth.js";
import { simpanTransaksi } from "./simpantransaksi.js";

checkAuth();

let menu = [
    { nama: "Mie Pangsit Jadul", harga: 5000, kategori: "mie", img: "/Anoms-Transc-KasirMieAyam/images/mie-pangsit-jadul.png" },
    { nama: "Mie Pangsit Isi", harga: 7000, kategori: "mie", img: "/Anoms-Transc-KasirMieAyam/images/mie-pangsit-isi.png" },
    { nama: "Mie Pangsit Pentol", harga: 8000, kategori: "mie", img: "/Anoms-Transc-KasirMieAyam/images/mie-pangsit-pentol.png" },
    { nama: "Mie Pangsit Spesial", harga: 13000, kategori: "mie", img: "/Anoms-Transc-KasirMieAyam/images/mie-pangsit-spesial.png" },
    { nama: "Mie Ayam", harga: 7000, kategori: "mie", img: "https://images.unsplash.com/photo-1593755768185-f7257e9067ec?w=400" },
    { nama: "Mie Ayam Ceker", harga: 8000, kategori: "mie", img: "https://images.unsplash.com/photo-1680675706515-fb3eb73116d4?w=400" },
    { nama: "Mie Ayam Pentol", harga: 10000, kategori: "mie", img: "https://images.unsplash.com/photo-1747317277795-0d601795682c?w=400" },

    { nama: "Teh Dingin", harga: 3000, kategori: "minum", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400" },
    { nama: "Teh Hangat", harga: 3000, kategori: "minum", img: "/Anoms-Transc-KasirMieAyam/images/teh-hangat.jpg" },
    { nama: "Jeruk Dingin", harga: 4000, kategori: "minum", img: "https://images.unsplash.com/photo-1522427088495-81d38b91befb?w=400" },
    { nama: "Jeruk Hangat", harga: 4000, kategori: "minum", img: "/Anoms-Transc-KasirMieAyam/images/jeruk-hangat.jpg" },
    { nama: "Kopi Hitam", harga: 5000, kategori: "minum", img: "https://images.unsplash.com/photo-1746932714223-b48aa05b6e68?w=400" },
    { nama: "Kopi Susu", harga: 5000, kategori: "minum", img: "https://images.unsplash.com/photo-1669696742918-dc2d9dd3bd8c?w=400" },
    { nama: "Wedang Jahe", harga: 5000, kategori: "minum", img: "/Anoms-Transc-KasirMieAyam/images/wedang-jahe.jpg" },
    { nama: "Jus All Varian", harga: 6000, kategori: "minum", img: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400" },
    { nama: "Jus Alpukat", harga: 8000, kategori: "minum", img: "https://images.unsplash.com/photo-1622704430673-59c152a9991c?w=400" },

    { nama: "Pentol 1 Porsi", harga: 5000, kategori: "topping", img: "/Anoms-Transc-KasirMieAyam/images/pentol.jpg" },
    { nama: "Ceker 1 Porsi", harga: 5000, kategori: "topping", img: "/Anoms-Transc-KasirMieAyam/images/ceker.jpg" },
    { nama: "Kerupuk", harga: 1000, kategori: "topping", img: "/Anoms-Transc-KasirMieAyam/images/kerupuk.jpg" },
    { nama: "Kerupuk", harga: 2000, kategori: "topping", img: "/Anoms-Transc-KasirMieAyam/images/kerupuk.jpg" },
    { nama: "Sate Puyuh", harga: 3000, kategori: "topping", img: "/Anoms-Transc-KasirMieAyam/images/sate-telur-puyuh.jpg" },
    { nama: "Sate Usus", harga: 2000, kategori: "topping", img: "/Anoms-Transc-KasirMieAyam/images/sate-usus.jpg" },


];

let cart = [];

// 🔥 FORMAT
function formatRupiah(angka) {
    return angka.toLocaleString("id-ID");
}

// 🔥 PRINT STRUK
function printStruk(data) {
    const modal = document.getElementById("strukModal");

    if (!modal) {
        console.log("STRUK MODAL TIDAK ADA");
        return;
    }

    // paksa tampil FULL
    modal.style.display = "flex";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.zIndex = "999999";

    document.getElementById("s-no").innerText = "TRX-" + Date.now();
    document.getElementById("s-noMeja").innerText = "Meja: " + (data.noMeja || "-");
    document.getElementById("s-tanggal").innerText = new Date().toLocaleString("id-ID");

    const list = document.getElementById("s-list");

    let html = "";
    data.items.forEach(item => {
        html += `
        <div style="display:flex;justify-content:space-between;">
            <span>${item.nama}</span>
            <span>${item.qty} x Rp ${formatRupiah(item.harga)}</span>
        </div>`;
    });

    list.innerHTML = html;

    document.getElementById("s-total").innerText = "Rp " + formatRupiah(data.total);
    document.getElementById("s-bayar").innerText = "Rp " + formatRupiah(data.bayar);
    document.getElementById("s-kembali").innerText = "Rp " + formatRupiah(data.kembali);

    // auto close
    setTimeout(() => {
        modal.style.display = "none";
    }, 10000);
}

function tutupStruk() {
    document.getElementById("strukModal").style.display = "none";
}

window.tutupStruk = tutupStruk;

// 🔥 RENDER MENU
function renderMenu(data = menu) {
    const container = document.getElementById("menu-list");
    if (!container) return;

    const grouped = data.reduce((acc, item) => {
        if (!acc[item.kategori]) acc[item.kategori] = [];

        const originalIndex = menu.findIndex(m =>
            m.nama === item.nama &&
            m.harga === item.harga &&
            m.kategori === item.kategori
        );

        acc[item.kategori].push({
            ...item,
            index: originalIndex
        });

        return acc;
    }, {});

    let html = "";

    Object.keys(grouped).forEach(kategori => {
        html += `
            <div class="menu-section">
                <h2 class="menu-title">${kategori}</h2>
                <div class="menu-grid">
        `;

        grouped[kategori].forEach(m => {
            html += `
                <div class="card" data-index="${m.index}">
                    <img src="${m.img}" onerror="this.src='https://via.placeholder.com/150'">
                    <h4>${m.nama}</h4>
                    <p>Rp ${formatRupiah(m.harga)}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // bind klik setelah render
    container.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function () {
            const index = parseInt(this.dataset.index);
            tambah(index);
        });
    });
}

// 🔥 TAMBAH
function tambah(i) {
    let item = menu[i];
    let found = cart.find(c => c.nama === item.nama);

    if (found) found.qty++;
    else cart.push({ ...item, qty: 1 });

    renderCart();
}

// 🔥 CART
function renderCart() {
    const cartList = document.getElementById("cart-list");
    if (!cartList) return;

    let html = "";
    let subtotal = 0;

    cart.forEach((item, i) => {
        let total = item.harga * item.qty;
        subtotal += total;

        html += `
        <div class="item">
            ${item.nama}
            <div>
                <span class="qty-btn" onclick="kurang(${i})">-</span>
                ${item.qty}
                <span class="qty-btn" onclick="tambahQty(${i})">+</span>
            </div>
            Rp ${formatRupiah(total)}
        </div>`;
    });

    let tax = 0;
    let total = subtotal + tax;

    cartList.innerHTML = html;

    document.getElementById("subtotal").innerText = formatRupiah(subtotal);
    document.getElementById("tax").innerText = formatRupiah(tax);
    document.getElementById("total").innerText = formatRupiah(total);

    let bayar = parseInt(document.getElementById("bayar")?.value.replace(/\D/g, "")) || 0;
    let kembali = Math.max(0, bayar - total);

    document.getElementById("kembali").innerText = formatRupiah(kembali);
}

// 🔥 QTY
function tambahQty(i) {
    cart[i].qty++;
    renderCart();
}

function kurang(i) {
    cart[i].qty--;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    renderCart();
}

// 🔥 BAYAR
async function prosesBayar() {
    if (cart.length === 0) return alert("Keranjang kosong!");

    const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
        window.location.href = "/Anoms-Transc-KasirMieAyam";
        return;
    }

    const bayarInput = document.getElementById("bayar");
    const bayar = parseInt(bayarInput.value.replace(/\D/g, "")) || 0;
    const noMeja = document.getElementById("noMeja")?.value.trim() || "-";

    if (bayar < total) return alert("Uang kurang!");

    const kembali = bayar - total;

    const data = {
        items: [...cart],
        total,
        bayar,
        kembali,
        noMeja,
        kasir: currentUser?.username || "unknown",
        waktu: new Date()
    };

    // 🔥 FORMAT STRUK UNTUK PRINTER
    const trxId = "TRX-" + Date.now();
    const now = new Date();
    const tanggal =
        now.getDate().toString().padStart(2, "0") + "-" +
        (now.getMonth() + 1).toString().padStart(2, "0") + "-" +
        now.getFullYear() + " " +
        now.getHours().toString().padStart(2, "0") + ":" +
        now.getMinutes().toString().padStart(2, "0");

    let text = buildStruk(data, trxId, tanggal);

    try {
        await simpanTransaksi(data);

        // tampilkan struk dulu
        printStruk(data);

        // kasih delay sebelum reset
        setTimeout(() => {
            if (window.Android?.printStruk) {
                window.Android.printStruk(text);
            }

            cart = [];
            renderCart();
            bayarInput.value = "";
            document.getElementById("noMeja").value = "";
            document.getElementById("kembali").innerText = "0";

        }, 800); // 🔥 naikkan dari 500 → 800-1200ms

    } catch (err) {
        console.error(err);
    }
}

function buildStruk(data, trxId, tanggal) {
    const width = 32; // lebar karakter printer 58mm

    const center = (text) => {
        const pad = Math.max(0, Math.floor((width - text.length) / 2));
        return " ".repeat(pad) + text + "\n";
    };

    const line = () => "-".repeat(width) + "\n";
    const doubleLine = () => "=".repeat(width) + "\n";

    const leftRight = (left, right = "") => {
        left = String(left);
        right = String(right);

        if (left.length > width) left = left.slice(0, width);
        if (right.length > width) right = right.slice(0, width);

        const space = width - left.length - right.length;
        return left + " ".repeat(Math.max(1, space)) + right + "\n";
    };

    let text = "";

    // HEADER
    text += center("MIE AYAM OM PANGSIT");
    text += center("Jl. Gubernur Suryo");
    text += center("Sebelah Widury Laundry");
    text += center("Telp. -");
    text += center("IG / FB: om_pangsit");
    text += doubleLine();

    // INFO
    text += leftRight(`No: ${trxId}`);
    text += leftRight(`Kasir: ${data.kasir}`);
    text += leftRight(`Meja: ${data.noMeja || "-"}`, "");
    text += leftRight(`Tgl: ${tanggal}`, "");
    text += line();

    // ITEMS
    data.items.forEach((item, i) => {
        const total = item.qty * item.harga;

        // Nama item
        const itemName = `${i + 1}. ${item.nama}`.slice(0, width);
        text += itemName + "\n";

        // Qty x harga    total
        const left = `${item.qty} x Rp ${formatRupiah(item.harga)}`;
        const right = `Rp ${formatRupiah(total)}`;
        text += leftRight("   " + left, right);
    });

    text += line();

    // SUMMARY
    const totalQty = data.items.reduce((a, b) => a + b.qty, 0);

    text += leftRight(`Total QTY : ${totalQty}`, "");
    text += leftRight("Subtotal", `Rp ${formatRupiah(data.total)}`);
    text += leftRight("Total", `Rp ${formatRupiah(data.total)}`);
    text += line();

    // PAYMENT
    text += leftRight("Bayar", `Rp ${formatRupiah(data.bayar)}`);
    text += leftRight("Kembali", `Rp ${formatRupiah(data.kembali)}`);
    text += line();

    // FOOTER
    text += center("Terima Kasih :)");
    text += center("Selamat Menikmati");
    text += "\n\n";

    return text;
}

// 🔥 SEARCH
function searchMenu() {
    let key = document.getElementById("search").value.toLowerCase();
    renderMenu(menu.filter(m => m.nama.toLowerCase().includes(key)));
}

// 🔥 LOGOUT
function logout() {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("user");
    // window.location.href = "/";
    window.location.href = "/Anoms-Transc-KasirMieAyam/";
}

function pilihPrinter() {
    if (window.Android && Android.selectPrinter) {
        Android.selectPrinter();
    } else {
        alert("Fitur pilih printer hanya tersedia di APK");
    }
}

window.pilihPrinter = pilihPrinter;

// 🔥 GLOBAL
window.tambah = tambah;
window.tambahQty = tambahQty;
window.kurang = kurang;
window.renderMenu = renderMenu;
window.renderCart = renderCart;
window.prosesBayar = prosesBayar;
window.searchMenu = searchMenu;
window.logout = logout;

// 🔥 NAV
window.bukaHome = () => location.href = "/Anoms-Transc-KasirMieAyam/views/dashboard/";
window.bukaHistory = () => location.href = "/Anoms-Transc-KasirMieAyam/views/rekapan/";
window.bukaKasir = () => location.href = "/Anoms-Transc-KasirMieAyam/views/kasir/";

// window.bukaHome = () => location.href = "/views/dashboard/";
// window.bukaHistory = () => location.href = "/views/rekapan/";
// window.bukaKasir = () => location.href = "/views/kasir/";

// 🔥 INIT (AMAN)
document.addEventListener("DOMContentLoaded", () => {

    renderMenu();

    const bayarInput = document.getElementById("bayar");
    if (bayarInput) {
        bayarInput.addEventListener("input", function () {
            let angka = this.value.replace(/\D/g, ""); // ambil angka saja
            this.value = angka ? Number(angka).toLocaleString("id-ID") : "";
            renderCart();
        });
    }

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user?.role !== "admin") {
        document.getElementById("menu-admin").style.display = "none";
    }
});