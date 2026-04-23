import { checkAuth } from "./auth.js";
import { simpanTransaksi } from "./simpantransaksi.js";

checkAuth();

let menu = [
    { nama: "Mie Ayam", harga: 10000, kategori: "mie", img: "https://images.unsplash.com/photo-1593755768185-f7257e9067ec?w=400" },
    { nama: "Mie Ayam Bakso", harga: 12000, kategori: "mie", img: "https://images.unsplash.com/photo-1747317277795-0d601795682c?w=400" },
    { nama: "Mie Ayam Ceker", harga: 13000, kategori: "mie", img: "https://images.unsplash.com/photo-1680675706515-fb3eb73116d4?w=400" },
    { nama: "Es Teh", harga: 5000, kategori: "minum", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400" },
    { nama: "Es Jeruk", harga: 6000, kategori: "minum", img: "https://images.unsplash.com/photo-1522427088495-81d38b91befb?w=400" }
];

let cart = [];

// 🔥 FORMAT
function formatRupiah(angka) {
    return angka.toLocaleString("id-ID");
}

// 🔥 PRINT STRUK
function printStruk(data) {

    const struk = document.getElementById("struk");
    if (!struk) return;

    document.getElementById("s-no").innerText = "TRX-" + Date.now();
    document.getElementById("s-tanggal").innerText = new Date().toLocaleString("id-ID");

    const list = document.getElementById("s-list");

    let html = "";
    data.items.forEach(item => {
        html += `
        <div class="struk-item">
            <div>${item.nama}</div>
            <div class="struk-row">
                <span>${item.qty} x ${formatRupiah(item.harga)}</span>
                <span>${formatRupiah(item.qty * item.harga)}</span>
            </div>
        </div>`;
    });

    list.innerHTML = html;

    document.getElementById("s-total").innerText = formatRupiah(data.total);
    document.getElementById("s-bayar").innerText = formatRupiah(data.bayar);
    document.getElementById("s-kembali").innerText = formatRupiah(data.kembali);

    struk.style.display = "block";

    setTimeout(() => {
        window.print();

        setTimeout(() => {
            struk.style.display = "none";
        }, 500);

    }, 200);
}

// 🔥 RENDER MENU
function renderMenu(data = menu) {
    const container = document.getElementById("menu-list");
    if (!container) return;

    let html = "";
    data.forEach((m, i) => {
        html += `
        <div class="card" onclick='tambah(${i})'>
            <img src="${m.img}" onerror="this.src='https://via.placeholder.com/150'">
            <h4>${m.nama}</h4>
            <p>Rp ${formatRupiah(m.harga)}</p>
        </div>`;
    });

    container.innerHTML = html;
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

    let bayar = parseInt(document.getElementById("bayar")?.value) || 0;
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
        window.location.href = "/";
    }

    const bayarInput = document.getElementById("bayar");
    const bayar = parseInt(bayarInput.value) || 0;

    if (bayar < total) return alert("Uang kurang!");

    const kembali = bayar - total;

    const data = {
        items: [...cart],
        total,
        bayar,
        kembali,
        kasir: currentUser?.username || "unknown",
        waktu: new Date()
    };

    try {
        await simpanTransaksi(data);
        // printStruk(data);
        if (window.Android) {
            Android.printStruk(JSON.stringify(data));
        } else {
            printStruk(data); // fallback kalau di browser
        }

        cart = [];
        renderCart();

        bayarInput.value = "";
        document.getElementById("kembali").innerText = "0";

    } catch (err) {
        console.error(err);
        alert("Gagal simpan transaksi!");
    }
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
        bayarInput.addEventListener("input", renderCart);
    }

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (user.role !== "admin") {
        document.getElementById("menu-admin").style.display = "none";
    }
});