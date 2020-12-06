export class Endpoints {
    static Server = 'https://localhost:44386';

    static Auth = `${Endpoints.Server}/auth`;
    static Register = `${Endpoints.Auth}/register`;
    static Login = `${Endpoints.Auth}/login`;
    static RefreshJwt = `${Endpoints.Auth}/refreshJwt`;
    static ResetPass = `${Endpoints.Auth}/reset-password`;
    static UserDetails = `${Endpoints.Auth}/user-details`;
    static UpdateUser = `${Endpoints.Auth}/update-user`;

    static Books = `${Endpoints.Server}/books`;
    static AllBooks = Endpoints.Books;
    static GetBook = Endpoints.Books;
    static MyBooks = `${Endpoints.Books}/my-books`;
    static AddBook = `${Endpoints.Books}/add`;
    static EditBook = `${Endpoints.Books}/edit`;
    static DeleteBook = Endpoints.Books;
    static VoteBook = `${Endpoints.Books}/vote`;
}