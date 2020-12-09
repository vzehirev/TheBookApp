# The app
Books sharing SPA where people can share their favourite book/s with a brief review/description. The books can be upvoted/downvoted as well as reviewed/commented by the users. Users can manage their accounts.

# Server-side
ASP.NET Core WebAPI, JWT authentication with roles, MS SQL server, Entity framework, Cloudinary for uploading and storing images (books' covers), sending e-mails (forgotten password) using SMTP and Gmail.

# Client-side
Full Angular 10 SPA with Materialize CSS. Fully responsive.

1. Auth
- JWT is used for authentication, authorization and session handling
- Users can register, login/logout and reset password
- Each user can edit their own account details (username, e-mail, password)
- Each user can edit and delete the books added by him/her
- Users with Admin role can edit and delete all of the books and delete reviews/comments

2. Books
- All the books are visible for everyone (auth or not)
- Books can be sorted by year of issue or top rated
- Only logged in users can add new books
- Only logged in users can review/comment a book
- Only logged in users can upvote/downvote a book. Votes can't be duplicated (YouTube style)

Proper validation is used for all of the inputs and forms within the application.
Some of the routes are protected by guards.
Server-side errors are handled using interceptor.
4 dynamic pages - books, book details, account, edit book.
Angular's HttpClient and REST are used for client and server communication.
App is deployed in Azure: https://tba.azurewebsites.net/ (!initial loading is slow due to using a free tier plan)
