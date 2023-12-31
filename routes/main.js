module.exports = function(app, appData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', appData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', appData);
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', appData);                                                                     
    });                                                                                                 
    app.post('/registered', function (req,res) {
        const bcrypt  = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds,  function(err, hashedPassword){
            if(err){
                return console.error(err.message)
            }
            let sqlquery = "INSERT INTO userdetails (firstname,lastname,email,username,hashedPassword) VALUES (?,?,?,?,?)";
            let newrecord = [req.body.first,req.body.last,req.body.email,req.body.username,hashedPassword];

            db.query(sqlquery,newrecord, (err, result) => {
                if(err) {
                    return console.error(err, result);
                }
                else{
                    result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
                    result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                    res.send(result);

                }
        })
        })                                                                        
    }); 


        app.post("/loggedin", function(req,res){
            const bcrypt = require("bcrypt")                  
            let sqlquery = 'SELECT hashedPassword FROM userdetails WHERE username = "' + req.body.username +'"';

            db.query(sqlquery, (err, result) => {
                if(err){
                    res.send("there was an error")
                }
                else{
                    hashedPassword = result[0].hashedPassword;
                    console.log(hashedPassword)
                    console.log(req.body.password)
                    console.log(result)
                    bcrypt.compare(req.body.password, hashedPassword, function(err, result){
                        if(err){
                            res.send("there was an error")
                        }
                        else if(result == true){
                            res.send("That is the correct Password")
                        }
                        else{
                            res.send("That is the wrong password")
                        }
                    });
                }
            
            });
        })

        app.get("/login", function(req, res){
            res.render("login.ejs", appData);
        })

        // app.get('/TaskManager',function(req,res){
        //     res.render("TaskManager.ejs", appData);
        // });

        app.post('/taskadded', function (req,res) {
            // saving data in database
            let sqlquery = "INSERT INTO manager (taskname) VALUES (?)";
            // execute sql query
            let newrecord = [req.body.task];
            db.query(sqlquery, newrecord, (err, result) => {
              if (err) {
                return console.error(err.message);
              }
              else
            //   res.send(' This book is added to database, name: '+ req.body.task);
            res.redirect('/TaskManager');
              });
        });
        
        app.get('/TaskManager', function(req, res) {
            let sqlquery = "SELECT * FROM manager"; // query database to get all the books
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, appData, {availableTasks:result});
                console.log(newData)
                res.render("TaskManager.ejs", newData)
             });
        });

}
