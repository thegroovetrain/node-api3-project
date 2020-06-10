const express = require('express');

const userDB = require('./userDb');
const postDB = require('../posts/postDb');

const validateUser = require('../middleware/validateUser');
const validateUserId = require('../middleware/validateUserId');
const validatePost = require('../middleware/validatePost');

const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  try {
    const newUser = {
      name: req.body.name
    };
    userDB.insert(newUser).then(user => {
      return res.status(201).json(user);
    }).catch(err => {
      return res.status(500).json({message: "name must be unique"});
    });
  } catch(err) {
    return res.status(500).json({message: "error creating user"});
  }
});

router.post('/:id/posts', validateUserId(), validatePost(), (req, res) => {
  try {
    const newPost = {
      text: req.body.text,
      user_id: req.params.id,
    }
    postDB.insert(newPost).then(post => {
      return res.status(200).json(post);
    })
  } catch(err) {
    return res.status(500).json({message: "error creating post"});
  }
});

router.get('/', (req, res) => {
  try {
    userDB.get().then(posts => {
      return res.status(200).json(posts);
    })
  } catch(err) {
    return res.status(500).json({message: "error getting users data"});
  }
});

router.get('/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId(), (req, res) => {
  try {
    userDB.getUserPosts(req.params.id).then(userPosts => {
      if (userPosts.length === 0) {
        return res.status(404).json({message: "no posts found for user with provided id"});
      }
      return res.status(200).json(userPosts);
    });
  } catch(err) {
    return res.status(500).json({message: "error getting user posts data"});
  }
});

router.delete('/:id', validateUserId(), (req, res) => {
  try {
    userDB.remove(req.params.id).then(n => {
      return res.status(200).json(req.user);
    }).catch(err => {
      return res.status(500).json({message: "error deleting user"});
    })
  } catch(err) {
    return res.status(500).json({message: "error deleting user"});
  }
});

router.put('/:id', validateUserId(), validateUser(), (req, res) => {
  try {
    const changes = {
      name: req.body.name,
    };
    userDB.update(req.params.id, changes).then(n => {
      userDB.getById(req.params.id).then(user => {
        return res.status(200).json(user);
      })
    })
  } catch(err) {
    return res.status(500).json({message: "error updating user"});
  }
});

module.exports = router;
