# Minicom

Welcome to Minicom! A prototype Intercom service. Inside this directory you'll find a customer website, and admin website and servers that represents a simplified version of how Intercom works.

## Installation

Run the command that matches your framework to install it.

```
# Mac/Linux/Windows with WSL (Windows Subsystem for Linux)
script/node/setup

# Windows without WSL (Windows Subsystem for Linux)
script\node\setup

(examples)

script/rails/setup
script/spring/setup
script/node/setup
script/django/setup
```

## Getting started

Run the following in 3 different terminal windows:

```
script/customer/start
script/admin/start
script/node/start
```

This will give you the following:

1. A customer webpage running at http://127.0.0.1:8010
2. An admin dashboard running at http://127.0.0.1:8011
3. An API webserver, used by the customer and admin pages, running at http://127.0.0.1:3001

## Sending a message

Open the [customer website](http://127.0.0.1:8010) and enter the email address `alice@example.com`, then click the **Sign up** button.

You'll see the welcome message update with the name `alice`, but nothing else will happen - don't worry.

Now open or refresh the [admin interface](http://127.0.0.1:8011) and you should see your user has been created.

Click on `alice@example.com` in the admin interface (you cannot manually enter the email) and send a message. Refresh the customer site and that message should appear in an alert.

## Structure

A quick overview of the application structure:

- **admin-website/** -- The root of the admin interface.
- **customer-website/** -- The root of the customer's website.

Your framework will have a folder with it's name and have 4 endpoints:

- **POST /customer_api/ping** (registers a customer and returns their unread messages)
- **POST /customer_api/read** (marks a message as read)
- **GET /admin_api/users** (lists all users)
- **POST /admin_api/messages** (creates a message for a user

## Folders

- [Node](./node/README.md)

