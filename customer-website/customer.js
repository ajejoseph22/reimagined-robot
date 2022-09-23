class Minicom {
  constructor() {
    this.sendMessageEndpoint = 'http://localhost:3001/customer_api/messages';
    this.messengerApi = 'http://localhost:3001/customer_api/ping';
    $(document).ready(() => {
      console.log("ready");
      this.logIn();

      document.getElementById('sign-in').onclick = (event) => {
        event.preventDefault();
        this.register();
      };

      document.getElementById('message-submit').onclick = (event) => {
        event.preventDefault();
        this.sendMessage();
      }
    });
  }

  sendMessage() {
    console.log("sending message")
    let email = Cookies.get('user');
    if (!email) {
      console.log("no email")
      return;
    };

    let message = {
      email,
      content: document.getElementById('message-content').value,
    };

    return $.post(this.sendMessageEndpoint, message);
  }

  register() {
    let email = document.getElementById('user-email').value;
    document.cookie = `user=${email}; SameSite=Lax`;
    this.logIn();
  }

  async logIn() {
    let email = Cookies.get('user');
    if (!email) return;

    this.addNameToDom(email);
    this.updateSignInForm();

    setInterval(async () => {
      let unreadMessages = await $.post(this.messengerApi, { email }).then();
      console.log("unreadMessages", unreadMessages)

      for (const message of unreadMessages) {
        await this.markRead(email, message.id);
      }

      for (const message of unreadMessages) {
        alert(message.content);
      }
    }, 3000);
  }

  updateSignInForm() {
    document.getElementById('sign-in').innerText = 'Switch User';
  }

  async markRead(email, message_id) {
    await $.post('http://localhost:3001/customer_api/read', {
      email,
      message_id,
    });
  }

  addNameToDom(email) {
    let name = email.split('@')[0];
    document.getElementById('welcome').innerText = `Welcome, ${name}!`;
  }
}
