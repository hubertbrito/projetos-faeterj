"use strict";

import ModelError from "/ModelError.js";
import Modelo from "/Modelo.js";

export default class DaoModelo {
  
  //-----------------------------------------------------------------------------------------//

  static conexao = null;

  constructor() {
    this.arrayModelos = [];
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o BD
   */ 
  async obterConexao() {
    if(DaoModelo.conexao == null) {
      DaoModelo.conexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("ModeloDB", 1); 

        requestDB.onupgradeneeded = (event) => {
          let db = event.target.result;
          let store = db.createObjectStore("ModeloST", {
            autoIncrement: true
          });
          store.createIndex("idxModelo", "idModelo", { unique: true });
        };

        requestDB.onerror = event => {
          reject(new ModelError("Erro: " + event.target.errorCode));
        };

        requestDB.onsuccess = event => {
          if (event.target.result) {
            // event.target.result apontará para IDBDatabase aberto
            resolve(event.target.result);
          }
          else 
            reject(new ModelError("Erro: " + event.target.errorCode));
        };
      });
    }
    return await DaoModelo.conexao;
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterModelos() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["ModeloST"], "readonly");
        store = transacao.objectStore("ModeloST");
        indice = store.index('idxModelo');
      }
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Modelo.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayModelos = await promessa;
    return this.arrayModelos;
  }

  //-----------------------------------------------------------------------------------------//

  

  //-----------------------------------------------------------------------------------------//
  
  async obterModeloPelaMatricula(idModelo) {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
     try{
        transacao = connection.transaction(["ModeloST"], "readonly");
        store = transacao.objectStore("ModeloST");
        indice = store.index('idxModelo');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(idModelo);
      consulta.onsuccess = function(event) { 
        if(consulta.result != null)
          resolve(Modelo.assign(consulta.result)); 
        else
          resolve(null);
      };
      consulta.onerror = function(event) { reject(null); };
    });
    let aluno = await promessa;
    return aluno;
  }

  //-----------------------------------------------------------------------------------------//

  async obterModelosPeloAutoIncrement() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["ModeloST"], "readonly");
        store = transacao.objectStore("ModeloST");
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Modelo.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayModelos = await promessa;
    return this.arrayModelos;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(aluno) {
    
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["ModeloST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o modelo", event.target.error));
      };
      let store = transacao.objectStore("ModeloST");
      let requisicao = store.add(Modelo.deassign(aluno));
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(aluno) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["ModeloST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o modelo", event.target.error));
      };
      let store = transacao.objectStore("ModeloST");     
      let indice = store.index('idxModelo');
      var keyValue = IDBKeyRange.only(aluno.getIdModelo());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        console.log(cursor);
        if (cursor) {
          if (cursor.value.idModelo == aluno.getIdModelo()) {
            const request = cursor.update(Modelo.deassign(aluno));
            request.onsuccess = () => {
              console.log("[DaoModelo.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Modelo com a idModelo" + aluno.getIdModelo() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(aluno) {
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["ModeloST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o modelo", event.target.error));
      };
      let store = transacao.objectStore("ModeloST");
      let indice = store.index('idxModelo');
      var keyValue = IDBKeyRange.only(aluno.getIdModelo());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.idModelo == aluno.getIdModelo()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Modelo com a idModelo " + aluno.getIdModelo() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
