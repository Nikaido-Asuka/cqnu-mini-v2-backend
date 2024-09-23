import http from '@/store/http'


export function getTodoList(body: any){
    return http.request('/note/admin/v1/page/note', 'POST_JSON', body)
}


export function removeTodoById(id: any) {
    return http.post('/note/v1/del', null, {
      params: {
        id: id
      }
    });
}

export function updateTodo(body: any){
    return http.request('/note/v1/updateNote', 'POST_JSON', body)
}

export function getTodoTagList(body: any){
    return http.request('/note/admin/v1/page/tag', 'GET', body);
}

export function updateTodoTag(body: any){
    return http.request('/note/tag/v1/updateTag', 'POST_JSON', body);
}


export function addTodoTag(tagName: string){
    return http.post('/note/tag/v1/addTag', null, {
      params: {
        tagName: tagName,
      }
    })
}

export function removeTodoTagById(id: number) {
    return http.delete('/note/admin/v1/del/tag', {
      params: {
        id,
      }
    })
}
  