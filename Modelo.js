import ModelError from "/ModelError.js";

export default class Modelo {
    
  //
  // ATRIBUTOS PRIVADOS
  //
  #idModelo;
  #marca;
  #descricao;
  #categoria;
  #qntdEstoque;

  //-----------------------------------------------------------------------------------------//

  constructor(idModelo, marca, descricao, categoria, qntdEstoque) {
    this.setIdModelo(idModelo);
    this.setMarca(marca);
    this.setDescricao(descricao);
    this.setCategoria(categoria);
    this.setQntdEstoque(qntdEstoque);      
  }
  

  //-----------------------------------------------------------------------------------------//
  getIdModelo() {
    return this.#idModelo;
  }
  
  //-----------------------------------------------------------------------------------------//

  setIdModelo(idModelo) {
    if(!Modelo.validarIdModelo(idModelo))
      throw new ModelError("idModelo Inválido: " + idModelo);
    this.#idModelo = idModelo;
  }
  //-----------------------------------------------------------------------------------------//

  getMarca() {
    return this.#marca;
  }
  
  //-----------------------------------------------------------------------------------------//

  setMarca(marca) {
    if(!Modelo.validarMarca(marca))
      throw new ModelError("Marca Inválida: " + marca);
    this.#marca = marca;
  }
  
  //-----------------------------------------------------------------------------------------//

  getDescricao() {
    return this.#descricao
  }
  //-----------------------------------------------------------------------------------------//

  setDescricao(descricao) {
    if(!Modelo.validarDescricao(descricao))
      throw new ModelError("Descricao Inválida: " + descricao);
    this.#descricao = descricao;
  }
  
  //-----------------------------------------------------------------------------------------//

  getCategoria() {
    return this.#categoria;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCategoria(categoria) {
    if(!Modelo.validarCategoria(categoria))
      throw new ModelError("Categoria inválid: " + categoria);
    this.#categoria = categoria;
  }
  
  //----------qntdEstoque-----------------------------------------------------------------------//

  getQntdEstoque() {
    return this.#qntdEstoque;
  }
  
  //-----------------------------------------------------------------------------------------//

  setQntdEstoque(qntdEstoque) {
    if(!Modelo.validarQntdEstoque(qntdEstoque))
      throw new ModelError("qntdEstoque inválido: " + qntdEstoque);
    this.#qntdEstoque = qntdEstoque;
  }
  
  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{' +
               '"idModelo" : "'+ this.#idModelo + '",' +
               '"marca" :  "'     + this.#marca       + '", ' +
               '"descricao" : "'     + this.#descricao      + '", ' +
               '"categoria" : "'    + this.#categoria     + '", ' +
               '"qntdEstoque" : "' + this.#qntdEstoque  + '"' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//
  static assign(obj) {
    return new Modelo(obj.idModelo, obj.marca, obj.descricao, obj.categoria, obj.qntdEstoque);
  }

  static deassign(obj) {
    return JSON.parse(obj.toJSON());
  }

  static validarIdModelo(idModelo) {
    if(idModelo == null || idModelo == "" || idModelo == undefined)
      return false;
    const padraoIdModelo = /[0-9]/;
    if (!padraoIdModelo.test(idModelo))
      return false;
    return true;
  }
  //-----------------------------------------------------------------------------------------//

  static validarMarca(marca) {
    if(marca == null || marca == "" || marca == undefined)
      return false;
    return true;
  }
  //-----------------------------------------------------------------------------------------//
  static validarDescricao(descricao) {
    if(descricao == null || descricao == "" || descricao == undefined)
      return false;
    if (descricao.length > 150) 
      return false;
     return true;
}
//--------------------------------------------------------------------------------------------//
  static validarCategoria(categoria){
    if(categoria == null || categoria == "" || categoria == undefined)
    return false;
  if (categoria.length > 40) 
    return false;
  return true;
  }
  //----------------------------------------------------------
  static validarQntdEstoque(qntdEstoque){
    if(qntdEstoque == null || qntdEstoque == "" || qntdEstoque == undefined)
    return false;
  const padraoQntdEstoque = /[0-9]/;
  if (!padraoQntdEstoque.test(qntdEstoque))
    return false;
  return true;
 }


  mostrar() {
    let texto = "Matrícula: " + this.idModelo + "\n";
    texto += "Nome: " + this.nome + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
} 

