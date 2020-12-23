
// Required node modules - mysql for db handling, inquirer for prompts and console.table for formatting
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table')

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employee_tracker"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// first question which prompts the user which area they're interested in
function start() {
  inquirer
    .prompt({
      name: "initialQ",
      type: "list",
      message: "Which area are you interested?",
      choices: ["Departments", "Roles", "Employees", "Budget", "Exit"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.initialQ === "Departments") {
        departmentQs();
      }
      else if(answer.initialQ === "Roles") {
        rolesQs();
      } 
      else if(answer.initialQ === "Employees") {
        employeeQs();
      }
      else if(answer.initialQ === "Budget") {
        budgetQs();
      } 
      else{
        connection.end();
      }
    });
}

// First submenu to handle all department actions
function departmentQs() {
  // prompt for which department action to take
  inquirer
    .prompt({
      name: "departmentActions",
      type: "list",
      message: "Which department action would you like to take?",
      choices: ["Add Department", "View All Departments", "Delete Departments", "Main Menu", "Exit"]
    })
    .then(function(answer) {
      // based on their answer, redirects to matching function/inqurier steps
      if (answer.departmentActions === "Add Department") {
        addDepartment();
      }
      else if(answer.departmentActions === "View All Departments") {
        viewAllDepartments();
      } 
      else if(answer.departmentActions === "Delete Departments") {
        deleteDepartments();
      }
      // Returns to the main menu
      else if(answer.departmentActions === "Main Menu") {
        start();
      } 

      // Closes application if exist is selected
      else{
        connection.end();
      }
    });
}

// Adds department by asking for new department name then inserting name into department table
function addDepartment () {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Department Name:"
      }]).then(function(answer) {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.departmentName,
          },
          function(err) {
            if (err) throw err;
            console.log("Your department was added successfully!");

            //redirects back to submenu for more department processing
            departmentQs();
          }
        )
      });
    }

//view all departments via select statement on department table
function viewAllDepartments () {
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
    console.table(results);
    departmentQs();
});
}
//view all departments via select statement on department table to choose department, then delete statement to delete the department
function deleteDepartments() {
  connection.query("SELECT name FROM department", function(err, results) {
    if (err) throw err;
    
  inquirer
    .prompt([
      {
        name: "departmentDelete",
        type: "list",
        message: "Which department would you like to delete?",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].name);
          }
          return choiceArray;
        },
      }]).then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "DELETE from department WHERE name = ?",
          [answer.departmentDelete],
          function(err) {
            if (err) throw err;
            console.log("Your department was deleted successfully!");
            departmentQs();
          })
      });
    })
};

// second submenu to handle all role actions
function rolesQs() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt({
      name: "roleActions",
      type: "list",
      message: "Which role action would you like to take?",
      choices: ["Add Role", "Update Role", "View All Roles", "Delete Roles", "Main Menu", "Exit"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.roleActions === "Add Role") {
        addRoles();
      }
      else if(answer.roleActions === "Update Role") {
        updateRoles();
      } 
      else if(answer.roleActions === "View All Roles") {
        viewAllRoles();
      } 
      else if(answer.roleActions === "Delete Roles") {
        deleteRoles();
      }
      else if(answer.roleActions === "Main Menu") {
        start();
      } 
      else{
        connection.end();
      }
    });
}

// Adds role by asking for new role name, salary and which department to associate, then inserts into role table
function addRoles () {
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;

  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Role title:"
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Role salary:"
      },
      {
        name: "departmentId",
        type: "list",
        message: "Select Department:",
        choices: function() {
          var choiceArray = [];
            if (err) throw err;
            for (var i = 0; i < results.length; i++) { 
              choiceArray.push(
                `${results[i].id} ${results[i].name}`
                );
          }
          return choiceArray; //must be an array of strings
      }
    }
    ]).then(function(answer) {
        const idFromString = answer.departmentId.replace(/[^0-9.]/g,"");
        // when finished prompting, insert a new item into the db with that info
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.roleTitle,
              salary: answer.roleSalary,
              department_id: JSON.parse(idFromString),
            },
            function(err) {
              if (err) throw err;
              console.log("Your role was added successfully!");
              rolesQs();
            }
          )  
      });
    });
  }

// Adds role by asking for role to update, then updated name, salary and which department to associate, then updates into role table
function updateRoles () {
  connection.query("SELECT * FROM department", function(err, results2) {
    if (err) throw err;
  
  connection.query("SELECT title, salary, name FROM role LEFT JOIN department ON role.department_id = department.id", function(err, results) {
    if (err) throw err;
    
  inquirer
    .prompt([
      {
        name: "roleUpdate",
        type: "list",
        message: "Which role would you like to update?",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].title);
          }
          return choiceArray;
        },
      },
      {
        name: "roleUpdateTitle",
        type: "input",
        message: "Updated Title:",
      },
      {
        name: "roleUpdatedSalary",
        type: "input",
        message: "Updated Salary:",
      },
      {
        name: "roleUpdatedDeptID",
        type: "list",
        message: "Updated Department:",
        choices: function() {

          var choiceArray2 = [];
            if (err) throw err;
            for (var i = 0; i < results2.length; i++) { 
              choiceArray2.push(
                `${results2[i].id} ${results2[i].name}`
                );
            }; 
            return choiceArray2; //must be an array of strings
        }
      },
    ]).then(function(answer) {
      const idFromString = answer.roleUpdatedDeptID.replace(/[^0-9.]/g,"");
      connection.query(
          "UPDATE role SET ? WHERE ?",
          [
            {title: answer.roleUpdateTitle,
             salary: answer.roleUpdatedSalary,
             department_id: JSON.parse(idFromString)
            }, 
            {title: answer.roleUpdate}
          ],
          function (err) {
            if (err)
              throw err;
            console.log("Your role was updated successfully!");
            rolesQs();
          });
        });
      });
    });
  };

