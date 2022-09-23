const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');
const adapter = new FileSync('db.json');
const db = low(adapter);

class Database {
  constructor() {
    db.defaults({ messages: [], users: [] }).write();
  }

  getUserByEmail(email) {
    return db.get('users').find({ email }).value();
  }

  users() {
    return db.get('users').value();
  }

  findOrCreateUser(email) {
    let user = this.getUserByEmail(email);
    if (!user) {
      user = db.get('users').push({ id: shortid.generate(), email }).write();
    }
    return user;
  }

  createMessageForUser(user, message) {
    return db
      .get('messages')
      .push({ id: shortid.generate(), user_id: user.id, content: message, unread: true })
      .write();
  }

  createMessageForAdmin(sender, message) {
    return db
      .get('messages')
      .push({ id: shortid.generate(), from: sender, forAdmin: true, content: message, unread: true })
      .write();
  }

  findUnreadMessagesForAdmin() {
    return db.get('messages').filter({ forAdmin: true, unread: true }).value();
  }

  findUnreadMessagesForUser(user) {
    return db.get('messages').filter({ user_id: user.id, unread: true }).value();
  }

  markMessageAsRead(id) {
    return db.get('messages').find({ id }).assign({ unread: false }).write();
  }
}

module.exports = Database;
