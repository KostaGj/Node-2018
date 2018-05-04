var UserModel = require('../../models/users');
var jwt = require("jsonwebtoken");
var config = require("../../config");

var createUser = (req, res) => {
    var isValid = req.body.fullname != undefined
                && req.body.fullname.length > 0
                && req.body.email != undefined
                && req.body.email.length > 0
                && req.body.pwd1 != undefined
                && req.body.pwd1.length > 0
                && req.body.pwd2 != undefined
                && req.body.pwd2.length > 0
                && req.body.newHandle != undefined
                && req.body.newHandle.length > 0
                && req.body.pwd1 == req.body.pwd2;
    if(isValid){
        UserModel.checkUser(req.body.email, req.body.newHandle)
            .then((data) => {
                if(data != null){
                    console.log('conflict');
                    throw new Error('Similar user already exists!');
                }
                return UserModel.createUser(req.body);
            })
            .then(() => {
                res.status(200);
                res.send("OK");
                return;
            })
            .catch((err) => {
                res.status(409);
                res.send("Conflict");
                return;
            });
    } else {
        res.status(400);
        res.send("Bad Request");
        return;
    }
}

var login = (req, res) => {
    var isValid = req.body.email != undefined
        && req.body.email.length > 0
        && req.body.password != undefined
        && req.body.password.length > 0;
    if(isValid){
        UserModel.validateUser(req.body.email, req.body.password, function (err, data) {
            if(err) {
                res.status(500);
                res.send("Internal Server Error");
                return;
            }
            if(data == null){
                res.status(404);
                res.send("Not Found");
                return;
            }
            // generate token!
            var claims = {
                uid: data._id,
                email: data.email,
                newHandle: data.newHandle,
                avatar: data.avatar
            };
            var token = jwt.sign(claims, config("jwt_secret"));
            res.status(200);
            res.json({ token: token });
            return;
        });
    } else {
        res.status(400);
        res.send("Bad Request");
        return;
    }
}

var renewToken = (req, res) => {
    var claims = {
        uid: req.user.uid,
        email: req.user.email,
        newHandle: req.user.newHandle,
        avatar: req.user.avatar,
    };
    var token = jwt.sign(claims, config("jwt_secret"));
    res.status(200);
    res.json({ token: token });
}

var changeHandle = (req, res) => {
    var isValid = req.body.newHandle != undefined && req.body.newHandle.length > 0 && req.body.confirmHandle != undefined && req.body.confirmHandle.length > 0 &&  req.body.newHandle == req.body.confirmHandle && req.body.password != undefined && req.body.password.length > 0;

    if (isValid){  
        var passwordCheck = req.body.password;    
        var data = {
            handle: req.body.newHandle,           
        }

        UserModel.updateHandle(req.user.uid, passwordCheck, data, (err) => {
            if (err) {
                res.status(500);
                res.send('Internal server error');
                return;
            }
            res.status(200);
            res.send('OK');
            return;
        });
    } else {
        res.status(400);
        res.send('Bad request');
    }
};

var changePassword = (req, res) => {
    var isValid = req.body.pwd1 != undefined && req.body.pwd1.length > 0 && req.body.pwd2 != undefined && req.body.pwd2.length > 0 && req.body.oldpwd != undefined && req.body.oldpwd.length > 0 && req.body.pwd1 == req.body.pwd2;


    if (isValid){
        var oldpassword = req.body.oldpwd;        
        var data = {
            password: req.body.pwd1,            
        }

        UserModel.updatePassword(req.user.uid, oldpassword, data, (err) => {
            if (err) {
                res.status(500);
                res.send('Internal server error');
                return;
            }
            res.status(200);
            res.send('OK');
            return;
        });
    } else {
        res.status(400);
        res.send('Bad request');
    }
};

var seeFollowers = (req, res) => {       
    if (req.params.followid != undefined){  
    
         UserModel.seeFollowers(req.params.followid, (err, data) => {
            if (err){
                res.status(500);
                res.send('Internal server error');
                return;
            }
            res.status(200);
            res.json(data);
            return;
        });

    } else{
        res.status(400);
        res.send('Bad request');
    } 
}

var seeFollowing = (req, res) => {       
    if (req.params.userid != undefined){  
    
         UserModel.getFollowing(req.params.userid, (err, data) => {
            if (err){
                res.status(500);
                res.send('Internal server error');
                return;
            }
            res.status(200);
            res.json(data);
            return;
        });

    } else{
        res.status(400);
        res.send('Bad request');
    } 
}

var followUser = (req, res) => {
    
    if (req.params.followid != undefined){  

        UserModel.getDataForUser(req.params.followid, (err, data) => {
            if (err) {
                res.status(500);
                res.send('Internal server error');
                return;
            }

            var followdata = data;
            console.log(followdata);

            var mydata = {
                userid: req.user._id,
                usernewHandle: req.user.newHandle,
                useravatar: req.user.avatar           
            }

            UserModel.addFollow(req.user.uid, followdata, mydata, (err) => {
                if (err) {
                    res.status(500);
                    res.send('Internal server error');
                    return;
                }
                res.status(200);
                res.send('OK');
                return;
            });               
        })
                    
    } else {
        res.status(400);
        res.send('Bad request');
    }
}

module.exports = {
    createUser,
    login,
    renewToken,
    changePassword,
    followUser, 
    changeHandle,
    seeFollowers,
    seeFollowing
}