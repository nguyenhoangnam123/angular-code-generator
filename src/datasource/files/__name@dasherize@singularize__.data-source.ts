import { BaseDataSource } from 'app/core/_base/crud';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { <%= classify(singularize(name)) %>Service } from './<%= singularize(name) %>.service';
import { tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { IQueryResultsModelEGP } from 'app/core/_base/crud/models/query-models/query-results.model';
import { QueryParamsModelEGP } from 'app/core/_base/crud/models/query-models/query-params.model';
import { IObjectRequest } from 'app/core/_base/crud/models/eGP-models/_baseDelete.model';
import { I<%= classify(name) %> } from './<%= singularize(name) %>.model';

// Return HttpResponse, with type of body is IQueryResultsModelEGP as object contain type IUser
type IEntity = I<%= classify(name) %>;
type Result = HttpResponse<IQueryResultsModelEGP<IEntity>>;
export class <%= classify(name) %>DataSource extends BaseDataSource {
  // Loading | Progress bar
  loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;
  // Paginator | Paginators count
  paginatorTotalSubject$ = new BehaviorSubject<number>(0);
  paginatorTotal$: Observable<number>;
  // Need to show message: 'No records found
  hasItems = false;
  // emit true when update or create Successfully
  _<%= singularize(name) %>$: Subject<IEntity>;

  /**
   * Data-Source Constructor
   *
   * @param _service: UserService
   */
  constructor(private _service: <%= classify(name) %>Service) {
    super();
    this._<%= singularize(name) %>$ = new Subject<IEntity>();
    this.loading$ = this.loadingSubject$.asObservable();
    this.paginatorTotal$ = this.paginatorTotalSubject$.asObservable();
    this.paginatorTotal$.subscribe(res => (this.hasItems = res > 0));
  }

  /**
   * get <%= singularize(name) %> Observable
   *
   */
  get <%= singularize(name) %>$(): Subject<IEntity> {
    return this._<%= singularize(name) %>$;
  }

  /**
   * getAll
   *
   */
  getAll(): void {
    this.loadingSubject$.next(true);
    this._service
      .getAll()
      .pipe(
        tap(res => {
          if (!res) {
            return;
          }
          const { status, body } = res;
          if (status === 200) {
            // this.entitySubject.next(body);
            this.loadingSubject$.next(false);
            this.paginatorTotalSubject$.next(body.length);
          }
        })
      )
      .subscribe();
  }

  /**
   * getById
   *
   * @params _id: number
   */
  findById(_id: number): void {
    this.loadingSubject$.next(true);
    this._service
      .findById(_id)
      .pipe(
        tap(res => {
          if (!res) {
            return;
          }
          const { status, body } = res;
          if (status === 200) {
            this._<%= singularize(name) %>$.next(body);
            this.loadingSubject$.next(false);
          }
        })
      )
      .subscribe();
  }

  /**
   * createOrUpdate
   *
   * @param _item: I<%= classify(name) %>
   */
  createOrUpdate(_item: I<%= classify(name) %>): void {
    this.loadingSubject$.next(true);
    this._service
      .createOrUpdate(_item)
      .pipe(
        tap(res => {
          if (!res) {
            return;
          }
          const { status, body } = res;
          if (status === 200) {
            this.loadingSubject$.next(false);
            this._createOrUpdateSuccess$.next(true);
          }
        })
      )
      .subscribe();
  }

  /**
   * delete
   *
   * @param _item: IObjectRequest
   */
  delete(_item: IObjectRequest): void {
    this.loadingSubject$.next(true);
    this._service
      .delete(_item)
      .pipe(
        tap(res => {
          if (!res) {
            return;
          }
          const { error } = res;
          if (!error) {
            this.loadingSubject$.next(false);
            this._deleteSuccess$.next(true);
          }
        })
      )
      .subscribe();
  }

  /**
   * getPaging
   *
   * @param _params: QueryParamsModelEGP(filterField, currentPage, orderProperty, asc, pageSize)
   */
  getPaging(_params: QueryParamsModelEGP): void {
    this.loadingSubject$.next(true);
    this._service
      .getPaging(_params)
      .pipe(
        tap(res => {
          console.log('Response status: ', res.status);
          if (!res) {
            return;
          }
          const { status, body } = res;
          if (status === 200) {
            this.entitySubject.next(body.data);
            this.loadingSubject$.next(false);
            this.paginatorTotalSubject$.next(body.total);
          }
        })
      )
      .subscribe();
  }
}
