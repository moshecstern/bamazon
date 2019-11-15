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

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayitems();
})

var displayitems = function () {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log(res);
    buyoptions();
    // connection.end();
  })
} // end of displayitems function

var buyoptions = function () {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
  // inquirer to ask which id num do you want to buy?
  inquirer.prompt([
    {
name: "buyItem",
message: "which item (by id) would you like to purchase?",
type: "rawlist",
choices: function(){
  var choiceArray = [];
  for (var i = 0; i < results.length; i++){
    choiceArray.push(results[i].item_name);
  }
  return choiceArray;
}
    },
    // 2nd question is how many they would like
    {
      name: "itemQuantity",
      message: "How many would you like to purchase?",
      type: "input"
    }
  ]).then(function(responseBuyer){
    // add if then statemnt here
    // then check if store has enough quantity of selected id
var chosenItem;
for (var i = 0; i <results.length; i++){
  if (results[i].item_name === responseBuyer.buyItem){
    chosenItem = results[i];
  }
}
    // if there is not enough quantity then console.log("insuficiant quantity")
    // and ask them if they want to quit or reorder
if (chosenItem.stock_quantity > parseInt(responseBuyer.itemQuantity)){
var enoughInStock = chosenItem.stock_quantity - responseBuyer.itemQuantity;
  // else if there is enough in stock then update database and calc cost of purchase    
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [{
      stock_quantity: enoughInStock
    },
    {
      id: chosenItem.id
    }],
    function(err){
      if(err) throw err;
      console.log("you have bought this item!!")
      connection.end();
    }
    
    ) // end of connection
  } 
  else{
    console.log("sorry we are out of stock for that many items, please try again");
    // call another function?
    connection.end();
  }
  })// end of .then from inquirer questions

})  // end of selection products
}// end of buyoptions function