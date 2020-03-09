import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// Api prefix
import { SERVER_API_URL } from 'app/app.constants';
// Model
import { IObjectRequest, DeleteBase } from 'app/core/_base/crud/models/eGP-models/_baseDelete.model';
import { IQueryResultsModelEGP } from 'app/core/_base/crud/models/query-models/query-results.model';
import { QueryParamsModelEGP } from 'app/core/_base/crud/models/query-models/query-params.model';
import { I<%= classify(name) %> } from './<%= camelize(name) %>.model';

@Injectable({
    providedIn: 'root'
})
type IEntity = I<%= classify(name) %>;
type IResult = IQueryResultsModelEGP<IEntity>;
export class <%= classify(name) %>Service {
  /**
   * Service Constructor
   *
   * @param http: HttpClient
   * 
   */
  constructor(private http: HttpClient) {}

  /**
   * GetAll
   * Put template name to return type
   */
  getAll(): Observable<HttpResponse<IEntity[]>> {
    const API = SERVER_API_URL + 'services/uaa/api/<%= camelize(name) %>/getAll'; // Put template name here
    return this.http.get<IEntity[]>(API, {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    });
  }

  /**
   * FindById
   * Put template name to return type
   */
  findById(id: number): Observable<HttpResponse<IEntity>> {
    const API = SERVER_API_URL + `services/uaa/api/<%= camelize(name) %>/${id}`; // Put template name here
    return this.http.get<IEntity>(API, {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    });
  }

  /**
   * Delete
   * Put template in Observable
   */
  delete(item: IObjectRequest): Observable<IQueryResultsModelEGP<IEntity>> {
    const API = SERVER_API_URL + `services/uaa/api/<%= camelize(name) %>`; // Put template name here
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: item
    };
    return this.http.delete<IQueryResultsModelEGP<IEntity>>(API, options);
  }

  /**
   * CreateOrUpdate
   * Put template in Observable
   */
  createOrUpdate(item: IEntity): Observable<HttpResponse<IEntity>> {
    const API = SERVER_API_URL + `services/uaa/api/<%= camelize(name) %>/addOrEdit`; // Put template name here
    return this.http.post<IEntity>(API, item, {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    });
  }

  /**
   * LoadItemsByFilter
   * Put template in Observable
   *
   * @param _params: QueryParamsModelEGP
   */
  getPaging(_params: QueryParamsModelEGP): Observable<HttpResponse<IResult>> {
    const API = SERVER_API_URL + 'services/uaa/api/<%= camelize(name) %>/getPaging'; // Put template name here
    return this.http.post<IResult>(API, _params, {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    });
  }
}