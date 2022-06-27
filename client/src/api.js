import { getWithExpiry,LLAMA_MEET_API_URL } from "./utils/constants";

export async function apiRequest(path, method = "GET", jwtNeeded = true, data) {
  let jwt = "";
  if (jwtNeeded) jwt = getWithExpiry("jwt");
  let response;
  try {
    response = await fetch(path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "x-authorization": jwt,
      },
      body:
        method === "GET" ? undefined : data ? JSON.stringify(data) : undefined,
    });
    const responseJson = await response.json();

    if (+response.status >= 200 && +response.status <= 300) return responseJson;
    else throw new Error(responseJson.message || "Oops! Something went wrong");
  } catch (error) {
    throw new Error(error.message || "Oops! Something went wrong");
  }
}

export const createSessionAPI = async ({ toAddress, perHourCost, peerId }) => {
  try {
    const response = await apiRequest(
      `${LLAMA_MEET_API_URL}/api/v0/session`,
      "POST",
      false,
      {
        toAddress,
        perHourCost,
        peerId,
      }
    );
    return response;
  } catch (e) {
    throw e;
  }
};
