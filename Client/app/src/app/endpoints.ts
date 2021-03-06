import { environment } from 'src/environments/environment';

export class Endpoints {
    static Auth = `${environment.server}/auth`;
    static Register = `${Endpoints.Auth}/register`;
    static Login = `${Endpoints.Auth}/login`;
    static RefreshJwt = `${Endpoints.Auth}/refreshJwt`;
    static ResetPass = `${Endpoints.Auth}/reset-password`;
    static UserDetails = `${Endpoints.Auth}/user-details`;
    static UpdateUser = `${Endpoints.Auth}/update-user`;

    static Books = `${environment.server}/books`;
    static AllBooks = Endpoints.Books;
    static GetBook = Endpoints.Books;
    static MyBooks = `${Endpoints.Books}/my-books`;
    static AddBook = `${Endpoints.Books}/add`;
    static EditBook = `${Endpoints.Books}/edit`;
    static DeleteBook = Endpoints.Books;
    static VoteBook = `${Endpoints.Books}/vote`;
    static Review = `${Endpoints.Books}/review`;
    static DeleteReview = `${Endpoints.Books}/delete-review`;
}