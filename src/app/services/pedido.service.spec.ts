import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PedidosService } from './pedidos.service';
import { Pedido } from '../models/pedido';

describe('PedidosService', () => {
  let service: PedidosService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PedidosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Garante que não há solicitações pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all pedidos', () => {
    const mockPedidos: Pedido[] = [
      { id: 1, obs: 'Pedido 1', produtos: [{id:1,nome:"shud",valor:10}] },
      { id: 2, obs: 'Pedido 2', produtos: [{id:2,nome:"xhud",valor:20}]},
    ];

    service.listAll().subscribe((pedidos: Pedido[]) => {
      expect(pedidos).toEqual(mockPedidos);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/pedido');
    expect(req.request.method).toEqual('GET');
    req.flush(mockPedidos);
  });

  it('should save a pedido', () => {
    const newPedido: Pedido = { id: 3, obs: 'Novo Pedido', produtos:[{id:3,nome:"novo",valor:30}] };

    service.save(newPedido).subscribe((pedido: Pedido) => {
      expect(pedido).toEqual(newPedido);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/pedido');
    expect(req.request.method).toEqual('POST');
    req.flush(newPedido);
  });

  it('should handle an error gracefully in exemploErro', () => {
    service.exemploErro().subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error.status).toEqual(500); // Simulando um erro interno do servidor
      }
    );

    const req = httpTestingController.expectOne('http://localhost:8080/api/pedido/erro');
    expect(req.request.method).toEqual('GET');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  // Adicione mais testes conforme necessário para outros métodos ou cenários específicos
});
