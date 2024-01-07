import {getModification, Modification} from "./getModifications";
import {get} from "./helper";

export interface Generation {
  id: number;
  name: string;
  yearStart: number;
  yearStop: number;

  modifications: Modification[]
}

export const getGenerations = async (url: string) => {
  // console.log("GET Generations from - ", url);
  const generationArray: Generation[] = [];

  const res = await get(url);

  const state = res.data.match(regex)?.[0];

  if (state) {
    const data = JSON.parse(state);

    const generations = (data?.props?.initialState?.catalog?.generations as any[] || []);

    for (let generation of generations) {
      const generationId = generation.slug;

      generationArray.push({
        id: generation.id,
        name: generation.name,
        yearStart: generation.yearFrom,
        yearStop: generation.yearTo,

        modifications: await getModification(`${url}_${generationId}`)
      })
    }
  }

  return generationArray;
}

const regex = new RegExp("{\"props\".+}", "gm");
