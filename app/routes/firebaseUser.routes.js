module.exports = (app) => {
    const firebaseUsers = require('../controllers/firebaseUser.controller.js');

    // Create a new Note
    app.post('/users/register', firebaseUsers.create);

    // Retrieve all Notes
    app.get('/users', firebaseUsers.findAll);

    // Retrieve a single Note with noteId
    app.get('/users/:userUID', firebaseUsers.findByUID);

    // Update a Note with noteId
    app.put('/users/:userUID', firebaseUsers.update);

    // Delete a Note with noteId
    app.delete('/users/:userUID', firebaseUsers.delete);

    app.put('/locations/addLocation', firebaseUsers.addLocation);

    app.get('/users/search/:searchname', firebaseUsers.findByName);

    app.get('/users/group', firebaseUsers.getGroup);
}