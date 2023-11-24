import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProdutosService } from './produtos.service';
import { Produto } from '../models/produto';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProdutosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Garante que não há solicitações pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all produtos', () => {
    const mockProdutos: Produto[] = [
      { id: 1, nome: 'Produto 1', valor:10 },
      { id: 2, nome: 'Produto 2', valor:20 },
    ];

    service.listAll().subscribe((produtos: Produto[]) => {
      expect(produtos).toEqual(mockProdutos);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/produto');
    expect(req.request.method).toEqual('GET');
    req.flush(mockProdutos);
  });

  it('should save a produto', () => {
    const newProduto: Produto = { id: 3, nome: 'Novo Produto', valor:30 };

    service.save(newProduto).subscribe((produto: Produto) => {
      expect(produto).toEqual(newProduto);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/produto');
    expect(req.request.method).toEqual('POST');
    req.flush(newProduto);
  });

  it('should handle an error gracefully in exemploErro', () => {
    service.exemploErro().subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error.status).toEqual(500); // Simulando um erro interno do servidor
      }
    );

    const req = httpTestingController.expectOne('http://localhost:8080/api/produto/erro');
    expect(req.request.method).toEqual('GET');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  // Adicione mais testes conforme necessário para outros métodos ou cenários específicos
});
