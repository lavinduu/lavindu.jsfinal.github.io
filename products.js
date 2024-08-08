const hamburger = document.querySelector(".hamburger");
const addToCartButtons = document.querySelectorAll('#add-to-cart');
const cartTableBody = document.querySelector('#cart-table tbody');
const proceedToPayButton = document.querySelector('#proceed-to-pay');
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");
const buttons = document.querySelectorAll('.button-container button');


hamburger.addEventListener('click', ()=>{
   //Animate Links
    navLinks.classList.toggle("open");
    links.forEach(link => {
        link.classList.toggle("fade");
    });

    //Hamburger Animation
    hamburger.classList.toggle("toggle");
});


buttons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


addToCartButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        const productContent = event.target.closest('.content');
        const productName = productContent.querySelector('#name').textContent;
        const productPrice = parseFloat(productContent.querySelector('#price').textContent);
        const productQuantity = parseFloat(productContent.querySelector('#quantity').value);

        if (!productQuantity || productQuantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        const existingRow = Array.from(cartTableBody.querySelectorAll('tr')).find(row => row.cells[0].innerText === productName);

        if (existingRow) {
            // Update existing item
            const existingQuantity = parseFloat(existingRow.cells[2].innerText);
            const newQuantity = existingQuantity + productQuantity;
            const newTotalPrice = productPrice * newQuantity;

            existingRow.cells[2].innerText = newQuantity;
            existingRow.cells[3].innerText = `${newTotalPrice} LKR`;
        } else {
            // Add new item
            const totalPrice = productPrice * productQuantity;

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${productName}</td>
                <td>${productPrice} LKR</td>
                <td>${productQuantity}</td>
                <td>${totalPrice} LKR</td>
                <td><button class="remove-button">X</button></td>
            `;

            cartTableBody.appendChild(newRow);

            const removeButton = newRow.querySelector('.remove-button');
            removeButton.addEventListener('click', function () {
                cartTableBody.removeChild(newRow);
                saveCartToLocalStorage();
            });
        }
        saveCartToLocalStorage();
    });
});


function saveCartToLocalStorage() {
    const cartItems = Array.from(cartTableBody.querySelectorAll('tr')).map(row => {
        return {
            productName: row.cells[0].innerText,
            productPrice: parseFloat(row.cells[1].innerText),
            productQuantity: parseFloat(row.cells[2].innerText),
            totalPrice: parseFloat(row.cells[3].innerText)
        };
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

proceedToPayButton.addEventListener('click', function(){
    saveCartToLocalStorage();
    window.location.href = './order.html';
})

