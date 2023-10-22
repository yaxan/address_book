# Address Book

This project is an AddressBook application built with Angular 16.2.7, TypeScript, and the Material Design framework. The application allows users to view a list of users, search for users, and view user details.
https://yaxan.github.io/address_book/

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Features
The following features have been implemented in the application:

* User list: Displays a list of users with their name, email, and profile picture.
  * The app currently caches 50 results and paginates those, originally I had it making a new API call per page but I didn't like the microsecond loading between each page.
* User search: Allows users to search for users by name or email.
* User details: Displays detailed information about a selected user, including their name, email, phone number, and location.

## Build

* Install Node.js and npm on your machine if they are not already installed. You can download the latest version of Node.js from the official website: https://nodejs.org/en/download/
* Clone the repository to your local machine using Git: git clone https://github.com/yaxan/address_book.git
* Navigate to the project directory: cd address_book
* Install the project dependencies using npm: npm install
* Start the development server: npm start
* Open a web browser and navigate to http://localhost:4200 to view the application.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Future Work
Given more time, the following features could be added to the application:

* Didn't catch that some packages I used were deprecated until it was too late, need to replace certain things like flex-layouts
* The current design is definitely not something I'd keep, needs something more sleek and modern.
* Allow users to sort the user list by name or email.
* Allow users to edit user information and save changes to their cached contacts.
* Implement user authentication to restrict access to certain features and protect user data.
