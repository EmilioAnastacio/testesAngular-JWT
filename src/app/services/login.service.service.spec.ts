import { TestBed } from '@angular/core/testing';

import { LoginServiceService } from './login.service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Login } from '../models/login';
import { User } from '../models/user';

describe('LoginServiceService', () => {
  let service: LoginServiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
      ]
    });
    service = TestBed.inject(LoginServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Garante que não há solicitações pendentes
  });

  it('should log in successfully', () => {
    const loginData: Login = { username: 'testuser', password: 'testpassword' };
    const mockUser: User = { id: 1, username: 'testuser', password:'teste', token: 'testToken' };

    service.logar(loginData).subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/login');
    expect(req.request.method).toEqual('POST');
    req.flush(mockUser);
  });

  it('should log out successfully', () => {
    service.deslogar().subscribe();

    const req = httpTestingController.expectOne('http://localhost:8080/api/login/deslogar');
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should add and retrieve token from localStorage', () => {
    const token = 'testToken';

    service.addToken(token);

    const retrievedToken = service.getToken();
    expect(retrievedToken).toEqual(token);
  });

  it('should remove token from localStorage', () => {
    const token = 'testToken';

    service.addToken(token);
    service.removerToken();

    const retrievedToken = service.getToken();
    expect(retrievedToken).toBeNull();
  });
  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
});
