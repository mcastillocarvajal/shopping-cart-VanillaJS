const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCart = document.getElementById('template-cart').content
const fragment = document.createDocumentFragment();
let cart = {}; 


document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
        renderCart()
    }
})
cards.addEventListener('click', e => {
    addCart(e)
})
items.addEventListener('click', e => {
    btnAction(e)
})



const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json();
        renderCard(data)
    } catch (error) {
        console.log(error)
    }
}

const renderCard = data => {
    data.forEach(product => {
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('img').setAttribute('src', product.img)
        templateCard.querySelector('p').textContent = product.price
        templateCard.querySelector('button').dataset.id = product.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCart = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCart(e.target.parentElement)
    }
    e.stopPropagation();
}

const setCart = obj => {
    const product = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        price: obj.querySelector('p').textContent,
        qty: 1
    }

    if (cart.hasOwnProperty(product.id)) {
        product.qty = cart[product.id].qty + 1
    }

    cart[product.id] = {...product}
    renderCart()
}

const renderCart = () => {
    items.innerHTML = ""
    Object.values(cart).forEach(product => {
        templateCart.querySelector('th').textContent = product.id
        templateCart.querySelectorAll('td')[0].textContent = product.title
        templateCart.querySelectorAll('td')[1].textContent = product.qty
        templateCart.querySelector('.btn-info').dataset.id = product.id
        templateCart.querySelector('.btn-danger').dataset.id = product.id
        templateCart.querySelector('span').textContent = product.qty * product.price

        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    renderFooter()

    localStorage.setItem('cart', JSON.stringify(cart))
}

const renderFooter = () => {
    footer.innerHTML = ""
    if(Object.keys(cart).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Empty cart - start buying!</th>`

        return
    }
    const nQty = Object.values(cart).reduce((acc, {qty}) => acc + qty, 0)
    const nPrice = Object.values(cart).reduce((acc, {qty, price}) => acc + qty * price, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nQty
    templateFooter.querySelector('span').textContent = nPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnClear = document.getElementById('clear-cart')
    btnClear.addEventListener('click', () => {
        cart = {}
        renderCart()
    })
}

const btnAction = e => {
    if (e.target.classList.contains('btn-info')){

        const product = cart[e.target.dataset.id]
        product.qty++
        cart[e.target.dataset.id] = {...product}
        renderCart()
    }

    if (e.target.classList.contains('btn-danger')){

        const product = cart[e.target.dataset.id]
        product.qty--
        if (product.qty === 0) {
            delete cart[e.target.dataset.id]
        }
        renderCart()
    }
    e.stopPropagation()
}
