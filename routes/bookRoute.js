let express = require('express');
let route = express();
let controller = require('../controllers/bookController');

route.post('/', controller.addBook);
route.get('/', controller.allBook);
route.patch('/:id', controller.updateBook);
route.delete('/:id', controller.deleteBook);
route.post('/borrow/:id', controller.borrowBook);
route.post('/return/:id', controller.returnBook);

module.exports = route