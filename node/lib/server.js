const express = require('express');
const logger = require('morgan');
const parser = require('body-parser');
const cors = require('./cors');
const Database = require('./db');

class Server {
  app = null;
  db = null;

  constructor() {
    this.app = express();
    this.db = new Database();
    this.prepareApp();
    this.setupAPIEndpoints();
  }

  prepareApp() {
    this.app.set('port', process.env.PORT || 3001);
    this.app.use(cors);
    this.app.use(logger('dev'));
    this.app.use(parser.urlencoded({ extended: false }));
  }

  setupAPIEndpoints() {
    //
    // GET /admin_api/users
    // Renders the user list and message composer.
    //
    this.app.get('/admin_api/users', (req, res) => {
      let users = this.db.users();
      res.json(users);
    });

    //
    // POST /admin_api/messages
    // Creates a new message for a user.
    // Params:
    //   email: The email address of the user to send the message to.
    //   message: Message content
    //
    this.app.post('/admin_api/messages', (req, res) => {
      let user = this.db.getUserByEmail(req.body.email);
      let message = this.db.createMessageForUser(user, req.body.content);
      res.json({ message });
    });

    this.app.post('/admin_api/ping', (req, res) => {
      let unreadMessages = this.db.findUnreadMessagesForAdmin();

      res.json(unreadMessages);
    });

    //
    // POST /admin_api/read
    // Marks the most recent unread message for the admin as read.
    // Params:
    //   message_id: The id of the message.
    //
    this.app.post('/admin_api/read', (req, res) => {
      this.db.markMessageAsRead(req.body.message_id);
      res.json(null);
    });


    //
    // POST /customer_api/messages
    // Creates a new message for admin.
    // Params:
    //   message: Message content
    //
    this.app.post('/customer_api/messages', (req, res) => {
      let {email, content} = req.body;
      let message = this.db.createMessageForAdmin(email, content);
      res.json({ message });
    });

    //
    // POST /customer_api/ping
    // Creates or updates a user, and renders a JSON array of
    // unread messages for that user.
    // Params:
    //   email: The email address of the user.
    //

    this.app.post('/customer_api/ping', (req, res) => {
      let user = this.db.findOrCreateUser(req.body.email);
      let unreadMessages = this.db.findUnreadMessagesForUser(user);

      res.json(unreadMessages);
    });

    //
    // POST /customer_api/read
    // Marks the most recent unread message for a user as read.
    // Params:
    //   message_id: The id of the message.
    //
    this.app.post('/customer_api/read', async (req, res) => {
      await this.db.markMessageAsRead(req.body.message_id);
      res.json(null);
    });
  }

  start() {
    this.app.listen(this.app.get('port'), () => {
      console.log('Admin listening on port ' + this.app.get('port'));
    });
  }
}

module.exports = Server;
