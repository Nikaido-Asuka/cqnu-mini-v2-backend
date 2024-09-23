import http from '@/store/http'

export function getDishTagList(body: any){
    return http.request('/business/review/admin/v1/page/tag', 'POST_JSON', body);
}

export function addDishTag(body: any){
    return http.request('/business/review/v1/add-dishTag', 'POST_JSON', body);
}

export function updateDishTag(body: any){
    return http.request('/business/review/v1/update-dishTag', 'POST_JSON', body);
}

export function removeDishTagById(id: number){
    return http.delete('/business/review/v1/del-dishTag', {
        params: {
            id
        }
    });
}