import json from "./result.json";
import {Marks} from "./src/getMarks";
import fs from "fs/promises";

import * as CSV from 'csv-string';

const characteristic_keys = [
  "engineType",
  "bodyType",
  "gearBoxType",
  "driveType",
  "engineCapacity",
  "enginePower",
  "name",
  "numberOfSeats",
  "length",
  "width",
  "height",
  "wheelbase",
  "frontTrack",
  "rearTrack",
  "maxPowerAtRpm",
  "maximumTorque",
  "injectionType",
  "cylinderLayout",
  "numberOfCylinders",
  "fuel",
  "numberOfGear",
  "frontBrakes",
  "rearBrakes",
  "maxSpeed",
  "acceleration0100KmH",
  "curbWeight",
  "fuelTankCapacity",
  "valvesPerCylinder",
  "frontSuspension",
  "backSuspension",
  "maxTrunkCapacity",
  "minTrunkCapacity",
  "cylinderBore",
  "strokeCycle",
  "cityDrivingFuelConsumptionPer100Km",
  "highwayDrivingFuelConsumptionPer100Km",
  "cruisingRange",
  "turnoverOfMaximumTorque",
]

const marks: Marks[] = json as Marks[];

(async () => {
  await fs.writeFile('./base.csv', ``);

  marks.sort((a, b) => sorter(a.name, b.name)).forEach((mark) => {
    mark.models.forEach((model) => {
      model.generations.forEach(generation => {
        generation.modifications.forEach(modification => {
          const row = [
            mark.id,
            mark.name,
            mark.isPopular,

            `${mark.id}_${model.id}`,
            model.name,

            `${mark.id}_${model.id}_${generation.id}`,
            generation.name,
            generation.yearStart,
            generation.yearStop,

            modification.bodyType.id,
            modification.bodyType.name,

            modification.engineType.id,
            modification.engineType.label,

            modification.driveType.id,
            modification.driveType.label,

            modification.gearBoxType.id,
            modification.gearBoxType.label,

            `${mark.id}_${model.id}_${generation.id}_${modification.id}`,
            modification.name,

            ...characteristic_keys.map(key => modification.characteristics[key])
          ];

          fs.appendFile('./base.csv', CSV.stringify(row));
        })
      })
    })
  });
})();

const sorter = (function (a, b) {
  const nameA = a.toLowerCase();
  const nameB = b.toLowerCase();

  if (nameA < nameB)
    return -1;
  if (nameA > nameB)
    return 1;
  return 0;
})
