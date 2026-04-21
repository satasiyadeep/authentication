import db from "../config/db.js";

const usermodel = {
  insertuser: async(data : any) => {
     const query=`insert into users(first_name,last_name,email,user_password,password_updated_at)
               values(?,?,?,?,NOW());`;
     return db.promise().query(query,data);
  },
  emailexist: (data : any )=>{
     const query=`select * from users where email = ? and role=? limit 1`;
     return db.promise().query(query,data);
  }, 
  emailexist_only : (email : any)=>{
   const query=`select * from users where email = ?  limit 1`;
     return db.promise().query(query,email);
  },
  insert_reset_password_token : (data : any)=>{
      const query=`UPDATE users
                     SET reset_password_token = ?
                     WHERE user_id = ?;
                  `;
     return db.promise().query(query,data);
  },

  getresettoken : (id : any)=>{
      const query=` select reset_password_token
                      from users
                     WHERE email= ?;
                  `;
     return db.promise().query(query,id);
  },

  setnewpassword : (data : any)=>{
    const query=`update users set user_password=?,password_updated_at=NOW() where email=?`
    return db.promise().query(query,data);
  },
  updateloginattempt:(data : any)=>{
          const query=`update users set login_attempt=? where email=?`
          return db.promise().query(query,data);
   },
   lockuser :(email :any)=>{
      const query=`update users set is_lock=${1} where email =?`;
      return db.promise().query(query,email);
   }

};

export { usermodel };
