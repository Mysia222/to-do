import { Injectable } from '@angular/core'

import { Todo } from "./todo"

import { Http, RequestOptions, Headers } from "@angular/http"
import 'rxjs/add/operator/toPromise' 

@Injectable()
export class TodoService {
    todos: Todo[] = [];
    private apiUrl = 'api/todos'

    constructor(private http: Http) {


    }

    getTodos(): Promise<Todo[]> {
        return this.http.get(this.apiUrl) //возвращает новый объект
                        .toPromise() //возвращает общание
                        .then(res => res.json().data)
                        .then(todos => this.todos = todos)
                        .catch(this.handleError);
    }

    createTodo(title: string) {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({ headers });
        let todo = new Todo(title);
        this.http.post(this.apiUrl, todo, options)
                 .toPromise()
                 .then(res => res.json().data)
                 .then(todo => this.todos.push(todo))
                 .catch(this.handleError);

    }

    deleteTodo(todo: Todo) {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({ headers });
        let url = `${this.apiUrl}/${todo.id}`;

        this.http.delete(url, options)
                 .toPromise()
                 .then(res => {
                    let index=this.todos.indexOf(todo);
                    if(index>-1) {
                        this.todos.splice(index, 1);
                    }
                 })
                 .catch(this.handleError);
        
    }

    toggleTodo(todo: Todo) {
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({ headers });
        let url = `${this.apiUrl}/${todo.id}`;

        this.http.put(url, todo, options)
                 .toPromise()
                 .then(res => {
                    todo.completed = !todo.completed;
                 })
                 .catch(this.handleError);

    }
    private handleError(error: any) {
        console.error("Error", error);
        return Promise.reject(error.message || error)
    }

}