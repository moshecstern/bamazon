require("dotEnv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table3');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
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
    message: "What would you like to do dear supervisor?",
    choices: ["Would you like to View Product Sales by Department","Create New Department", "exit"]
  })
  .then(function(answer) {
    // based on their answer, either call the bid or the post functions
    if (answer.run === "Would you like to View Product Sales by Department") {
      displayitems();
    }else if(answer.run === "Create New Department") {
console.log("create new department");
start();
    }else{
      console.log("Come back soon! thank you for visiting");
      connection.end();
    }
  });
}

var displayitems = function () {
    // join command or var to hold all sales by department
    // var totalProfits that takes all sales by department - over_head_costs
//   connection.query("SELECT * FROM departments", function (err, res) {
    // WHERE 
    // function showDeptSales() {

        connection.query(`SELECT departments.department_id AS 'departmentID', 
                            departments.department_name AS 'departmentName', 
                            departments.over_head_costs AS 'overheadCosts', 
                            SUM(products.product_sales) AS 'productSales', 
                            (SUM(products.product_sales) - departments.over_head_costs) AS 'totalProfit'  
                            FROM departments
                            LEFT JOIN products on products.department=departments.department_name
                            GROUP BY departments.department_name, departments.department_id, departments.over_head_costs
                            ORDER BY departments.department_id ASC`, function(error, res) {
            if (error) throw error;
            // console.log(res);
            showTable(res);
            start();
        })
    // };
//     connection.query("SELECT * FROM products", 
//     function (err, res) {

//     if (err) throw err;
//     showTable(res);
//     // console.log(res);
//     console.log(res);
//     start();
//     // connection.end();
//   })
} // end of displayitems function

function showTable(res){

    var Table = require('cli-table3');
    
    // instantiate
    var table = new Table({
        head: ['department_id', 'Department_name', 'over_head_costs', 'product_sales', 'total_profit']
        // , colWidths: [50, 50, 50, 50]
    });
    
    for (i = 0; i < res.length; i++){
        // table is an Array, so you can `push`, `unshift`, `splice` and friends
        table.push(
            [res[i].departmentID, res[i].departmentName, res[i].overheadCosts, res[i].productSales, res[i].totalProfit]
            // console.log(columnify(res, { columns: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"] }));    
            );
        }
        
        console.log(table.toString());
        
    } // end of showTable function