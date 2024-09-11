import http from "@/utils/axiosInstance";


export function Login(body: any){
  return http.request('/user/admin/v1/login', 'POST_JSON', body);
}
