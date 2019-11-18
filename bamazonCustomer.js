require("dotEnv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table3');


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
  // displayitems();
  start();
})
var start = function(){
  inquirer.prompt({
    name: "run",
    type: "list",
    message: "Would you like to BUY something?",
    choices: ["BUY", "EXIT"]
  })
  .then(function(answer) {
    // based on their answer, either call the bid or the post functions
    if (answer.run === "BUY") {
      displayitems();
    } else{
      console.log("Come back soon! thank you for visiting");
      connection.end();
    }
  });
}

var displayitems = function () {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    showTable(res);
    // console.log(res);
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

if (chosenItem.stock_quantity > parseInt(responseBuyer.itemQuantity)){
  var enoughInStock = chosenItem.stock_quantity - responseBuyer.itemQuantity;
  var updateSalesVar = responseBuyer.itemQuantity * chosenItem.price;
  // else if there is enough in stock then update database and calc cost of purchase    
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [{
      stock_quantity: enoughInStock,
      product_sales: updateSalesVar
    },
    {
      id: chosenItem.id
    }],
    function(err){
      if(err) throw err;
      // updateProductSales(responseBuyer, results);
      console.log("you have bought this item!!")
      start(); 
    }
    )
  } 
  else{
    console.log("sorry we are out of stock for that many items, please try again");
    // call another function?
    start();
  }
// displayitems();
connection.query("SELECT * FROM products", function (err, res) {
  if (err) throw err;
  showTable(res);
});
  })// end of .then from inquirer questions

})  // end of selection products
}// end of buyoptions function

function showTable(res){

  var Table = require('cli-table3');
  
  // instantiate
  var table = new Table({
      head: ['Item Name', 'Department', 'price', 'Stock Quantity']
      // , colWidths: [50, 50, 50, 50]
  });
  
  for (i = 0; i < res.length; i++){
      
      // table is an Array, so you can `push`, `unshift`, `splice` and friends
      table.push(
          [res[i].item_name, res[i].department, res[i].price, res[i].stock_quantity]
          //   , ['First value', 'Second value']
          );
      }
      
      console.log(table.toString());
      
  } // end of showTable function

//   function updateProductSales(responseBuyer, results){

//     var chosenItem;
// for (var i = 0; i <results.length; i++){
//   if (results[i].item_name === responseBuyer.buyItem){
//     chosenItem = results[i];
//   }
// }
//     // if (chosenItem.stock_quantity > parseInt(responseBuyer.itemQuantity)){
//       // var enoughInStock = chosenItem.stock_quantity - responseBuyer.itemQuantity;
//         // else if there is enough in stock then update database and calc cost of purchase    
//         var updateSalesVar = responseBuyer.itemQuantity * responseBuyer.price;
//         connection.query(
//           "UPDATE products SET ? WHERE ?",
//           [{
//             product_sales: updateSalesVar
//           },
//           {
//             id: chosenItem.id
//           }],
//           function(err){
//             if(err) throw err;
// console.log("updated product sales");
//           })
//           start();
//   }// end of updateProductSales function