var express = require("express");
var cors = require("cors");
var jwt = require('express-jwt');
var bodyParser = require("body-parser")

var config = require("../config");
var DB = require("../config/db");

var ProfileController = require('../controllers/auth/user');


DB.Init();

var app = express();
app.use(bodyParser.json());
app.use(cors());

var jwtCheck = () => {
    return jwt({ secret: config("jwt_secret") });
}

// post routes
app.patch('/user/changepw', jwtCheck(), ProfileController.changePassword);
app.patch('/user/changehandle', jwtCheck(), ProfileController.changeHandle);
app.patch("/follow/:followid", jwtCheck(), ProfileController.followUser)
app.get('/userfollowers/:userid', jwtCheck(), ProfileController.seeFollowers );
app.get('/userfollows/:userid', jwtCheck(), ProfileController.seeFollowing);


app.use((err, req, res, next) => {
    if (err.name == 'UnauthorizedError') {
        res.send('Invalid token');
    }
});

app.listen(config("servers")['profile-server'].port, () => {
    console.log('Server started on port ' + config("servers")['profile-server'].port);
});