/**
 * Product list
 */
var products = {
    "ayakkabi": {
        "name": "Ayakkabı",
        "price": 18
    },
    "canta": {
        "name": "Çanta",
        "price": 19
    },
    "gomlek": {
        "name": "Gömlek",
        "price": 20
    },
    "ceket": {
        "name": "Ceket",
        "price": 21
    },
    "sapka": {
        "name": "Şapka",
        "price": 22
    }
}

class CartManager {

    /**
     * @param {JSON} products Product list in JSON
     * @param {htmlString} elemSelect Select element to add to cart.
     * @param {htmlString} elemButton Button element to listen click event.
     * @param {htmlString} elemCart Cart element to put selected item in it.
     * @param {htmlString} elemTotal Element to write total price of the items in the cart.
     */
    constructor(products, elemSelect, elemSortBy, elemButton, elemCart, elemTotal) {

        // Assign variables to use later
        this.products = products;
        this.elemSelect = elemSelect;
        this.elemSortBy = elemSortBy;
        this.elemButton = elemButton;
        this.elemCart = elemCart;
        this.elemTotal = elemTotal;
        this.cart = {
            "ayakkabi": 1
        };
        
        // Fill the select element with json content that is passed as an argument.
        jQuery.each(products, (key, value) => {
            let elemOption = $(`<option value="${key}">${value.name} (${value.price}₺)</option>`);
            this.elemSelect.append(elemOption);
        });
        
        // Listen for the button click event
        elemButton.on("click", () => {
            this.onButtonClicked();
        });
        // Listen for the sorting change
        elemSortBy.on("change", () => {
            this.updateCartView();
        });

        // Initial render for the cart view
        this.updateCartView();

    }

    /**
     * Adds item to the list and updates the cart view according to list
     * @param {*} itemKey Item to add
     */
    cartItemAdd(itemKey){
        this.cart[itemKey] = (itemKey in this.cart) ? this.cart[itemKey] + 1 : 1
        this.updateCartView();
    }

    /**
     * Removes item from the list and updates the cart view according to list
     * @param {*} itemKey Item to remove
     */
    cartItemRemove(itemKey){
        this.cart[itemKey]--;
        this.updateCartView();
    }

    /**
     * This function will render the cart view.
     */
    updateCartView() {

        this.elemCart.empty(); // Clear the element
        let totalPrice = 0;

        // Sort cart
        let sortedCart = [];
        jQuery.each(this.cart, (itemId, itemAmount) => { // this loop converts object to array, so we can apply sort function
            if(itemAmount < 1) return; // no need to sort items with 0 amount
            let itemPrototype = this.getProductById(itemId);
            sortedCart.push(
                {
                    itemId: itemId, 
                    itemAmount: itemAmount, 
                    itemName: itemPrototype.name, 
                    itemPrice: itemPrototype.price
                }
            );
        });
        sortedCart.sort(this.getSortingAlgorithm());
        
        // Render list
        sortedCart.forEach(v => {
            
            totalPrice += v.itemAmount * v.itemPrice;
            
            // Create element
            let elem = $(`
                <div class="cart-item">
                    <div class="item-text">
                        <span class="item-name">${v.itemName}</span>
                        <span class="item-details">${v.itemAmount} adet - ${v.itemAmount * v.itemPrice}₺</span>
                    </div>
                    <span class="item-button btn btn-danger">Kaldır</span>
                </div>
            `);
            
            // Create listener for the remove button
            elem.find(".item-button").on("click", () => {
                this.cartItemRemove(v.itemId);
            });

            // Put it
            this.elemCart.append(elem);

        }); 
        
        this.elemTotal.text(`${totalPrice}₺`);

    }

    /**
     * Returns the product's data as a json table
     * @param {string} key Key to look for
     * @returns {JSON}
     */
    getProductById(key){
        return this.products[key];
    }

    /**
     * Returns the selected item in select element.
     * @returns {string} Selected item
     */
    getSelectedItem() {
        return this.elemSelect.find(":selected").attr("value");
    }

    /**
     * Returns sorting algorithm
     * @returns {string}
     */
    getSortingAlgorithm() {

        let sortBy = this.elemSortBy.find(":selected").attr("value");
        
        switch(sortBy) {
            case "alphabet-az":
                return (a, b) => {
                    if(a.itemName < b.itemName) return -1;
                    if(a.itemName > b.itemName) return 1;
                    return 0;
                }
            case "alphabet-za":
                return (a, b) => {
                    if(a.itemName < b.itemName) return 1;
                    if(a.itemName > b.itemName) return -1;
                    return 0;
                }
            case "price-high":
                return (a, b) => (a.itemPrice * a.itemAmount - b.itemPrice * b.itemAmount) * -1;
            case "price-low":
                return (a, b) => a.itemPrice * a.itemAmount - b.itemPrice * b.itemAmount;
            case "amount-high":
                return (a, b) => (a.itemAmount - b.itemAmount) * -1;
            case "amount-low":
                return (a, b) => a.itemAmount - b.itemAmount;
        }

    }

    /**
     * Button clicked event
     */
    onButtonClicked(){
        this.cartItemAdd(this.getSelectedItem());
    }

}

/* JQuery document ready */
$(() => {
    const mn = new CartManager(
        products,
        $("select[name='products']"),
        $("select[name='sortby']"),
        $("#btn-add-to-cart"),
        $("#cart-content"),
        $("#total")
    );
});
