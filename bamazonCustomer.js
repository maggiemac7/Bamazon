var mysql      = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  post     : '3036',
  user     : 'root',
  password : 'password',
  database : 'bamazonDB'
});

connection.connect();
 function start(){
connection.query('SELECT * FROM products', function (err, res, fields) {
  if (err) throw err;
  for (let i = 0; i < res.length; i++) {
      const element = res[i];
    //   console.log('The solution is: ', res);
      
      console.log("Item ID: " + element.item_id, "\t Product Name: " + element.product_name, "\t Department: " + element.department_name, "\t Price: " + element.price, "\t Stock Quantity: " + element.stock_quantity 
      );
  }

  inquirer
  .prompt([{
      name: "id",
      type: "number", 
      message: "What is the item ID?"
  },

     { 
      name: "qty",
      type: "number", 
      message: "What quantity do you want?"
  },
    /* Pass your questions in here */
  ])
  .then(answers => {
     var valid = true;
     var values = Object.values(answers);
     for(var i = 0; i < values.length;i++){
         if(values[i] === NaN){
            valid = false;
         }
     } 

     if(valid === false){
         console.log('Invalid input');
         start();
         return;
     }
     
   connection.query('SELECT * FROM products WHERE item_id=?', [answers.id],function (err, res, fields) {
      if(err) throw err;
      if(res.length === 0){
        console.log('That Id does not exist in my system.');
        start();
        return;
      }
      //Below this we know res[0] must exist
      if (res[0].stock_quantity >= answers.qty){
        var newQty = res[0].stock_quantity - answers.qty
        connection.query('UPDATE products SET stock_quantity = ? WHERE item_id =?',[newQty, answers.id],function (err, response, fields){
          if(err) throw err;
          console.log("Your final purchase total is $" + answers.qty*res[0].price + "\n Would you like to make another purchase?"
          )
          setTimeout(() => {
            start()
          }, 3000);
        }
      
        )
      } 
      else {
        console.log("We do not have enough stock to fulfill your request")};
        start();
   })
  });
});

 }
 start();


