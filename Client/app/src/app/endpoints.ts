export class Endpoints {
    static Server = 'https://localhost:44386';

    static Auth = `${Endpoints.Server}/auth`;
    static Register = `${Endpoints.Auth}/register`;
    static Login = `${Endpoints.Auth}/login`;
    static RefreshJwt = `${Endpoints.Auth}/refreshJwt`;

    static Books = `${Endpoints.Server}/books`;
    static AllBooks = Endpoints.Books;
    static GetBook = Endpoints.Books;
    static AddBook = `${Endpoints.Books}/add`;
    static EditBook = `${Endpoints.Books}/edit`;
    static DeleteBook = Endpoints.Books;
    static VoteBook = `${Endpoints.Books}/vote`;
}