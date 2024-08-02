document.addEventListener('DOMContentLoaded', () =>{
    const productsContainer = document.querySelector('.insProducts-container');
    const prevButton = document.querySelector('.insPrev-button');
    const nextButton = document.querySelector('.insNext-button');

    let products = [];
    let currentProduct = 0;
    let slideWidth= 0;
    let itemsPerView = 5.5;
    

    //fetching data
    fetch('https://mocki.io/v1/6035ee03-6af9-4d39-ac58-1ba1646d1596')
    .then(response => response.json())
    .then(data => {
        products = data;
        renderProducts();
        updateSlideWidth();
        window.addEventListener('resize', updateSlideWidth);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    //Buttons
    prevButton.addEventListener('click', () => {
        prev();
    });
    nextButton.addEventListener('click', () => {
        next();
    });

    function renderProducts(){
        products.forEach((product, index) => {
            const isFavourite = checkFavourite(product.id);
            const favClass = isFavourite ? 'insFav-active' : '';
            const productHTML = `
                <div class="insProduct" data-index="${index}">
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p class="insOld-price">Price: ${product.price} TL</p>
                    <p class="insNew-price">New Price: ${product.discounted_price} TL</p>
                    <button class="insFav ${favClass}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
                        <path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)">
                        </path>
                    </svg>
                    </button>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        });

        const productElements = productsContainer.querySelectorAll('.insProduct');

        slideWidth = productElements[0].offsetWidth + parseFloat(getComputedStyle(productElements[0]).marginLeft) + parseFloat(getComputedStyle(productElements[0]).marginRight);
        productsContainer.style.transform = `translateX(${currentProduct * -slideWidth}px)`;
        
        const favButtons = document.querySelectorAll('.insFav');
        favButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                button.classList.toggle('insFav-active');
                const productElement = event.target.closest('.insProduct');
                const productIndex = productElement.getAttribute('data-index');
                const product = products[productIndex];
                if(product){
                    favourite(product);
                }else{
                    console.error('Product not found');
                }

            });
        });    
    }

    function updateSlideWidth() {
        const productElements = productsContainer.querySelectorAll('.insProduct');

        if (window.innerWidth <= 768) {
            itemsPerView = 3.5;
        } else if (window.innerWidth <= 1200) {
            itemsPerView = 4.5;
        } else {
            itemsPerView = 5.5;
        }

        slideWidth = productElements[0].offsetWidth + parseFloat(getComputedStyle(productElements[0]).marginLeft) + parseFloat(getComputedStyle(productElements[0]).marginRight);
        productsContainer.style.transform = `translateX(${currentProduct * -slideWidth}px)`;
    }

    function prev(){
        if (currentProduct > 0) {
            currentProduct--;
            productsContainer.style.transform = `translateX(${currentProduct * -slideWidth}px)`;
            productsContainer.style.transition = 'transform 0.5s ease-in-out';
        }
    }
    function next() {
        if (currentProduct < products.length - itemsPerView) {
            currentProduct++;
            productsContainer.style.transform = `translateX(${(currentProduct * -slideWidth)+( slideWidth / 2.3)}px)`;
            productsContainer.style.transition = 'transform 0.5s ease-in-out';
        }
    }

    function favourite(product) {
        let insWishlist = JSON.parse(localStorage.getItem('insWishlist')) || [];
        const existingProduct = insWishlist.find(p => p.id === product.id);

        if(existingProduct){
            insWishlist = insWishlist.filter(p => p.id !== product.id);
            console.log(`Removed id ${product.id}, name ${product.name} from Wishlist`);
            
        }else{
            
            insWishlist.push(product);
            console.log(`Added id ${product.id}, name ${product.name} to Wishlist`);

        }
        
        localStorage.setItem('insWishlist', JSON.stringify(insWishlist));
       
    }
    function checkFavourite(productId) {
        let insWishlist = JSON.parse(localStorage.getItem('insWishlist')) || [];
        return insWishlist.some(product => product.id === productId);
    }
});