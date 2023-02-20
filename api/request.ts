const baseUrl = process.env?.NUXT_PUBLIC_API_BASE || "https://api.zngg.net";
console.log("baseUrl:***** ", baseUrl);

const errorResponse: ApiResponse = {
  success: false,
  code: 0,
  message: "",
  data: null,
};

function isPHPApi(url: string) {
  if (url.includes("/php/")) return true;
  return false;
}

const get = async (url: string, params = {}): Promise<ApiResponse> => {
  try {
    const token = useCookie("token");
    url = isPHPApi(url) ? url.replace("/php", "") : url;
    const res = await $fetch<ApiResponse>(baseUrl + url, {
      headers: {
        "user-token": token.value,
      },
      method: "GET",
      params: params,
    });
    return res;
  } catch (error) {
    errorResponse.message = error as string;
    return errorResponse;
  }
};

const post = async (url: string, params = {}): Promise<ApiResponse> => {
  try {
    const token = useCookie("token");
    url = isPHPApi(url) ? url.replace("/php", "") : url;
    const res = await $fetch<ApiResponse>(baseUrl + url, {
      headers: {
        // "Accept": "application/json, text/plain, */*",
        // "Content-Type": "application/json",
        "user-token": token.value,
      },
      method: "POST",
      body: params,
    });
    return res;
  } catch (error) {
    errorResponse.message = error as string;
    return errorResponse;
  }
};

// const put = async (url: string, params = {}): Promise<ApiResponse> => {
//     try {
//         const token = useCookie('token');
//         const res = await $fetch<ApiResponse>(baseUrl + url, {
//             headers: {
//                 // "Accept": "application/json, text/plain, */*",
//                 // "Content-Type": "application/json",
//                 "user-token": token.value,
//             },
//             method: 'PUT',
//             body: params,
//         });
//         return res;
//     } catch (error) {
//         errorResponse.message = error;
//         return errorResponse;
//     }
// };

export default { get, post };
