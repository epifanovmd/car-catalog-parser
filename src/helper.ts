import axios, {AxiosResponse} from "axios";

export const skippedUrls = [];

export const getBaseUrl = () => {
  return "https://av.by"
}

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
  },
  // proxy: {
  //   host: "185.130.105.109",
  //   port: 10000,
  //   protocol: "http",
  //   auth: {
  //     username: "a45f8551a87e61f6",
  //     password: "RNW78Fm5"
  //   }
  // }
});

export const get = (url: string) => {
  return new Promise<AxiosResponse>(async resolve => {
    const startReq = async () => {
      // console.log("Start request - ", url);
      try {
        const res = await axiosInstance.get(url);
        // console.log("status - ", res.status);

        if (res.status === 200) {
          resolve(res);
        } else {
          if (res.status === 429) {
            await delayPromise();
            startReq().then();
          } else {
            skippedUrls.push(url);
            resolve({...res, data: ""});
          }
        }
      } catch (e) {
        console.log(`ERROR url - ${url}, message - ${e.message}`);
        skippedUrls.push(url);
        resolve({data: "", status: 500} as any);
      }
    }

    startReq().then();
  })
}

export const delayPromise = (delay: number = 5000) => new Promise(resolve => {
  console.log(`Delay ${delay} ms`);
  setTimeout(() => {
    resolve(null);
  }, delay);
});


