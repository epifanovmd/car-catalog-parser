import {get} from "./helper";

interface ModelParent {
  id: number;
  name: string;
  slug: string;
}

interface Model {
  id: number;
  parent: ModelParent,
  name: string;
  slug: string;
}

interface Generation {
  id: number;
  model: Model,
  name: string;
  slug: string;
}

interface File {
  url: string;
  mimeType: string;
  id: number;
}

interface Photo {
  file: File,
  isMain: true,
  createdAt: string;
}

export interface Characteristics {
  id: number;
  engineType: string;
  bodyType: string;
  gearBoxType: string;
  driveType: string;
  engineCapacity: string;
  enginePower: string;
  photos: Photo[],
  generation: Generation,
  name: string;
  numberOfSeats: string;
  length: string;
  width: string;
  height: string;
  wheelbase: string;
  frontTrack: string;
  rearTrack: string;
  maxPowerAtRpm: string;
  maximumTorque: string;
  injectionType: string;
  cylinderLayout: string;
  numberOfCylinders: string;
  fuel: string;
  numberOfGear: string;
  frontBrakes: string;
  rearBrakes: string;
  maxSpeed: string;
  acceleration0100KmH: string;
  curbWeight: string;
  fuelTankCapacity: string;
  valvesPerCylinder: string;
  frontSuspension: string;
  backSuspension: string;
  maxTrunkCapacity: string;
  minTrunkCapacity: string;
  cylinderBore: string;
  strokeCycle: string;
  cityDrivingFuelConsumptionPer100Km: string;
  highwayDrivingFuelConsumptionPer100Km: string;
  cruisingRange: string;
  turnoverOfMaximumTorque: string;
}

export const getCharacteristics = async (url: string): Promise<Characteristics> => {
  // console.log("GET Characteristics from - ", url);

  const res = await get(url);

  const state = res.data.match(regex)?.[0];

  if (state) {
    const data = JSON.parse(state);

    return data?.props?.initialState?.catalog?.modificationCard;
  }

  return {} as Characteristics
}

const regex = new RegExp("{\"props\".+}", "gm");

