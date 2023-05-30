let mysql2 = require('mysql2');
let inquirer = require('inquirer');

let connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'minions_db'
});

function start() {
    inquirer.prompt({
        name: "opener",
        type: "list",
        message: "What should I do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update employee role",
            "Quit (not the job, the app)",
        ],
    }).then(function (answer) {
        switch(answer.opener) {
            case "View all departments":
                seeDepartments();
                break;
            case "View all roles":
                seeRoles();
                break;
            case "View all employees":
                seeEmployees();
                break;
            case "Add an employee":
                createEmployee();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "Quit (not the job, the app)":
                connection.end();
                break;
            default:
                break;
        }
    });
}

let seeDepartments = () => {
    let query = 'Select * from department';

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

let seeRoles = () => {
    let query = 'Select roles.title, roles.salary, roles.id, department.name from roles RIGHT JOIN department ON roles.department_id = department.id';

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

let seeEmployees = () => {
    let query = 'Select sideA.first_name, sideA.last_name, sideB.first_name AS manager from employees sideA INNER JOIN employees sideB ON sideA.manager_id = sideB.id';

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

let createEmployee = () => {
    connection.query('Select * from roles', function (err,res) {
        if (err) throw (err);
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "Write employee's first name.",
            },
            {
                name: "lastName",
                type: "input",
                message: "Write employee's last name.",
            },
            {
                name: "managerId",
                type: "input",
                message: "Write employee's manager ID.",
            },
            {
                name: "addRole",
                type: "list",
                choices: function () {
                    return res.map((roles) => ({ name: roles.title, value: roles.id }));
                },
                message: "Write employee's role.",
            },
        ]).then( function (answer) {
            connection.query("INSERT INTO employees SET ?", {
                first_name: answer.firstName,
                last_name: answer.lastName,
                manager_id: answer.managerId,
                role_id: answer.addRole,
            }),
                start();
        });
    });
};

let updateEmployeeRole = () => {
    connection.query('Select * from roles', function (err, res) {
        inquirer.prompt([
            {
                name: "employeeId",
                type: "input",
                message: "ID of the employee who seeks an update?"
            },
            {
                name: "updatedRole",
                type: "list",
                choices: function () {
                    return res.map((roles) => ({ name: roles.title, value: roles.id }));
                },
                message: "Which Role?"
            },
        ]).then(function (answer) {
            console.log(answer.updatedRole);
            connection.query("UPDATE employees SET ? WHERE ?", [
                { role_id: answer.updatedRole },
                { id: answer.employeeId },
            ]);
            start();
        })
    })
};


start();