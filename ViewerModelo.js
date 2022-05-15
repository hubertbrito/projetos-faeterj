import Status from "/Status.js";
import Modelo from "/Modelo.js";
import ViewerError from "/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerModelo {

  #ctrl;
  
  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.divNavegar  = this.obterElemento('divNavegar'); 
    this.divComandos = this.obterElemento('divComandos'); 
    this.divAviso  = this.obterElemento('divAviso'); 
    this.divDialogo = this.obterElemento('divDialogo');

    this.btPrimeiro = this.obterElemento('btPrimeiro');
    this.btAnterior = this.obterElemento('btAnterior');
    this.btProximo = this.obterElemento('btProximo');
    this.btUltimo = this.obterElemento('btUltimo');

    this.btIncluir = this.obterElemento('btIncluir');
    this.btExcluir = this.obterElemento('btExcluir');
    this.btAlterar = this.obterElemento('btAlterar');
    this.btSair = this.obterElemento('btSair');

    this.btOk = this.obterElemento('btOk');
    this.btCancelar = this.obterElemento('btCancelar');

    this.IdModelo = this.obterElemento('tfIdModelo');
    this.tfMarca = this.obterElemento('tfMarca');
    this.tfDescricao = this.obterElemento('tfDescricao');
    this.tfCategoria = this.obterElemento('tfCategoria');
    this.tfQntdEstoque = this.obterElemento('tfQntdEstoque');
      
    this.btPrimeiro.onclick = fnBtPrimeiro; 
    this.btProximo.onclick = fnBtProximo; 
    this.btAnterior.onclick = fnBtAnterior; 
    this.btUltimo.onclick = fnBtUltimo; 

    this.btIncluir.onclick = fnBtIncluir; 
    this.btAlterar.onclick = fnBtAlterar; 
    this.btExcluir.onclick = fnBtExcluir; 

    this.btOk.onclick = fnBtOk; 
    this.btCancelar.onclick = fnBtCancelar; 
  }

//------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

//------------------------------------------------------------------------//
  
  getCtrl() { 
    return this.#ctrl;
  }

//------------------------------------------------------------------------//
  
  apresentar(pos, qtde, aluno) {    
    
    this.configurarNavegacao( pos <= 1 , pos == qtde );   

    if(aluno == null) {
      this.IdModelo.value = "";
      this.tfMarca.value       = "";
      this.tfDescricao.value      = "";
      this.tfCategoria.value     = "";
      this.tfQntdEstoque.value  = "";
      this.divAviso.innerHTML = " Número de Modelos: 0";
    } else {
      this.IdModelo.value = aluno.getIdModelo();
      this.tfMarca.value       = aluno.getMarca();
      this.tfDescricao.value      = aluno.getDescricao();
      this.tfCategoria.value     = aluno.getCategoria();
      this.tfQntdEstoque.value  = aluno.getQntdEstoque();
      this.divAviso.innerHTML = "Posição: " + pos + " | Número de Modelos: " + qtde;
    }
  }

//------------------------------------------------------------------------//

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled   = flagFim;
    this.btProximo.disabled  = flagFim;
    this.btAnterior.disabled = flagInicio;
  }
  
//------------------------------------------------------------------------//
  
  statusEdicao(operacao) { 
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false; 
    
    if(operacao != Status.EXCLUINDO) {
      this.IdModelo.disabled = false;
      this.tfMarca.disabled = false;
      this.tfDescricao.disabled = false;
      this.tfCategoria.disabled = false;
      this.tfQntdEstoque.disabled = false;
      this.divAviso.innerHTML = "";      
    } else {
      this.divAviso.innerHTML = "Deseja excluir este modelo?";      
    }
    if(operacao == Status.INCLUINDO) {
      this.IdModelo.disabled = false;
      this.IdModelo.value = "";
      this.tfMarca.value = "";
      this.tfDescricao.value = "";
      this.tfCategoria.value = "";
      this.tfQntdEstoque.value = "";
    }
  }

//------------------------------------------------------------------------//
  
  statusApresentacao() { 
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true; 

    this.IdModelo.disabled = true;
    this.tfMarca.disabled = true;
    this.tfDescricao.disabled = true;
    this.tfCategoria.disabled = true;
    this.tfQntdEstoque.disabled = true;
  }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtPrimeiro() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarPrimeiro();
  
}

//------------------------------------------------------------------------//

function fnBtProximo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarProximo();
  
}

//------------------------------------------------------------------------//

function fnBtAnterior() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarAnterior();
  
}

//------------------------------------------------------------------------//

function fnBtUltimo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarUltimo();
  
}
//------------------------------------------------------------------------//

function fnBtIncluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarIncluir();
}

//------------------------------------------------------------------------//

function fnBtAlterar() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  console.log("chamou no viewer")
  this.viewer.getCtrl().iniciarAlterar();
  
}

//------------------------------------------------------------------------//

function fnBtExcluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const idmodelo = this.viewer.IdModelo.value;
  const marca = this.viewer.tfMarca.value;
  const descricao = this.viewer.tfDescricao.value;
  const categoria = this.viewer.tfCategoria.value;
  const qntdEstoque = this.viewer.tfQntdEstoque.value;
    
  // Como defini que o método "efetivar" é um dos métodos incluir, excluir ou alterar
  // não estou precisando colocar os ninhos de IF abaixo.
  this.viewer.getCtrl().efetivar(idmodelo, marca, descricao, categoria, qntdEstoque); 

}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar(); 
}

//------------------------------------------------------------------------//