// Queries role table
function viewAllRoles () {
  connection.query("SELECT title, salary, name FROM role LEFT JOIN department ON role.department_id = department.id;", function(err, results) {
    if (err) throw err;
    console.table(results);
    rolesQs();
});
}

// Selects all roles and presents them to user to select which one to delete, then deletes with delete where selected
function deleteRoles() {
  connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;
    const depts = results;
    
  inquirer
    .prompt([
      {
        name: "roleDelete",
        type: "list",
        message: "Which role would you like to delete?",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].title);
          }
          return choiceArray;
        },
      }]).then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "DELETE from role WHERE title = ?",
          [answer.roleDelete],
          function(err) {
            if (err) throw err;
            console.log("Your role was deleted successfully!");
            rolesQs();
          })
      });
    })
};

// third submenu to handle all employee actions
function employeeQs() {
  inquirer
  .prompt({
    name: "eeActions",
    type: "list",
    message: "Which employee action would you like to take?",
    choices: ["Add Employee", "Update Employee", "View All Employees", "View All Employees with Managers", "Delete Employees", "Main Menu", "Exit"]
  })
  .then(function(answer) {
    if (answer.eeActions === "Add Employee") {
      addEmployee();
    }
    else if(answer.eeActions === "Update Employee") {
      updateEmployee();
    } 
    else if(answer.eeActions === "View All Employees") {
      viewAllEmployees();
    } 
    else if(answer.eeActions === "View All Employees with Managers") {
      viewAllEmployeeswithManagers();
    } 
    else if(answer.eeActions === "Delete Employees") {
      deleteEmployees();
    }
    else if(answer.eeActions === "Main Menu") {
      start();
    } 
    else{
      connection.end();
    }
  });
}

// Adds new employee, asks for name and presents role options before inserting selections into employee table
function addEmployee () {
  connection.query("SELECT first_name, last_name, id FROM employee", function(err, results2) {
    if (err) throw err;
  
  connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;

  inquirer
    .prompt([
      {
        name: "eeFirst",
        type: "input",
        message: "Employee First Name:"
      },
      {
        name: "eeLast",
        type: "input",
        message: "Employee Last Name:"
      },
      {
        name: "eeRole",
        type: "list",
        message: "Employe Role:",
        choices: function() {
          var choiceArray = [];
            if (err) throw err;
            for (var i = 0; i < results.length; i++) { 
              choiceArray.push(
                `${results[i].id} ${results[i].title}`
                );
          }
          return choiceArray; //must be an array of strings
      }
      },
      {
        name: "eeManager",
        type: "list",
        message: "Select Manager:",
        choices: function() {

          var choiceArray3 = [];
            if (err) throw err;
            for (var i = 0; i < results2.length; i++) { 
              choiceArray3.push(
                `${results2[i].id} ${results2[i].first_name} ${results2[i].last_name}`
                );
            }; 
            return choiceArray3; //must be an array of strings
        },
      }

    ]).then(function(answer) {
      const idFromString = answer.eeRole.replace(/[^0-9.]/g,"");
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.eeFirst,
            last_name: answer.eeLast,
            role_id: JSON.parse(idFromString),
          },
          function(err) {
            if (err) throw err;
            console.log("Your employee was added successfully!");
            employeeQs();
          }
        )
      });
    });
  });
};

