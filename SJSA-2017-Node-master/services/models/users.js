var mongoose = require("mongoose");

const User = mongoose.model('user', {
    fullname: String,
    handle: String, 
    email: String,
    password: String,
    avatar: String,
    followers: [
        {
            id: String,
            handle: String,
            avatar: String
        }
    ],
    following: [
        {
            id: String,
            handle: String,
            avatar: String
        }
    ],
});

var checkUser = (email, handle) => {
    return new Promise((resolve, reject) => {
        User.findOne({$or: [{email: email}, {handle: handle}]}, (err, data) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};

var findUserbyId = (userid, cb) => {  
        User.findOne({_id: userid}, (err, data) => {
            if(err) {
                cb(err, null);
                return;
            }
            cb(null, data);
            return;
        });   
}

var getFollowers = (userid, cb) => {  
    User.findOne({_id: userid,  }, (err, data) => {
        if(err) {
            cb(err, null);
            return;
        }
        cb(null, data);
        return;
    });   
}

var getFollowing = (userid, cb) => {  
    User.findOne({_id: userid,}, (err, data) => {
        if(err) {
            cb(err, null);
            return;
        }
        cb(null, data);
        return;
    });   
}

var createUser = (data) => {
    return new Promise((resolve, reject) => {
        data.password = data.pwd1;
        var user = new User(data);
        user.save(function(err) {
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};


var validateUser = (email, password, cb) => {
    User.findOne({email: email, password: password}, function (err, data) {
        if(err){
            cb(err, null);
            return;
        }
        cb(null, data);
    });
}

var getDataForUser = (followid, cb) => {
    User.findOne({_id: followid}, function (err, data) {
        if(err){
            cb(err, null);
            return;
        }
        cb(null, data);
        return;
    });
}

var updatePassword = (uid, oldpassword, data, cb) => {
    User.updateOne({_id: uid, "password": oldpassword}, {$set: {password: data.password}}, (err) => {
        if (err) {
            cb(err); 
        }
        cb(null);
        return;
    });
};

var updateHandle = (uid, passwordCheck, data, cb) => {
    User.updateOne({_id: uid, "password": passwordCheck}, {$set: {handle: data.handle}}, (err) => {
        if (err) {
            cb(err); 
        }
        cb(null);
        return;
    });
};


var addFollow = (uid, followdata, data, cb) => {
    User.updateOne({_id: followdata._id}, {$set: {followers: [{id: data.userid, handle: data.userhandle, avatar: data.useravatar}]}}, (err) => {
        if (err) {
            cb(err); 
        }
        cb(null);
        return;
    });

    User.updateOne({_id: uid}, {$set: {following: [{id: followdata._id, handle: followdata.handle, avatar: followdata.avatar}]}}    
    );
};



module.exports = {
    checkUser,
    createUser,
    validateUser,
    updatePassword,
    addFollow,
    getDataForUser,
    updateHandle,
    getFollowers,
    getFollowing
    
}