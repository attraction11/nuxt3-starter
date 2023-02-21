import { ElMessage } from "element-plus";

const errorResponse: ApiResponse = {
  success: false,
  code: 0,
  message: "",
  data: null,
};

function getBaseURL(url: string) {
  if (url.includes("/wp-admin/")) {
    return "";
  }
  // return "http://120.48.56.30:8060";
  return "https://api.zhiming-inc.com";
}

const get = async (
  url: string,
  params = {},
  newToken?: string
): Promise<ApiResponse> => {
  try {
    const token = useCookie("user-token");
    let res = await $fetch<ApiResponse>(url, {
      headers: {
        // cookie赋值为异步，这里采用传参的token
        "user-token": newToken || token.value,
      },
      baseURL: getBaseURL(url),
      method: "GET",
      retry: false,
      params: params,
    });

    if (url.includes("/wp-admin/")) {
      res = JSON.parse(res);
    }

    if (res.code !== 200 && res.code !== 401) {
      ElMessage.error(res.message);
    }
    return res;
  } catch (error) {
    errorResponse.message = error as string;
    return errorResponse;
  }
};

const post = async (url: string, data = {}): Promise<ApiResponse> => {
  try {
    const token = useCookie("user-token");
    let res = await $fetch<ApiResponse>(url, {
      headers: {
        "user-token": token.value,
      },
      baseURL: getBaseURL(url),
      method: "POST",
      retry: false,
      body: data,
    });

    if (url.includes("/wp-admin/")) {
      res = JSON.parse(res);
    }

    if (res.code !== 200 && res.code !== 401) {
      ElMessage.error(res.message);
    }
    return res;
  } catch (error) {
    errorResponse.message = error as string;
    return errorResponse;
  }
};

export default { get, post };
