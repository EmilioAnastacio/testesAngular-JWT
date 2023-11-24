import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PedidosdetailsComponent } from './pedidosdetails.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('PedidosdetailsComponent', () => {
  let component: PedidosdetailsComponent;
  let fixture: ComponentFixture<PedidosdetailsComponent>;

  beforeEach(() => {  //PREPARA AS DEPENDÊNCIAS INTERNAS PARA O TESTE

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], //SE O COMPONENTE INVOCA ALGUM SERVICE, INCLUÍMOS ESSA DEPENDÊNCIA DE HTTP DE TESTE
      declarations: [PedidosdetailsComponent],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA //PARA QUE O KARMA NÃO CONFUNDA ELEMENTOS ANGULAR NO TEMPLATE COMO ERROS
      ]
    });

    fixture = TestBed.createComponent(PedidosdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() =>{
    let aux: Pedido = new Pedido();
    aux.obs = "observacao";
    aux.produtos = [{id:1,nome:"shud",valor:10}];
    component.pedido = aux;
    fixture.detectChanges();
  })

  it('should create', () => { //TESTE EM SI - EQUIVALE AO @TEST
    expect(component).toBeTruthy();
  });

  it('TESTE DE INTERPOLACAO INPUT', () => {
    let valorElemento = fixture.debugElement.query(By.css('input[name="exampleInputText1"]')).nativeElement.ngModel;
    expect(valorElemento).toEqual('observacao');

     let valorElemento2 = fixture.debugElement.query(By.css('span[id="total"]')).nativeElement.innerHTML;
     expect('2').toEqual(valorElemento2);
  });

  beforeEach(() => { //MOCANDO DADOS
    let aux: Pedido = new Pedido();
    aux.obs = "observacao";
    aux.produtos = [{id:1,nome:"shud",valor:10}, {id:2,nome:"shud",valor:10}];
    component.pedido = aux;
  
    const httpSpy = TestBed.inject(HttpClient)
    spyOn(httpSpy, 'post').and.returnValue(of(aux));
    spyOn(httpSpy, 'put').and.returnValue(of(aux));
  
    fixture.detectChanges(); //refresh
  });
  
  
  it('Teste de @Output() retorno', fakeAsync(() => {
    spyOn(component.retorno, 'emit');
    component.salvar();
    expect(component.retorno.emit).toHaveBeenCalled();
  }));


});


