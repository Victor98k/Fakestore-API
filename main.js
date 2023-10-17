





const content = document.querySelector('.content-card')
const categoriesContent = document.querySelector('.categories')
let count = 0
let total = 0
let cart = []
let pricetotal = []
let totalContent = document.querySelector('#total')
let countContent = document.querySelector('.count')




document.addEventListener('DOMContentLoaded', ()=>{
    main()

       // Save cart to localstorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        count = cart.reduce((total, product) => total + product.quantity, 0);
        addCart(cart);
        countContent.innerHTML = count;
    }

})

function main(){
    getAllCategories()
    getAllProducts()
    totalContent.innerHTML = `$${total}`
    const cart = document.querySelector('.fa-cart-shopping')
    cart.addEventListener('click', ()=> {
        const listShopping = document.querySelector('.listShopping')
        listShopping.classList.toggle('inactive')

    })
    const home = document.querySelector('#home')
    home.addEventListener('click', getAllProducts)
    const showMobilemenu = document.querySelector('.mobilemenu')
    countContent.innerHTML = count
    showMobilemenu.addEventListener('click', ()=> {
        categoriesContent.classList.toggle('inactive')
    })

}


const getAllProducts = async ()=> {
    try {
        const url = "https://fakestoreapi.com/products"
        const request = await fetch(url)
        const results = await request.json()
        showProduct(results)
        

    } catch (error) {
        console.error(error);
        
    }
    

}

const getAllCategories = async ()=> {
    try {
        const url = "https://fakestoreapi.com/products/categories"
        const request = await fetch(url)
        const results = await request.json()
        results.forEach(category => {
            const categories = document.createElement('p')
            categories.innerText = category
            categories.addEventListener('click', ()=>{
                getCategory(category)
            })
            categoriesContent.append(categories)
            
        });
        

    } catch (error) {
        console.error(error);
        
    }
}



// Categorys fetch from API
const getCategory = async (category) => {
    try {
        const url = `https://fakestoreapi.com/products/category/${category}`
        const request = await fetch(url)
        const results = await request.json()
        showProduct(results)
        

    } catch (error) {
        console.error(error);
        
    }
    
}



// Displying my products on website 

const showProduct = (products) => {
    removeHTML(content)
    products.forEach(product => {                     //ForEach loop, displaying id, title, img and price per product. (Rating not working)
        const {id,title, image, price,rating } = product
       const card = document.createElement('div')
       card.classList.add('card')
       const infoCard = document.createElement('div')
       infoCard.classList.add('infoCard')                       // Our cards per product
       const imageProduct = document.createElement('img')
       imageProduct.src = image 
       const rateProduct = document.createElement('b');
        rateProduct.innerText = `Rating: ${rating}`;
       const titleProduct = document.createElement('h2')
       titleProduct.addEventListener('click', ()=> {
        showModal(product)
        
       })
       titleProduct.innerText = title
       const priceProduct = document.createElement('p')
       priceProduct.innerText = `${price}€`
       const button = document.createElement('button')
       button.innerText = "Add To Cart"
       button.classList.add('btn')
       button.addEventListener('click', ()=>{ 
        const inCartIndex = cart.findIndex(index => index.id === id)
        console.log(inCartIndex);
        if(inCartIndex !== -1){
            cart[inCartIndex].total+= price
            cart[inCartIndex].quantity += 1
        }
        else{
            cart.push({
                id,
                title,
                image,
                price,
                total: price,
                quantity: 1
            })
        }
        pricetotal.push(price)
        let totalGeneral = pricetotal.reduce((a,b) => a + b, 0)
        totalContent.innerHTML = `$${totalGeneral.toLocaleString("en")}`;
        countContent.innerHTML = count += 1
        addCart(cart)
        
       })
       infoCard.append(imageProduct,titleProduct,priceProduct, rateProduct)
       card.append(infoCard, button)
       content.append(card)

       


    })
}




        // Our cart

const addCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));

    const contentlistShopping = document.querySelector('.content-listShopping');
    removeHTML(contentlistShopping);
    cart.forEach(product => {
        const contentProduct = document.createElement('div');
        contentProduct.classList.add('contentProductList');

        const img = document.createElement('img');
        img.src = product.image;

        const info = document.createElement('div');
        info.classList.add('info');

        const title = document.createElement('h3');
        title.innerText = product.title;

        const price = document.createElement('p');
        price.innerText = `${product.total}€`;

        const removeProduct = document.createElement('span');
        removeProduct.innerText = 'X';
        removeProduct.classList.add('remove-button');




        // Event click remover product
        removeProduct.addEventListener('click', () => {
            deleteProduct(product);
        });
        info.appendChild(title);
        info.appendChild(price);

        contentProduct.appendChild(img);
        contentProduct.appendChild(removeProduct);
        contentProduct.appendChild(info);

        contentlistShopping.appendChild(contentProduct);

        removeProduct.addEventListener('click', () => {
            deleteProduct(product);
        });
    });
};











const deleteProduct = (product) => {
    const filterProduct = cart.filter((f) => f.id !== product.id);
    cart = [...filterProduct];

    const newTotalgeneral = filterProduct.reduce((a, b) => a + b.total, 0);

    // count based on the number of products in the cart
    count = cart.reduce((total, product) => total + product.quantity, 0);
    
    if (newTotalgeneral === 0) {
        pricetotal = [];
    }

    localStorage.setItem('cart', JSON.stringify(cart));


    countContent.innerHTML = count; // Update the count
    totalContent.innerHTML = `$${newTotalgeneral.toLocaleString("en")}`;
    addCart(cart);
};










                // Modal card

const showModal = (product)=> {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML = `
        <div class="moreinfo">
            <span class="closed">X</span>
            <h2>${product.title}</h2>
            <img src="${product.image}" alt"${product.title}">
            <p>${product.description}</p>     
            <p>Rating <box-icon type='solid' name='star'></box-icon>
            ${product.rating.rate}</p>
            
        </div>
    `
    

    setTimeout(()=>{
        const moreInfo = document.querySelector('.moreinfo')
        moreInfo.classList.add('animated')
    },100)


    modal.addEventListener('click', e => {
        e.preventDefault()
        if(e.target.classList.contains('closed')){
            const moreInfo = document.querySelector('.moreinfo')
            moreInfo.classList.add('close')
            setTimeout(()=>{
                modal.remove()

            },500) 
        }   
            
    })
    document.querySelector('.content').appendChild(modal)

  


}
const removeHTML = (HTML)=> {
    while(HTML.firstChild){
        HTML.removeChild(HTML.firstChild)
    }

}






