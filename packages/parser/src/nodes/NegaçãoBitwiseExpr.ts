import type { NegacaoBitwiseContext } from "@portugol-webstudio/antlr";

import { Expressão } from "./Expressão.js";
import type { Node } from "./Node.js";
import { invariant } from "../helpers/nodes.js";

export class NegaçãoBitwiseExpr extends Expressão {
  expressão: Expressão;

  constructor(
    public ctx: NegacaoBitwiseContext,
    public children: Node[],
  ) {
    super(ctx, children);

    for (const child of children) {
      if (child instanceof Expressão) {
        invariant(!this.expressão, child.ctx, "Expressão já definida");
        this.expressão = child;
      } else {
        this.unexpectedChild(child);
      }
    }

    invariant(this.expressão, ctx, "Expressão não definida");
  }
}
