let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Form submit working");
            contactForm.reset();
        });
    }

    const yearEl = document.getElementById("footerYear");
    if (yearEl) {
        yearEl.innerText = new Date().getFullYear();
    }

const searchBar = document.getElementById("searchBar");
const searchList = document.getElementById("searchList");
const products = document.querySelectorAll(".product");

if(searchBar && searchList){

    searchBar.addEventListener("input", function(){
        const query = this.value.toLowerCase();
        searchList.innerHTML = "";

        if(query === ""){
            searchList.style.display = "none";
            return;
        }

        let found = false;

        products.forEach(product => {
            const name = product.dataset.name.toLowerCase();

            if(name.includes(query)){
                found = true;
                const item = document.createElement("div");
                item.innerText = product.dataset.name;

                item.addEventListener("click", ()=>{
                    product.scrollIntoView({behavior:"smooth", block:"center"});
                    searchList.style.display = "none";
                    searchBar.value = product.dataset.name;
                });

                searchList.appendChild(item);
            }
        });

        searchList.style.display = found ? "block" : "none";
    });

    document.addEventListener("click", (e)=>{
        if(!e.target.closest(".search-container")){
            searchList.style.display = "none";
        }
    });
}

    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".save-btn");
        if (!btn) return;

        const product = btn.closest(".pin-container");
        if (!product) return;

        const name = product.dataset.name;
        const link = product.dataset.link;
        const image = product.dataset.image;

        if (!name || !link || !image) {
            alert("Missing data attributes");
            return;
        }

        const exists = wishlist.find(item => item.link === link);

        if (!exists) {
            wishlist.push({ name, link, image });
            btn.innerText = "Saved";
            btn.classList.add("saved");
        } else {
            wishlist = wishlist.filter(item => item.link !== link);
            btn.innerText = "Save";
            btn.classList.remove("saved");
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistCount();
    });

    console.log("SAVE CLICKED");

    document.querySelectorAll(".pin-container").forEach(product => {
        const btn = product.querySelector(".save-btn");
        if (!btn) return;

        if (wishlist.some(item => item.link === product.dataset.link)) {
            btn.innerText = "Saved";
            btn.classList.add("saved");
        }
    });

    updateWishlistCount();
    renderWishlist();
});

function updateWishlistCount() {
    document.querySelectorAll(".wishlist-count").forEach(el => {
        el.innerText = wishlist.length;
    });
}

function renderWishlist() {
    const container = document.getElementById("wishlistContainer");
    const emptyMsg = document.getElementById("emptyMsg");

    if (!container || !emptyMsg) return;

    container.innerHTML = "";

    if (wishlist.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }

    emptyMsg.style.display = "none";

    wishlist.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "wishlist-card";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h4 style="margin:10px 0">${item.name}</h4>
            <button class="remove-btn">Remove</button>
        `;

        card.querySelector(".remove-btn").addEventListener("click", () => {
            wishlist.splice(index, 1);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            renderWishlist();
            updateWishlistCount();
        });

        container.appendChild(card);
    });
}

document.addEventListener("click", function(e){

    if(e.target.tagName === "IMG" && e.target.closest(".pin-container, .wishlist-card")){
        const modal = document.getElementById("imgModal");
        const modalImg = document.getElementById("modalImg");

        modalImg.src = e.target.src;
        modal.style.display = "flex";
    }

    if(e.target.classList.contains("close-btn") || e.target.id === "imgModal"){
        document.getElementById("imgModal").style.display = "none";
    }
});