// Asks which employee to update, then asks for fields to update before executing update script on selected employee
function updateEmployee () {
  connection.query("SELECT * FROM role", function(err, results2) {
    if (err) throw err;
  
  connection.query("SELECT first_name, last_name, id FROM employee", function(err, results) {
    if (err) throw err;
    
  inquirer
    .prompt([
      {
        name: "employeeUpdate",
        type: "list",
        message: "Which employee would you like to update?",
        choices: function() {

          var choiceArray = [];
            if (err) throw err;
            for (var i = 0; i < results.length; i++) { 
              choiceArray.push(
                `${results[i].id} ${results[i].first_name} ${results[i].last_name}`
                );
            }; 
            return choiceArray; //must be an array of strings
        }
      },
      {
        name: "employeeUpdateFirst",
        type: "input",
        message: "Updated First:",
      },
      {
        name: "employeeUpdateLast",
        type: "input",
        message: "Updated Last:",
      },
      {
        name: "employeeUpdateRole",
        type: "list",
        message: "Select Updated Role:",
        choices: function() {
          var choiceArray2 = [];
          for (var i = 0; i < results2.length; i++) {            
            choiceArray2.push(`${results2[i].id} ${results2[i].title}`);
          }
          return choiceArray2;
        },
      },
      {
        name: "employeeUpdateManager",
        type: "list",
        message: "Select Manager:",
        choices: function() {

          var choiceArray3 = [];
            if (err) throw err;
            for (var i = 0; i < results.length; i++) { 
              choiceArray3.push(
                `${results[i].id} ${results[i].first_name} ${results[i].last_name}`
                );
            }; 
            return choiceArray3; //must be an array of strings
        },
      }
    ]).then(function(answer) {
        
      const idFromString = answer.employeeUpdateRole.replace(/[^0-9.]/g,"");
      const idFromString2 = answer.employeeUpdate.replace(/[^0-9.]/g,"")
      const idFromString3 = answer.employeeUpdateManager.replace(/[^0-9.]/g,"")

      connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {first_name: answer.employeeUpdateFirst,
             last_name: answer.employeeUpdateLast,
             role_id: JSON.parse(idFromString),
             manager_id: JSON.parse(idFromString3)
            }, 
            {id: JSON.parse(idFromString2)}
          ],
          function (err) {
            if (err)
              throw err;
            console.log("Your employee was updated successfully!");
            employeeQs();
          });
        });
      });
  });
};
// Select all statement with role table join on employee table
function viewAllEmployees() {
  connection.query("SELECT first_name as 'First Name', last_name as 'Last Name', title as Title, name as Department, salary as Salary from employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY name", function(err, results) {
    if (err) throw err;
    console.table(results);
    employeeQs();
});
}

// Select view all employees with manager using a self join on employees table
function viewAllEmployeeswithManagers() {
  connection.query("SELECT emp.first_name as 'Employee First Name', emp.last_name as 'Employee Last Name', manager.first_name as 'Manager First Name', manager.last_name as 'Manager Last Name' FROM employee emp JOIN employee manager ON emp.manager_id = manager.id ORDER BY manager.last_name", function(err, results) {
    if (err) throw err;
    console.table(results);
    employeeQs();
});
}

//presents option to select which employees will be deleted, then run delete script to delete employee
function deleteEmployees() {
  connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err;
    
  inquirer
    .prompt([
      {
        name: "eeDelete",
        type: "list",
        message: "Which employee would you like to delete?",
        choices: function() {

          var choiceArray = [];
            if (err) throw err;
            for (var i = 0; i < results.length; i++) { 
              choiceArray.push(
                `${results[i].id} ${results[i].first_name} ${results[i].last_name}`
                );
            }; 
            return choiceArray; //must be an array of strings
        }
      }]).then(function(answer) {
        const idFromString = answer.eeDelete.replace(/[^0-9.]/g,"");
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "DELETE from employee WHERE ?",
          [{
            id: JSON.parse(idFromString)}],
          function(err) {
            if (err) throw err;
            console.log("Your employee was deleted successfully!");
            employeeQs();
          })
      });
    })
};

// fourth submenu to handle all budgetary queries
function budgetQs () {
  inquirer
  .prompt({
    name: "budgetActions",
    type: "list",
    message: "Which budgetary information would you like to see?",
    choices: ["Total Spend by Department", "Total Spend by Role", "Salary by Role Highest to Lowest", "Main Menu", "Exit"]
  })
  .then(function(answer) {
    // based on their answer, either call the bid or the post functions
    if (answer.budgetActions === "Total Spend by Department") {
      totalDepartment();
    }
    else if(answer.budgetActions === "Total Spend by Role") {
      totalRole();
    } 
    else if(answer.budgetActions === "Salary by Role Highest to Lowest") {
      highestSalary();
    } 
    else if(answer.budgetActions === "Main Menu") {
      start();
    } 
    else{
      connection.end();
    }
  });
}

// Total spend by department using joins and derived tables
function totalDepartment() {
  connection.query("SELECT Department, SUM(SalaryTotal) as 'Total Spend by Department' FROM ( SELECT title as Title, SUM(salary) as SalaryTotal, name as Department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id GROUP BY role_id) derived_salaries GROUP BY Department ORDER BY SUM(SalaryTotal) DESC", function(err, results) {
    if (err) throw err;
    console.table(results);
    budgetQs();
});
}

// Total spend by role using joins and derived tables
function totalRole() {
  connection.query("SELECT Title, SUM(SalaryTotal) as 'Total Spend by Role' FROM ( SELECT title as Title, SUM(salary) as SalaryTotal, name as Department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id GROUP BY role_id) derived_salaries GROUP BY Title ORDER BY SUM(SalaryTotal) DESC", function(err, results) {
    if (err) throw err;
    console.table(results);
    budgetQs();
});
}

// Total spend by role using joins and derived tables
function highestSalary() {
  connection.query("SELECT title as Title, name as Department, salary as Salary FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY salary DESC", function(err, results) {
    if (err) throw err;
    console.table(results);
    budgetQs();
});
}
