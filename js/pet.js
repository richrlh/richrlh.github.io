const storeItems = [
    // TOYS
    {name:"Tennis Ball", category:"Toy", price:2, image:"assets/images/tennis-ball.png"},
    {name:"Rope Toy", category:"Toy", price:4},
    {name:"Squeaky Duck", category:"Toy", price:6},
    {name:"Frisbee", category:"Toy", price:8},

    // CLOTHES
    {name:"Blue Hat", category:"Clothing", price:3, image:"assets/images/blue-hat.png"},
    {name:"Red Scarf", category:"Clothing", price:5},
    {name:"Raincoat", category:"Clothing", price:7},
    {name:"Bow Tie", category:"Clothing", price:10},

    // FOOD
    {name:"Treat", category:"Food", price:2, image:"assets/images/kibble.png"},
    {name:"Peanut Biscuit", category:"Food", price:4},
    {name:"Chicken Snack", category:"Food", price:6},
    {name:"Steak Dinner", category:"Food", price:12}
];

let inventory =
    JSON.parse(
        localStorage.getItem("fgInventory")
    ) || {
        toys:["Tennis Ball"],
        clothing:["Blue Hat"],
        food:["Kibble"]
    };

function saveInventory(){
    localStorage.setItem(
        "fgInventory",
        JSON.stringify(inventory)
    );

}

let equipped =
    JSON.parse(
        localStorage.getItem("fgEquipped")
    ) || {

        toy:"Tennis Ball",
        clothing:"Blue Hat",
        food:"Kibble"
    };

let purchasedItems =
    JSON.parse(
        localStorage.getItem(
            "fgPurchased"
        )
    ) || [];

function saveEquipped(){
    localStorage.setItem(
        "fgEquipped",
        JSON.stringify(equipped)
    );
}

let balance = Number(localStorage.getItem("fgBalance")) || 10;

const storeContainer = document.getElementById("storeContainer");

document.getElementById("balanceDisplay").textContent = `$${balance.toFixed(2)}`;

renderStore();

function renderStore(){
    storeContainer.innerHTML = "";
    storeItems.filter(item => !purchasedItems.includes(item.name))
    .forEach(item => {
        const card = document.createElement("div");

        card.className = "store-item";
        card.innerHTML = `
        <div class="store-left">
            <img
                src="${item.image}"
                class="store-image"
                alt="${item.name}"
            >
        
            <div>
                <strong>${item.name}</strong>
                <p>${item.category}</p>
            </div>
        </div>
        
        <div>
            $${item.price}
        </div>
        
        <button
            class="buy-btn"
            onclick="buyItem('${item.name}')"
        >
            Buy
        </button>
        `;

        storeContainer.appendChild(card);
    });
}

function buyItem(itemName){
    const item =
        storeItems.find(
            i => i.name === itemName
        );

    if(!item) return;

    if(balance < item.price){
        alert("Not enough money!");
        return;
    }

    balance -= item.price;

    localStorage.setItem(
        "fgBalance",
        balance
    );

    if(item.category === "Toy"){
        inventory.toys.push(item.name);
    }

    if(item.category === "Clothing"){
        inventory.clothing.push(item.name);
    }

    if(item.category === "Food"){

        inventory.food.push(item.name);

    }

    saveInventory();

    purchasedItems.push(item.name);

    localStorage.setItem(
        "fgPurchased",
        JSON.stringify(purchasedItems)
    );

    updateBalance();
    renderStore();

    alert(
        `${item.name} purchased!`
    );
}
