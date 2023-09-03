import type { AdicaoContext } from "@portugol-webstudio/antlr";

import { ExpressãoMatemática } from "./ExpressãoMatemática.js";
import type { Node } from "./Node.js";

export class SomaExpr extends ExpressãoMatemática {
  constructor(
    public ctx: AdicaoContext,
    public children: Node[],
  ) {
    super(ctx, children);
  }
}
