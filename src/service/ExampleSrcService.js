'use strict'


/**
 * Servicio de ejemplo.
 * @class
 * @module 
 */

class ExampleSrcService{

  /**
   * @constructs ExampleSrcService
   * @param args
   */
  constructor(){

  }

  /**
  * Función de ejemplo
  * @function
  * @param value - Valor a evaluar.
  * @return Devuelve si el parámetro es un entero o no
  *
  */
  isInteger(value){

    return Number.isInteger(value);

  }

}

export { ExampleSrcService };
