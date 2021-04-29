import { Context } from "@miqro/core";
import { ParseOptions, APIRoute } from "../../src";

const ITEM: ParseOptions = {
  options: {
    id: "number"
  },
  mode: "remove_extra"
};

const ITEM_LIST: ParseOptions = {
  options: {
    items: {
      type: "array",
      required: true,
      arrayType: "nested",
      nestedOptions: { options: ITEM.options, mode: "remove_extra" }
    }
  },
  mode: "remove_extra"
};

const route: APIRoute = {
  path: "/",
  query: {
    options: {
      type: {
        required: true,
        type: "enum",
        enumValues: ["list", "item", "bad"]
      }
    },
    mode: "no_extra"
  },
  body: false,
  results: [ITEM, ITEM_LIST],
  handler: async (ctx: Context) => {
    if(ctx.query.type === "bad") {
      return {
        badresult: "bad"
      }
    }
    const item1 = {
      id: 1
    };
    const item2 = {
      id: 2
    };
    return ctx.query.type === "list" ? { items: [item1, item2] } : item1
  }
};


export default route;
