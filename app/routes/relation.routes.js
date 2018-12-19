module.exports = (app) => {
    const Relations = require('../controllers/relation.controller.js');

    // Create a new Relation
    app.post('/relations/add', Relations.create);

    // Retrieve all Relations
    app.get('/relations', Relations.findAll);

    // Retrieve relations for the userUID
    app.get('/relations/:userUID', Relations.findByUID);


    app.get('/blocked/:userUID', Relations.blocked);

    //Block user
    app.post('/relations/block', Relations.block);

    //Block user
    app.post('/relations/unblock', Relations.unblock);

    // Delete relation with userUIDs
    app.post('/relations', Relations.delete);
}