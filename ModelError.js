
export default class ModelError extends Error {
  
    // Construtor da Classe ModelError
    constructor(txtDeErro) {
      super(txtDeErro);
      console.log(txtDeErro + '\n\n' + this.stack);
    }
}