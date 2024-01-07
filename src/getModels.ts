import {Generation, getGenerations} from "./getGenerations";
import {get} from "./helper";

export interface Model {
  id: string;
  name: string
  generations: Generation[];
}

export const getModels = async (url: string) => {
  // console.log("GET Models from - ", url);
  const modelsArray: Model[] = [];

  const res = await get(url);

  const state = res.data.match(regex)?.[0];

  if (state) {
    const data = JSON.parse(state);

    const models = (data?.props?.initialState?.catalog?.models as any[] || []);

    for (let model of models) {
      const modelId = model.slug;

      const generations = await getGenerations(`${url}_${modelId}`);

      modelsArray.push({
        id: model.id,
        name: model.name,

        generations
      })
    }
  }

  return modelsArray;
}

const regex = new RegExp("{\"props\".+}", "gm");
