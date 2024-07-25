import { ExpressaoEntreParentesesContext } from "@portugol-webstudio/antlr";

import { invariant } from "../helpers/nodes.js";
import { Expressão } from "./Expressão.js";
import { Node } from "./Node.js";

export class ExpressãoEntreParênteses extends Expressão<ExpressaoEntreParentesesContext> {
  expressão!: Expressão;

  addChild(child: Node) {
    if (child instanceof Expressão) {
      invariant(!this.expressão, child.ctx, "Expressão já definida");
      this.expressão = child;
    } else {
      this.unexpectedChild(child);
    }

    this.children.push(child);
  }
}
