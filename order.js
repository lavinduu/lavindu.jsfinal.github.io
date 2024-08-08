document.addEventListener('DOMContentLoaded', function(){
const cartTableBody = document.querySelector('#cart-table tbody');
const totalPriceElement = document.querySelector('.total-price');
const favBtn = document.getElementById('save');
const loadBtn = document.getElementById('load');
const customerNameInput = document.querySelector('#customerName');
const addressInput = document.querySelector('#address');
const contactInput = document.querySelector('#contact');
const emailInput = document.querySelector('#email');
const cityInput = document.querySelector('#city');
const stateInput = document.querySelector('#state');
const zipInput = document.querySelector('#state');
const cardNameInput = document.querySelector('#cardName');
const cardNumberInput = document.querySelector('#cardNumber');
const cvvInput = document.querySelector('#cvv');
const monthInput = document.querySelector('#month');
const yearInput = document.querySelector('#year');
const payBtn = document.getElementById('pay');


  // function to display a message when cart table is empty
  function showEmptyCartMessage() {
    const emptyMessageRow = cartTableBody.insertRow();
    const emptyMessageCell = emptyMessageRow.insertCell(0);
    emptyMessageCell.colSpan = 5;
    emptyMessageCell.innerText = 'Your cart is empty';
    emptyMessageCell.classList.add('empty-cart-message');
}



function populateCartTable() {
        

    const cartData = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartTableBody.innerHTML = ''; // Clear existing rows

    if (cartData.length === 0) {
        showEmptyCartMessage();
    } else {
        cartData.forEach(item => {
            const newRow = cartTableBody.insertRow();
            newRow.insertCell(0).innerText = item.productName;
            newRow.insertCell(1).innerText = item.productPrice;
            newRow.insertCell(2).innerText = item.productQuantity;
            newRow.insertCell(3).innerText = item.totalPrice;
            const removeButton = document.createElement('button');
            removeButton.innerText = 'X';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', function() {
                newRow.remove();
                saveCartToLocalStorage();
                updateTotalPrice();
                if (cartTableBody.rows.length === 0) {
                    showEmptyCartMessage();
                }
            });
            newRow.insertCell(4).appendChild(removeButton);
        });
    }
    updateTotalPrice();
};

function updateTotalPrice() {
    let totalPrice = 0;
    cartTableBody.querySelectorAll('tr').forEach(row => {
        const itemTotalPrice = parseFloat(row.cells[3].innerText.replace(' LKR', ''));
        totalPrice += itemTotalPrice;
    });
    totalPriceElement.innerText = `Total Price: ${totalPrice.toFixed(2)} LKR`;
}

// saving to local storage

function saveToLocalStorage(){
    const cartItems = [];
    cartTableBody.querySelectorAll('tr').forEach(row =>{
        const productName = row.cells[0].innerText;
        const productPrice = row.cells[1].innerText;
        const productQuantity = row.cells[2].innerText;
        const totalPrice = row.cells[3].innerText;
        cartItems.push({productName, productPrice, productQuantity, totalPrice});

        // saving billing and payment details

        const billData = {
            customerName:customerNameInput.value,
            address:addressInput.value,
            email:emailInput.value,
            city:cityInput.value,
            state:stateInput.value,
            zipcode:zipInput.value,
            cardName: cardNameInput.value,
            cardNumber: cardNumberInput.value,
            cvv: cvvInput.value,
            expMonth: monthInput.value,
            expYear: yearInput.value,
            cartItems:cartItems
        };

        localStorage.setItem('favOrder',JSON.stringify(billData));
    });
};

// loading favourites from local storage

function loadFromLocalStorage(){
    const savedOrder = JSON.parse(localStorage.getItem('favOrder'));
    if(savedOrder){
        // populating form

        customerNameInput.value = savedOrder.customerName,
        addressInput.value = savedOrder.address,
        emailInput.value = savedOrder.email,
        cityInput.value = savedOrder.city,
        stateInput.value = savedOrder.state,
        zipInput.value = savedOrder.zipcode,
        cardNameInput.value = savedOrder.cardName,
        cardNumberInput.value = savedOrder.cardNumber,
        monthInput.value = savedOrder.expMonth,
        yearInput.value = savedOrder.expYear,
        cvvInput.value = savedOrder.cvv


        cartTableBody.innerHTML = '';
        savedOrder.cartItems.forEach(item =>{
            const newRow = cartTableBody.insertRow();
            newRow.insertCell(0).innerText = item.productName;
            newRow.insertCell(1).innerText = item.productPrice;
            newRow.insertCell(2).innerText = item.productQuantity;
            newRow.insertCell(3).innerText = item.totalPrice;
            const removeButton = document.createElement('button');
            removeButton.innerHTML = 'X';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click',function(){
                newRow.remove();
                updateTotalPrice();
                if(cartTableBody.rows.length == 0){
                    showEmptyCartMessage();
                }
            });
            newRow.insertCell(4).appendChild(removeButton);
        });
        updateTotalPrice();
        alert('Favourite Order Loaded successfully!');
    }else{
        alert('No saved favourite Orders found.');
    }
};


function validateForm(){
    if(cardNameInput.value =='' || addressInput.value == '' || emailInput.value == '' || cityInput.value == '' || stateInput.value == '' || zipInput.value == ''){
        alert('Please provide all required billing details.');
        return false;
    }

    if(cardNameInput.value == '' || cardNumberInput.value == '' || cvvInput.value == '' || monthInput.value == '' || yearInput.value == ''){
        alert('Please provide all required payment details.');
        return false;

    }
};

   // function to display a message to user with summary of order when payment is successful
   function displaySuccessMessage() {
    let items = '';
    cartTableBody.querySelectorAll('tr').forEach(row => {
        items += `${row.cells[0].innerText} - ${row.cells[2].innerText} x ${row.cells[1].innerText} (Total: ${row.cells[3].innerText})\n`;
    });
    const totalPrice = totalPriceElement.innerText;
    alert(`Thank you for your order!\n\nItems:\n${items}\n${totalPrice}`);
}

// clear form deatils

function clearForm(){
    customerNameInput.value = '';
    addressInput.value = '';
    emailInput.value = '';
    cityInput.value = '';
    stateInput.value = '';
    zipInput.value = '';
    cardNameInput.value = '';
    cardNumberInput.value = '';
    cvvInput.value = '';
    monthInput.value = '';
    yearInput.value = '';


    cartTableBody.innerHTML = '';

    updateTotalPrice();
}

favBtn.addEventListener('click', function(event){
    event.preventDefault();
    saveToLocalStorage();
    alert('Order details saved to favourites.');

});

loadBtn.addEventListener('click', function(event){
    event.preventDefault();
    loadFromLocalStorage();

})

payBtn.addEventListener('click', function(event){
    event.preventDefault();
    if(validateForm){
        displaySuccessMessage();
        clearForm();
    }
})
populateCartTable();

});




