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
  password:  process.env.SQL_PASS,
  database: "bamazonDB"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayitems();
})

var displayitems = function(){
  connection.query("SELECT * FROM products", function(err, res){
    if (err) throw err;
    console.log(res);
    buyoptions();
    // connection.end();
  })
} // end of displayitems function

var buyoptions = function(){
  // inquirer to ask which id num do you want to buy?

  // 2nd question is how many they would like

  // then check if store has enough quantity of selected id

  // if there is not enough quantity then console.log("insuficiant quantity")
      // and ask them if they want to quit or reorder

  // else if there is enough in stock then update database and calc cost of purchase    


}// end of buyoptions function