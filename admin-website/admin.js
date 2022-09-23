class AdminApp {
  constructor() {
    this.userEndpoint = 'http://localhost:3001/admin_api/users';
    this.sendMessageEndpoint = 'http://localhost:3001/admin_api/messages';
    this.messengerApi = 'http://localhost:3001/admin_api/ping';
    this.selectedUserId = null;
    this.selectedUserEmail = null;
    $(document).ready(() => {
      this.getUnreadMessages();

      this.loadUsers();

      document.getElementById('message-submit').onclick = (event) =>
        event.preventDefault() || this.sendMessage();
    });
  }

  async getUnreadMessages() {
    setInterval(async () => {
      let unreadMessages = await $.post(this.messengerApi).then();

      unreadMessages.forEach((message) => {
        alert(`From ${message.from} \n Message: ${message.content}`);
        this.markRead(message.id);
      });
    }, 3000);
  }

  markRead(message_id) {
    $.post('http://localhost:3001/admin_api/read', {
      message_id,
    });
  }

  setReceiver(context) {
    let dataAttributes = context.dataset;
    this.selectedUserEmail = dataAttributes.userEmail;
    this.selectedUserId = dataAttributes.userId;
    document.getElementById('message-receiver').value = dataAttributes.userEmail;
  }

  loadUsers() {
    $.get(this.userEndpoint).done((users) => {
      users.forEach((user) => this.addUserToList(user));
    });
  }

  addUserToList(user) {
    let userList = document.getElementById('user-list');
    let listItem = document.createElement('li');
    let userEmail = document.createTextNode(user.email);

    listItem.setAttribute('data-user-id', user.id);
    listItem.setAttribute('data-user-email', user.email);
    listItem.classList.add('list-group-item');
    listItem.onclick = () => this.setReceiver(listItem);

    listItem.appendChild(userEmail);
    userList.appendChild(listItem);
  }

  sendMessage() {
    let message = {
      content: document.getElementById('message-content').value,
      user_id: this.selectedUserId,
      email: this.selectedUserEmail,
    };

    return $.post(this.sendMessageEndpoint, message);
  }
}
