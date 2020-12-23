DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name varchar(30) NOT NULL
);

CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);


INSERT INTO department (name)
VALUES 
	("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal"),
    ("Customer Success");
    
INSERT INTO role (title, salary, department_id)
VALUES 
	("Account Manager", 150000, 1),
    ("Sales Specialist", 100000, 1),
    ("Architect", 250000, 2),
    ("Software Engineer", 150000, 2),
    ("Accountant", 100000, 3),
    ("Financial Analyst", 120000, 3),
    ("Attorney", 300000, 4),
    ("Paralegal", 60000, 4),
    ("Customer Success Manager", 60000, 5),
    ("Business Analyst", 60000, 5),
    ("Support Specialist", 50000, 5);
    
INSERT INTO employee (first_name,last_name, role_id)
VALUES
	("Doug", "Dawson", 1),
    ("Lillie", "Hughes", 1),
    ("Nadine", "Roy", 2),
    ("Conrad", "Higgins", 2),
    ("Clifford", "Davis", 2),
    ("Lloyd", "Nichols", 3),
    ("Brad", "Anderson", 4),
    ("Hector", "James", 4),
    ("Douglas", "Peterson", 4),
    ("Maureen", "Hampton", 4),
    ("Luz", "Waltz", 4),
    ("Erica", "Wagner", 4),
    ("Clarence", "Henderson", 4),
    ("Shelia", "Simmons", 5),
    ("Rufus", "Joseph", 6),
    ("Martha", "Allison", 7),
    ("Bill", "Drake", 8),
    ("Francis", "Wong", 9),
    ("Kirk", "Rice", 9),
    ("Elizabeth", "Rodriguez", 10),
    ("Darlene", "McWeeney", 10),
    ("Carole", "Chen", 10),
    ("Casey", "Pratt", 11),
    ("Robin", "Harrison", 11),
    ("Abel", "Newton", 11);
    
