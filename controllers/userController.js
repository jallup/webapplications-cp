var User = require('../models/users');

// Good validation documentation available at https://express-validator.github.io/docs/
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all posts.
/*exports.index = function(req, res, next) {

  User.find({}).exec(function (err, list_users) {
    if (err) { return next(err); }
    // Successful, so render
    res.render('users', { title: 'Users', user_list: list_users});
  });

};*/

// Handle book create on POST.
exports.create = function(req, res, next) {
  sanitizeBody('*').trim().escape();

  // Create a post object
  // Improve: Use promises with .then()
  var post = new User(
    { email: req.body.email,
      name: req.body.name,
      password: req.body.password
    });

    if(email && name && password){
      const exists = User.find({email: post.email})

      if (exists){
        res.redirect('/register')

      }

      post.save(function (err) {
        if (err) {
            res.redirect('/auth')

        }
        // Successful - redirect to new book record.
        res.redirect('/login');
      });

      //const id = User.find({email: post.email}).objectId();
      //req.session.userId = id;

    }

  };

/*  app.post('/register',redirectHome , (req, res) => {
    const { user, email, password} = req.body

    if (user && email && password){
      const exists = users.some(
        user => user.email === email
      )

        if (!exists) {
          const user = {
            id: users.length +1,
            user,
            email,
            password
          }

          users.push(user)
          req.session.userId = user.id
          return res.redirect('/home')
        }

    }
    res.redirec('/register') // Error


    res.redirect('/login')

  })
*/
