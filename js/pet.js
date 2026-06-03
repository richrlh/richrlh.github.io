const storeItems = [
    // TOYS
    {name:"Tennis Ball", category:"Toy", price:2},
    {name:"Rope Toy", category:"Toy", price:4},
    {name:"Squeaky Duck", category:"Toy", price:6},
    {name:"Frisbee", category:"Toy", price:8},

    // CLOTHES
    {name:"Blue Hat", category:"Clothing", price:3},
    {name:"Red Scarf", category:"Clothing", price:5},
    {name:"Raincoat", category:"Clothing", price:7},
    {name:"Bow Tie", category:"Clothing", price:10},

    // FOOD
    {name:"Treat", category:"Food", price:2},
    {name:"Peanut Biscuit", category:"Food", price:4},
    {name:"Chicken Snack", category:"Food", price:6},
    {name:"Steak Dinner", category:"Food", price:12}
];

let balance = Number(localStorage.getItem("fgBalance")) || 10;

const storeContainer = document.getElementById("storeContainer");

document.getElementById("balanceDisplay").textContent = `$${balance.toFixed(2)}`;

renderStore();

function renderStore(){
    storeContainer.innerHTML = "";
    storeItems.forEach(item => {
        const card = document.createElement("div");

        card.className = "store-item";
        card.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                ${item.category}
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

    if(balance < item.price){
        alert("Not enough money!");
        return;
    }

    balance -= item.price;
    localStorage.setItem(
        "fgBalance",
        balance
    );

    document.getElementById(
        "balanceDisplay"
    ).textContent =
        `$${balance.toFixed(2)}`;

    alert(
        `${item.name} purchased!`
    );
}
