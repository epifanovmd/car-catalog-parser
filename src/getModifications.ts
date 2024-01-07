import {get} from "./helper";
import {Characteristics, getCharacteristics} from "./getCharacteristics";

export interface Modification {
  id: string;
  name: string

  engineType: {id: number, label: string;};
  gearBoxType: {id: number, label: string;};
  driveType: {id: number, label: string;};
  bodyType: {id: number, name: string;};

  characteristics: Characteristics
}

export const getModification = async (url: string) => {
  // console.log("GET Modification from - ", url);
  const modificationArray: Modification[] = [];

  const res = await get(url);

  const state = res.data.match(regex)?.[0];

  if (state) {
    const data = JSON.parse(state);

    const modifications = (data?.props?.initialState?.catalog?.modifications as any[] || []);

    for (let modification of modifications) {
      const modificationId = modification.id;

      modificationArray.push({
        id: modification.id,
        name: modification.name,

        engineType: modification.engineTypeNew,
        gearBoxType: modification.gearboxTypeNew,
        driveType: modification.driveTypeNew,
        bodyType: modification.bodyType,

        characteristics: await getCharacteristics(`${url}_${modificationId}`),
      })
    }
  }

  return modificationArray;
}

const regex = new RegExp("{\"props\".+}", "gm");
