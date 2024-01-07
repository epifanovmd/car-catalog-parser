import fs from "fs/promises"

import {getMarks} from "./src/getMarks";
import {skippedUrls} from "./src/helper";
import * as console from "console";

(async () => {
  console.time('Parse catalog')
  const marks = await getMarks("/catalog");

  await fs.writeFile("./result.json", JSON.stringify(marks));

  console.log("skippedUrls = ", JSON.stringify(skippedUrls));
  console.timeEnd('Parse catalog')
})()
