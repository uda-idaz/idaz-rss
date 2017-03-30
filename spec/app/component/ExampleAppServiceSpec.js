'use strict';

import { ExampleAppService } from '../../../app/component/ExampleAppService';


describe("Tests de jasmine del módulo ExampleAppService", function() {

  let exampleAppService, body, span;
  const spanId = "spanTest1";

  beforeAll(function() {
    exampleAppService = new ExampleAppService();
    body = document.getElementsByTagName("body")[0];
    span = document.createElement("SPAN");
    span.id = spanId;

    body.appendChild(span);
  });

  it("debería de asignar el valor a un elemento del DOM", function() {
    var text = "Texto de prueba";
    exampleAppService.setText("spanTest1", text);
    expect(document.getElementById(spanId).innerHTML).toBe(text);
  });
});
