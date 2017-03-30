'use strict';

import { ExampleSrcService } from '../../../src/service/ExampleSrcService';


describe("Jasmine tests of ExampleSrcService", function() {

  var exampleSrcService;

  beforeEach(function() {
    exampleSrcService = new ExampleSrcService();
  });

  it("debería de determinar si el valor del parámetro es un entero o no", function() {
    expect(exampleSrcService.isInteger(1234)).toBe(true);
  });
});
