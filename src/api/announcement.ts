import http from '@/store/http'

export function getAnnouncementList(query: any){
    return http.get('/user/v1/announcement/page', {
        params: {
            current: query.current,
            size: query.size,
            severity: query.severity ? query.severity : 'high',
        }
    });
}

export function addAnnouncment(body: any){
    return http.request('/user/v1/announcement', 'POST_JSON', body)
}