create database jwt_db;
use jwt_db;
create table users(
user_id int unsigned primary key auto_increment,
first_name varchar(100),
last_name varchar(100),
email varchar(150) unique,
user_password varchar(255) not null,
reset_password_token TEXT,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp 
on update current_timestamp
);

ALTER TABLE users 
ADD COLUMN reset_password_token TEXT AFTER user_password;

select * from users;

insert into users(first_name,last_name,email,user_password)
values("1","df","df","df");

create table user_activity(
 activity_id int unsigned primary key auto_increment,
 user_id int unsigned  not null,
 activity_name varchar(100),
 created_at timestamp default current_timestamp,
 
 constraint fk_user_activity
 foreign key (user_id)
 references users(user_id)

);



