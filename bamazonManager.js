require("dotEnv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.SQL_PASS,
    database: "bamazonDB"
});

// inquirer 4 options 
connection.connect(function (err) {
    if (err) throw err;
    start();
}) // end of connection

function start() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "would you like to view products, view low inventory, add to inventory, or add new product?",
        choices: ["view products", "view low inventory", "add to inventory", "add new product", "exit"]
    }).then(function (answer) {
        if (answer.choices === "view products") {
            viewProducts();
        } else if (answer.choices === "view low inventory") {
            console.log("view low inventory");
            viewLowInventory();
        } else if (answer.choices === "add to inventory") {
            console.log("YAY");
            addToInventory();
        } else if (answer.choices === "add new product") {
            console.log("YAY");
            addNewProduct();
        } else if (answer.choices === "exit") {
            console.log("Come back soon!");
            connection.end();
        }
    })
} // end of function start

// View Products for Sale
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        start();
    })
} // end of viewProducts function

// View Low Inventory
function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 6;", function (err, resL) {
        if (err) throw err;
        console.log(resL);
        start();
    })  // end of connection
} // end of viewLowInventory function

// Add to Inventory
function addToInventory() {
    connection.query("SELECT * FROM products", function (err, resI) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                message: "which item's inventory would you like to update?",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < resI.length; i++) {
                        choiceArray.push(resI[i].item_name);
                    }
                    return choiceArray;
                }
            },
            {
                name: "addInventory",
                type: "input",
                message: "how much inventory would you like to add?"
            }
        ]).then(function (answer) {
            var chosenItem;
            for (var i = 0; i < resI.length; i++) {
                if (resI[i].item_name === answer.choice) {
                    chosenItem = resI[i];
                }
            }// end of for loop
            parseAddInventory = parseInt(answer.addInventory);
            var totalStock = chosenItem.stock_quantity + parseAddInventory;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [{
                    stock_quantity: totalStock
                },
                {
                    id: chosenItem.id
                }],
                function (err) {
                    if (err) throw err;
                    console.log("you added to your inventory!");
                    start();
                }
            )

        })// end of then function
    }) // end of connection
} // end of addToInventory function

function addNewProduct(){
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "what item would you like to add?"
        },
        {
            name: "departmentI",
            type: "rawlist",
            message: "which department does this item go into?",
            choices: ["furniture", "electronics", "outdoors"]
        },
        {
            name: "priceI",
            type: "input",
            message: "How much does this item cost?"
        },
        {
            name: "stock_quantityI",
            type: "input",
            message: "how much do we have in stock?"
        }
    ])
    .then(function(answer){
connection.query(
    "INSERT INTO products SET ?",
    {
        item_name: answer.item,
        department: answer.departmentI,
        price: answer.priceI,
        stock_quantity: answer.stock_quantityI
    },
    function(err){
        if (err) throw err;
        console.log("added new product!");
        start();
    }
)
    }) // end of .then function
} // end of addNewProduct
    // Add New Product

