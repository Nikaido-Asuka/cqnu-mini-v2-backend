import http from "@/utils/axiosInstance";


export function getUserList(body: any) {
  return http.request('/user/v1/page', 'POST_JSON', body)
}   