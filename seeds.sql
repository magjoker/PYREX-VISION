USE minions_db;

INSERT INTO department (name)
VALUES 
('Field Management'),
('Twitter'),
('WWE'),
('WWF'),
('Boomerang');

INSERT INTO roles (title, salary, department_id)
VALUES
('Waterboy', 400000, 1),
('Comedy Writer', 2300, 2),
('Defense', 1000000, 3),
('Defense-Aux', 500000, 4),
('Admiral', 2000000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Bobby', 'Boucher', 1, 5),
('Elon', 'Musk', 2, 4),
-- there's a perfectly good reason John is his own manager. If no one else can see him how can they manage him?
('John', 'Cena', 3, 3),
('The', 'Rock', 4, 2),
('Scooby', 'Doo', 5, 1);