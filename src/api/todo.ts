import http from '@/store/http'


export function getTodoList(body: any){
    return http.request('/note/admin/v1/page/note', 'POST_JSON', body)
}


export function removeTodoById(id: any) {
    return http.request('/note/v1/del', null, {
      params: {
        id: id
      }
    });
}

export function updateTodo(body: any){
    return http.request('/note/v1/updateNote', 'POST_JSON', body)
}


  