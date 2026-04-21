let menu = [
    {
        nama: "Mie Ayam",
        harga: 10000,
        kategori: "mie",
        img: "https://images.unsplash.com/photo-1593755768185-f7257e9067ec?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400"
    },
    {
        nama: "Mie Ayam Bakso",
        harga: 12000,
        kategori: "mie",
        img: "https://images.unsplash.com/photo-1747317277795-0d601795682c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400"
    },
    {
        nama: "Mie Ayam Ceker",
        harga: 13000,
        kategori: "mie",
        img: "https://images.unsplash.com/photo-1680675706515-fb3eb73116d4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400"
    },
    {
        nama: "Es Teh",
        harga: 5000,
        kategori: "minum",
        img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
    },
    {
        nama: "Es Jeruk",
        harga: 6000,
        kategori: "minum",
        img: "https://images.unsplash.com/photo-1522427088495-81d38b91befb?q=80&w=701&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400"
    }
];

let cart = [];

// format rupiah
function rupiah(angka) {
    return angka.toLocaleString("id-ID");
}

// render menu
function renderMenu(data = menu) {
    const container = document.getElementById("menu-list");
    if (!container) return;

    let html = "";

    data.forEach((m, i) => {
        html += `
            <div class="card" onclick='tambah(${i})'>
                <img src="${m.img}" onerror="this.src='https://via.placeholder.com/150'">
                <h4>${m.nama}</h4>
                <p>Rp ${rupiah(m.harga)}</p>
            </div>
            `;
    });

    container.innerHTML = html;
}

window.tambahByName = function (nama) {
    let item = menu.find(m => m.nama === nama);
    if (!item) return;

    let found = cart.find(c => c.nama === item.nama);

    if (found) {
        found.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    renderCart();
};

// tambah ke cart
function tambah(i) {
    let item = menu[i];
    let found = cart.find(c => c.nama === item.nama);

    if (found) {
        found.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    renderCart();
}

// render cart
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
            Rp ${rupiah(total)}
        </div>
        `;
    });

    let tax = 0;
    let total = subtotal + tax;

    const subtotalEl = document.getElementById("subtotal");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");
    const bayarEl = document.getElementById("bayar");
    const kembaliEl = document.getElementById("kembali");

    if (cartList) cartList.innerHTML = html;
    if (subtotalEl) subtotalEl.innerText = rupiah(subtotal);
    if (taxEl) taxEl.innerText = rupiah(tax);
    if (totalEl) totalEl.innerText = rupiah(total);

    let bayar = parseInt(bayarEl?.value) || 0;
    if (kembaliEl) kembaliEl.innerText = rupiah(bayar - total);
}

// tambah qty
function tambahQty(i) {
    cart[i].qty++;
    renderCart();
}

// kurang qty
function kurang(i) {
    cart[i].qty--;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    renderCart();
}

// proses bayar + struk
function prosesBayar() {
    const totalText = document.getElementById("total")?.innerText || "0";
    let total = parseInt(totalText.replace(/\./g, ""));

    let bayar = parseInt(document.getElementById("bayar")?.value || 0);

    if (bayar < total) return alert("Uang kurang!");

    let kembali = bayar - total;

    let now = new Date();
    let tanggal = now.toISOString();
    let no = Math.floor(Math.random() * 100000);

    addDoc(collection(db, "transaksi"), {
        items: cart,
        total,
        bayar,
        kembali,
        kasir: "Satria", // atau ambil dari login nanti
        waktu: new Date()
    });

    window.print();

    cart = [];
    renderCart();

    const bayarInput = document.getElementById("bayar");
    if (bayarInput) {
        bayarInput.value = "";
        bayarInput.focus();
    }

    const kembaliEl = document.getElementById("kembali");
    if (kembaliEl) kembaliEl.innerText = "0";
}

// filter
function filter(kat) {
    if (kat === "all") return renderMenu();
    renderMenu(menu.filter(m => m.kategori === kat));
}

// search
function searchMenu() {
    let key = document.getElementById("search").value.toLowerCase();
    renderMenu(menu.filter(m => m.nama.toLowerCase().includes(key)));
}

// window.bukaHome = function () {
//     location.href = "/Anoms-transac/";
// };

// window.bukaHistory = function () {
//     location.href = "/Anoms-transac/rekapan/";
// };

// window.bukaKasir = function () {
//     location.href = "/Anoms-transac/kasir/";
// };

window.bukaHome = function () {
    location.href = "/Anoms-Transc-KasirMieAyam/";
};

window.bukaHistory = function () {
    location.href = "/Anoms-Transc-KasirMieAyam/rekapan/";
};

window.bukaKasir = function () {
    location.href = "/Anoms-Transc-KasirMieAyam/kasir/";
};


renderMenu();