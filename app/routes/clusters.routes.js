module.exports = (app) => {
    const Cluster = require('../controllers/clusters.controller.js');

    // Create a new Cluster
    app.post('/clusters/add', Cluster.create);

    // Retrieve all Cluster
    app.get('/clusters', Cluster.findAll);

    app.get('/friends/:userUID', Cluster.findFriends);

    // Retrieve relations for the userUID
    app.get('/near/:userUID', Cluster.findByUID);

    app.get('/optics', Cluster.optics);



}