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

            `${mark.id}${model.id}`,
            model.name,

            `${mark.id}${model.id}${generation.id}`,
            generation.name,
            generation.yearStart,
            generation.yearStop,

            modification.bodyType.id,
            modification.bodyType.name,

            modification.engineType.id,
            modification.engineType.label,

            modification.driveType.id,
            modification.driveType.label.replace("привод", "").trim(),

            modification.gearBoxType.id,
            modification.gearBoxType.label,

            `${mark.id}${model.id}${modification.id}`,
            modification.name,

            ...characteristic_keys.map(key => {
              if (key === 'enginePower' || key === 'maxSpeed' || key === "acceleration0100KmH" ||
                key === "curbWeight" || key === "fuelTankCapacity" || key === "maxTrunkCapacity" || key === "minTrunkCapacity" ||
              key === "cylinderBore" || key === "strokeCycle" || key === "cityDrivingFuelConsumptionPer100Km" || key === "highwayDrivingFuelConsumptionPer100Km") {
                const digits = modification.characteristics[key]?.match(/[0-9]+\.?[0-9]+/);
                if (!digits) {
                  return '';
                }

                return digits[0];
              }

              if (key === "fuel") {
                return modification.characteristics[key]?.replace(" ", "")
                  .replace("дизельное топливо", "ДТ")
                  .replace("Газ (Бензин)", "Бензин, Газ")
                  .replace("бензин", "Бензин")
              }

              return modification.characteristics[key]?.replace(" ", "")
            })
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

const t = "Газ (Бензин)";
const r = "Газ (Бензин) ";
