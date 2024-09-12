import http from '@/store/http'


export function upLoadFile(body: any){
    return http.request('/oss/v1/images/upload', 'POST_JSON', body)
}