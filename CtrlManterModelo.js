"use strict";

import Status from "/Status.js";
import Modelo from "/Modelo.js";
import DaoModelo from "/DaoModelo.js";
import ViewerModelo from "/ViewerModelo.js";

export default class CtrlManterModelo {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de modelos
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto modelo que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoModelo();
    this.#viewer = new ViewerModelo(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os modelos presentes na base
    let conjModelos = await this.#dao.obterModelos();
    
    // Se a lista de modelos estiver vazia
    if(conjModelos.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjModelos.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjModelos.length, conjModelos[this.#posAtual - 1]);
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjModelos = await this.#dao.obterModelos();
    if(conjModelos.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjModelos = await this.#dao.obterModelos();
    if(this.#posAtual < conjModelos.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjModelos = await this.#dao.obterModelos();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjModelos = await this.#dao.obterModelos();
    this.#posAtual = conjModelos.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "incluir"
    console.log(this.#status);
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(idModelo, marca, descricao, categoria, qntdEstoque) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let modelo = new Modelo(idModelo, marca, descricao, categoria, qntdEstoque);
        await this.#dao.incluir(modelo); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(idModelo, marca, descricao, categoria, qntdEstoque) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let modelo = await this.#dao.obterModeloPelaMatricula(idModelo); 
        if(modelo == null) {
          alert("modelo com identificação " + idModelo + " não encontrado.");
        } else {
          modelo.setMarca(marca);
          modelo.setDescricao(descricao);
          modelo.setCategoria(categoria);
          modelo.setQntdEstoque(qntdEstoque);
          await this.#dao.alterar(modelo); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async excluir(idModelo) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let modelo = await this.#dao.obterModeloPelaMatricula(idModelo); 
        if(modelo == null) {
          alert("modelo com identificação " + idModelo + " não encontrado.");
        } else {
          await this.#dao.excluir(modelo); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//























