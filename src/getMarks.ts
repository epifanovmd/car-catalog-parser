import {getModels, Model} from "./getModels";
import {get, getBaseUrl} from "./helper";
import fs from "fs/promises";

export interface Marks {
  id: number;
  isPopular: boolean;
  name: string

  models: Model[]
}

export const getMarks = async (url: string) => {
  const marksArray: Marks[] = [];
  // console.log("GET Marks from - ", url);

  const res = await get(url);

  const state = res.data.match(regex)?.[0];

  if (state) {
    const data = JSON.parse(state);

    const marks = (data?.props?.initialState?.catalog?.brands as any[] || []);

    await Promise.all(marks.map(async mark =>  {
      const markId = mark.slug;

      const models = await getModels(`/catalog/${markId}`);

      const markResult = {
        id: mark.id,
        isPopular: mark.isPopularOnDevice,
        name: mark.name,

        models
      };

      await fs.writeFile(`./marks/${mark.name.replaceAll(" ", "_")}.json`, JSON.stringify(markResult));

      marksArray.push(markResult)
    }));
  }

  return marksArray.sort((a, b) => {
    if (a.isPopular && !b.isPopular) {
      return -1;
    }
    if (!a.isPopular && b.isPopular) {
      return 1;
    }

    return 0;
  });
}

const regex = new RegExp("{\"props\".+}", "gm");
