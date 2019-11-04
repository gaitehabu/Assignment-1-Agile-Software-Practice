# Assignment 1 - Agile Software Practice.

Name: Yan(Francis) Hu

Number: 20086446

## Overview.

The website named “The platform of sharing cooking”. In this website, everyone has their own account and can upload their menu if they think is wonderful and tasty. All menus that user uploaded will be collected and show in homepage called “community”. Everyone can browse these menus and click “like” button or comment.


## API endpoints.


<font color=red>API testing ( Integration testing )  </font><br><br>
recipes  

+ GET /recipes - return a list of recipes and associated metadata
+ GET /recipes/:id - return an individual recipe with associated metadata
+ GET /recipes/name/:name - return an recipe or recipes by name
+ GET /recipes/username/:username - return an recipe or recipes by username
+ GET /recipes/:id/comment - return comments by id
+ GET /recipes/search/:name - fuzzy search, return recipes with 'oo' in the name (e.g. noodles, seafood)
+ POST /recipes - create a new recipe
+ PUT /recipes/:id/upLike - like a recipe
+ PUT /recipes/:id/editRecipes - modify recipe content
+ DELETE /recipes/:id - delete a recipe by ID
+ DELETE /recipes/:id/comment/:cid - delete a comment in recipe by ID  

users  

+ GET /users - return a list of users and associated metadata
+ GET /users/:id - return an individual user with associated metadata
+ GET /users/name/:name - return an user or users by name
+ POST /users - create a new user
+ PUT /users/:id/password - change user password
+ PUT /users/:id/editInformation - modify user content
+ DELETE /users/:id - delete a user by ID


## Data model.
user

~~~
let UserSchema = new mongoose.Schema({  
    name: String,  
    password: String,  
    sex: String,  
    personal_lnfo: String  
},  
{ collection: "users" })  
~~~
example

~~~
{"id": 1000000, "name": "Francis", "password": "123456789", "sex": "male", "personal_lnfo": "Hello"}
~~~
recipe

~~~
let RecipeSchema = new mongoose.Schema({  
    name: String,  
    username: String,  
    date: {type: Date,  
        default: Date.now},  
    content: {material: Array,  
        step: Array},  
    comment: [{username: String,  
        text: String,  
        date: Date}],  
    like: {type: Number, default: 0}  
},  
{collection: "recipes"})  
~~~
example

~~~
{id: 2000000, name: 'Noodles', username: 'Francis',
    content: {material: ['noodles', 'sauce'], step: ['boiling', 'Making sauce']},
    comment: [{id: 200000000, username: 'Meng', text: 'Looks good and tasty.', , date: "2018.1.2"},
                {id: 200000001, username: 'Qi', text: 'Good!', date: "2018.12.28"}],
    like: 0},
~~~
comment

~~~
let CommentSchema = new mongoose.Schema({  
    username: String,  
    text: String,  
    date: {type: Date,  
        default: Date.now}  
},  
{collection: "comments"})  
~~~
example

~~~
{"id": 200000200, "username": "Saruis", "text": "bad bad bad!", "date": "2016.6.20"}
~~~

## Sample Test execution.


~~~
Successfully Connected to [ admin ]
Successfully Connected to [ admin ]
  GET /users
GET /users 200 26.901 ms - 553
    ✓ should return all users (45ms)
  GET /users/:id
    when the id is valid
GET /users/5dc0725fc3a0fe1df53d139c 200 31.208 ms - 147
      ✓ should return the matching user
    when the id is invalid
GET /users/1119999 200 1.859 ms - 243
      ✓ should return the NOT Found message
  GET /users/name/:name
    when the name is valid
GET /users/name/Francis 200 27.938 ms - 147
      ✓ should return the matching user
    when the name is invalid
GET /users/name/9999 200 20.389 ms - 38
      ✓ should return the NOT Found message
  POST /user
POST /users 200 41.324 ms - 160
    ✓ should return confirmation message and add a user (44ms)
GET /users/5dc0725fc3a0fe1df53d139d 200 19.422 ms - 157
  PUT /user/:id/password
    when the id is valid
PUT /users/5dc0725fc3a0fe1df53d139d/password 200 54.042 ms - 171
      ✓ should return the message and user password changed (56ms)
    when the id is invalid
PUT /users/qqqq/password 200 0.437 ms - 28
      ✓ should return the NOT Found message
PUT /users/5dc06234254683147ec50b95/password 200 31.662 ms - 29
      ✓ should return a message for user not find
  PUT /user/:id/editInformation
    when the id is valid
PUT /users/5dc0725fc3a0fe1df53d139d/editInformation 200 42.912 ms - 184
      ✓ should return the message and user information changed (44ms)
    when the id is invalid
PUT /users/qqqq/editInformation 200 0.286 ms - 28
      ✓ should return the NOT Found message
PUT /users/5dc06234254683147ec50b95/editInformation 200 21.558 ms - 30
      ✓ should return a message for user not find
  DELETE /users/:id
    when the id is valid
DELETE /users/5dc0725fc3a0fe1df53d139d 200 23.990 ms - 40
      ✓ should return a message and delete a user
GET /users/5dc0725fc3a0fe1df53d139d 200 36.464 ms - 36
    when the id is invalid
DELETE /users/1100001 200 0.321 ms - 238
      ✓ should return a message for User NOT DELETED
DELETE /users/5dc06234254683147ec50b95 200 27.494 ms - 28
      ✓ should return a message for user not find

