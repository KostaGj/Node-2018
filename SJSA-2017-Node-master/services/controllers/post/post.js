var PostModel = require('../../models/posts');

var createPost = (req, res) => {
    console.log(req.user)
    if(req.body.picture != undefined && req.body.picture.length > 0){
        var description = '';
        var tags = [];
        var deleted = false;
        var publish_date = new Date();
        if (req.body.description != undefined && req.body.description.length > 0){
            description = req.body.description;
            tags = req.body.description.match(/#([a-z\-_A-Z0-9]*)\ /g).map((t) => {
                return  t.replace('#', '').replace(' ', '');
            });
        }
        var data = {
            user: req.user,
            description: description,
            tags: tags,
            deleted: deleted,
            publish_date: publish_date,
        };
        PostModel.addPost(data, (err) => {
            if(err){
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

var updatePost = (req, res) => {
    if (req.body.description != undefined && req.body.description.length > 0 && req.params.pid != undefined){
        description = req.body.description;
        tags = req.body.description.match(/#([a-z\-_A-Z0-9]*)\ /g).map((t) => {
            return t.replace('#', '').replace(' ', '');
        });
        var data = {
            description: description,
            tags: tags
        }
        PostModel.updatePost(req.user.uid, req.params.pid, data, (err) => {
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

var deletePost = (req, res) => {
    if(req.params.pid != undefined) {
        PostModel.deletePost(req.user.uid, req.params.pid, (err) => {
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

var getPost = (req, res) => {
    if (req.params.pid != undefined) {
        PostModel.getPost(req.params.pid, (err, data) => {
            if (err) {
                res.status(500);
                res.send('Internal server error');
                return;
            }
            res.status(200);
            res.json(data);
            return;
        });
    } else {
        res.status(400);
        res.send('Bad request');
    }
};

var getAllUserPosts = (req, res) => {
    if (req.params.uid != undefined) {
        PostModel.getAllUserPosts(req.params.uid, (err, data) => {
            if (err) {
                res.status(500);
                res.send('Internal server error');
                return;
            }
            res.status(200);
            res.json(data);
            return;
        });
    } else {
        res.status(400);
        res.send('Bad request');
    }
};

var getFeed = (req, res) => {

};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getAllUserPosts,
    getFeed
}