import { sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "12s", target: 10000 },
    { duration: "36s", target: 10000 },
    { duration: "12s", target: 0 },
  ],
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
      },
    },
  },
};

export default function main() {
  let response;

  response = http.get("http://127.0.0.1:4000/qa/questions/900000");

  // Automatically added sleep
  sleep(1);
}
