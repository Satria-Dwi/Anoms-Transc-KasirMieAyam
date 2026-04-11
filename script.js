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
    let html = "";
    data.forEach((m, i) => {
        html += `
        <div class="card" onclick="tambah(${i})">
            <img src="${m.img}" onerror="this.src='https://via.placeholder.com/150'">
            <h4>${m.nama}</h4>
            <p>Rp ${rupiah(m.harga)}</p>
        </div>
        `;
    });
    document.getElementById("menu-list").innerHTML = html;
}

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

    // let tax = subtotal * 0.1;
    let tax = 0;
    let total = subtotal + tax;

    document.getElementById("cart-list").innerHTML = html;
    document.getElementById("subtotal").innerText = rupiah(subtotal);
    document.getElementById("tax").innerText = rupiah(tax);
    document.getElementById("total").innerText = rupiah(total);

    let bayar = parseInt(document.getElementById("bayar").value) || 0;
    document.getElementById("kembali").innerText = rupiah(bayar - total);
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
    let total = parseInt(document.getElementById("total").innerText.replace(/\./g, ""));
    let bayar = parseInt(document.getElementById("bayar").value);

    if (bayar < total) return alert("Uang kurang!");

    let kembali = bayar - total;

    let now = new Date();
    let tanggal = now.toLocaleString("id-ID");
    let no = Math.floor(Math.random() * 100000);

    let list = "";
    cart.forEach(item => {
        list += `
        <div class="item-struk">
            <span>${item.nama} x${item.qty}</span>
            <span>${rupiah(item.harga * item.qty)}</span>
        </div>
        `;
    });

    document.getElementById("s-list").innerHTML = list;
    document.getElementById("s-total").innerText = rupiah(total);
    document.getElementById("s-bayar").innerText = rupiah(bayar);
    document.getElementById("s-kembali").innerText = rupiah(kembali);
    document.getElementById("s-tanggal").innerText = tanggal;
    document.getElementById("s-no").innerText = no;

    simpanTransaksi({
        items: cart,
        total: total,
        bayar: bayar,
        kembali: kembali,
        tanggal: new Date().toISOString()
    });

    setTimeout(() => {
        window.print();
    }, 100);

    // reset
    cart = [];
    renderCart();

    let input = document.getElementById("bayar");
    input.value = "";
    input.focus();

    document.getElementById("kembali").innerText = "0";
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

renderMenu();