Recipes: models
  GET /recipes
GET /recipes 200 26.204 ms - 2632
    ✓ should return all recipes
  GET /recipes/:id
    when the id is valid
GET /recipes/5dc07260c3a0fe1df53d139e 200 21.730 ms - 674
      ✓ should return the matching recipe
    when the id is invalid
GET /recipes/12333 200 0.590 ms - 241
      ✓ should return the NOT Found message
  GET /recipes/name/:name
    when the name is correct
GET /recipes/name/Chips 200 17.493 ms - 694
      ✓ should return the matching recipe
    when the name is wrong
GET /recipes/name/iceCream 200 22.140 ms - 40
      ✓ should return the NOT Found message
  GET /recipes/username/:username
    when the username is correct
GET /recipes/username/Francis 200 28.594 ms - 1347
      ✓ should return the matching recipe
    when the username is wrong
GET /recipes/username/Zoe 200 17.779 ms - 44
      ✓ should return the NOT Found message
  GET /recipes/:id/comment
    when the id is valid
GET /recipes/5dc07260c3a0fe1df53d139e/comment 200 114.633 ms - 250
      ✓ should return the matching comment in recipe (116ms)
    when the id is invalid
GET /recipes/11111/comment 200 0.426 ms - 241
      ✓ should return the NOT Found message
GET /recipes/5dc06234254683147ec50b95/comment 200 215.039 ms - 38
      ✓ should return the NOT Found message (217ms)
  GET /recipes/search/:name
    when the name is correct
GET /recipes/search/i 200 438.325 ms - 1218
      ✓ should return the matching recipe (440ms)
    when the name is wrong
GET /recipes/search/ooo 200 30.722 ms - 26
      ✓ should return the NOT Found message
  POST /recipes
POST /recipes 200 26.974 ms - 339
    ✓ should return confirmation message and add a recipe
GET /recipes/5dc07261c3a0fe1df53d13a3 200 20.523 ms - 517
  PUT /recipes/:id/upLike
    when the id is valid
PUT /recipes/5dc07261c3a0fe1df53d13a3/upLike 200 60.813 ms - 340
      ✓ should return the message and recipe like added by 1 (63ms)
    when the id is invalid
PUT /recipes/qqqq/upLike 200 0.442 ms - 230
      ✓ should return the NOT Found message
PUT /recipes/5dc06234254683147ec50b95/upLike 200 25.054 ms - 36
      ✓ should return the NOT Found message
  PUT /recipes/:id/editRecipes
    when the id is valid
PUT /recipes/5dc07261c3a0fe1df53d13a3/editRecipes 200 49.470 ms - 368
      ✓ should return the message and recipe information changed (51ms)
    when the id is invalid
PUT /recipes/2131231/editRecipes 200 0.418 ms - 239
      ✓ should return the NOT Found message
PUT /recipes/5dc06234254683147ec50b95/editRecipes 200 19.979 ms - 31
      ✓ should return the NOT Found message
  DELETE /recipes/:id
    when the id is valid
DELETE /recipes/5dc07261c3a0fe1df53d13a3 200 25.099 ms - 42
      ✓ should return a message and delete a recipe
GET /recipes/5dc07261c3a0fe1df53d13a3 200 18.932 ms - 38
    when the id is invalid
DELETE /recipes/1100001 200 0.446 ms - 242
      ✓ should return a message for Recipe NOT DELETED
DELETE /recipes/5dc06234254683147ec50b95 200 32.562 ms - 30
      ✓ should return a message for Recipe NOT Found
  POST /recipes/:id/addComment
    when the id is valid
POST /recipes/5dc07260c3a0fe1df53d139e/addComment 200 55.538 ms - 313
      ✓ should return confirmation message and add a comment in recipe (57ms)
GET /recipes/5dc07260c3a0fe1df53d139e/comment 200 23.205 ms - 421
    when the id is invalid
POST /recipes/123123123/addComment 200 0.648 ms - 253
      ✓ should return a message for Recipe not find
POST /recipes/5dc06234254683147ec50b95/addComment 200 29.618 ms - 36
      ✓ should return a message for Recipe not find
  DELETE /recipes/:id/comment/:cid
    when the id is valid
DELETE /recipes/5dc07260c3a0fe1df53d139e/comment/5dc07261c3a0fe1df53d13a5 200 49.940 ms - 203
      ✓ should return a message and delete a comment in recipe (52ms)
GET /recipes/5dc07260c3a0fe1df53d139e 200 29.793 ms - 689
    when the id is invalid
DELETE /recipes/5db4cd6920a901bfe/comment/5dc07261c3a0fe1df53d13a5 200 0.411 ms - 277
      ✓ should return a message for Comment NOT DELETED
DELETE /recipes/5dc06234254683147ec50b95/comment/5dc07261c3a0fe1df53d13a5 200 20.433 ms - 36
      ✓ should return a message for Comment NOT DELETED
    when the cid is invalid
DELETE /recipes/5dc07260c3a0fe1df53d139e/comment/1231231231321 200 22.113 ms - 72
      ✓ should return a message for Comment NOT DELETED


44 passing (3s)
~~~


## Extra features.

In testing, when each model testing is end, I will reset datastore to guarantee test isolation.
After testing, I do some lint (by ESLint) and improve code coverage quality.


[datamodel]: ./img/sample_data_model.gif
