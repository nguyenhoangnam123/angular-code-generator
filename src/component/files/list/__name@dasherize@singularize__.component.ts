import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, merge, BehaviorSubject } from 'rxjs';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { LayoutUtilsService, MessageType, StringRegexUtilsService } from 'app/core/_base/crud';
import { <%= classify(name) %>Service } from './<%= singularize(name) %>.service';
import { <%= classify(name) %>DataSource } from './<%= singularize(name) %>.data-source';
import { QueryParamsModelEGP } from 'app/core/_base/crud/models/query-models/query-params.model';
import { tap } from 'rxjs/operators';
import { I<%= classify(name) %>, <%= classify(name) %> } from './<%= singularize(name) %>.model';
import { <%= classify(name) %>EditComponent } from './<%= singularize(name) %>-edit/<%= singularize(name) %>-edit.component';
import { <%= classify(name) %>DetailComponent } from './<%= singularize(name) %>-detail/<%= singularize(name) %>-detail.component';
import { DeleteBase } from 'app/core/_base/crud/models/eGP-models/_baseDelete.model';

@Component({
  selector: 'jhi-<%= singularize(name) %>',
  templateUrl: './<%= singularize(name) %>.component.html'
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {
  form: FormGroup;
  dataSource: <%= classify(name) %>DataSource;
  filterFields: Observable<any[]>;
  filterFields$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  ids: number[] = [];
  dialogConfig: MatDialogConfig;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [];
  validationMessage = {
    <% Object.keys(JSON.parse(obj)).forEach(key => { %>
      <% if (JSON.parse(obj)[key]['display'] === true && key !== 'stt' && JSON.parse(obj)[key]['isPrimitive'] === true) { %>
          <%= key %>: [
            <% if(JSON.parse(obj)[key]['validate']) { %>
                <% Object.keys(JSON.parse(obj)[key]['validate']).forEach(subkey => { %>
                  {
                  type: '<%= JSON.parse(obj)[key]['validate'][subkey]['type'] %>', message: '<%= JSON.parse(obj)[key]['validate'][subkey]['message'] %>',
                  },
                  <% }) %>
          <% } %>
        ],
      <% } %>
    <% }) %>
  };
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   *
   * @param _service: <%= classify(name) %>Service
   * @param _fb: FormBuilder
   * @param _layoutService: LayoutUtilsService
   * @param _dialog: MatDialog
   * @param cdr: ChangeDetectorRef
   * @param _regexutils: StringRegexUtilsService
   */
  constructor(
    private _service: <%= classify(name) %>Service,
    private _fb: FormBuilder,
    private _layoutService: LayoutUtilsService,
    private cdr: ChangeDetectorRef,
    private _regexutils: StringRegexUtilsService,
    public _dialog: MatDialog
  ) {
    <% Object.keys(JSON.parse(obj)).forEach(key => { %>
      <% if (JSON.parse(obj)[key]['display'] === true && JSON.parse(obj)[key]['isPrimitive'] === true) { %>
        this.displayedColumns.push('<%= key %>');
      <% } %>
    <% }) %>
    this.displayedColumns.push('actions');
  }

  /**
   * ngOnInit
   * initialize datasource
   */
  ngOnInit(): void {
    this.dataSource = new <%= classify(name) %>DataSource(this._service);
    // Firstload getPaging by default QueryParamsModelEGP
    this.getPaging(true);
    // Initialize form      
    this.createForm();
    // Subcribe sort and paging action wil cause reload getPaging
    const sortAndPagingSubcription = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.getPaging(false);
        })
      )
      .subscribe();
    // Subcribe for lastest filterFields, assign filterFields to lastest value from search Item
    const filterFieldsSubscription = this.filterFields$.subscribe(res => (this.filterFields = res));
    // mat dialog config
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.minWidth = 600;
    // Push all Subscription to Subscription list to avoid memory leak
    this.subscriptions.push(sortAndPagingSubcription);
    this.subscriptions.push(filterFieldsSubscription);
  }

  /**
   * ngOnDestroy
   * unSubcribe all subcriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  /**
   * getPaging when firstload, paging, sorting, create, update or delete successfully
   *
   * @param _firstload: boolean, default false
   */
  getPaging(_firstload: boolean = false): void {
    const queryParams = new QueryParamsModelEGP(
      this.filterFields,
      this.paginator.pageIndex,
      this.sort.active, // Map with orderProperty
      this.sort.direction === 'asc' ? true : false, // Map with asc
      _firstload ? 1 : this.paginator.pageSize
    );
    this.dataSource.getPaging(queryParams);
  }

  /**
   * createForm
   *
   */
  createForm(): void {
    this.form = this._fb.group({
      <% Object.keys(JSON.parse(obj)).forEach(key => { %>
        <% if (JSON.parse(obj)[key]['display'] === true && key !== 'stt' && JSON.parse(obj)[key]['isPrimitive'] === true) { %>
            <%= key %>: ['', [
              <% if(JSON.parse(obj)[key]['validate']) {%>
              <% Object.keys(JSON.parse(obj)[key]['validate']).forEach(subkey => { %>
                <% if(JSON.parse(obj)[key]['validate'][subkey]['type'] === 'minLength' || JSON.parse(obj)[key]['validate'][subkey]['type'] === 'maxLength' ) { %>
                  Validators.<%= JSON.parse(obj)[key]['validate'][subkey]['type'] %>(<%= JSON.parse(obj)[key]['validate'][subkey]['value'] %>),
                <% } else { %>
                  Validators.<%= JSON.parse(obj)[key]['validate'][subkey]['type'] %>('<%= JSON.parse(obj)[key]['validate'][subkey]['value'] %>'),
                <% } %>
              <% }) %>
            <% } %>
          ]],
        <% } %>
      <% }) %>
    });
  }

  /**
   * onCancel, reset form, reset filterFields
   *
   */
  onCancel(): void {
    this.form.reset();
    this.filterFields$.next({});
    this.getPaging(false);
  }

  /**
   * search
   *
   * @param _formValue: any
   */
  search(_formValue: any) {
    console.log('form value: ', _formValue);
    const searchObj = this.prepareSearchObject(_formValue);
    // Emit new filterFields values
    this.filterFields$.next(searchObj.filterFields);
    // load item by new filterFields
    this.getPaging(false);
  }

  /**
   * Prepare search obj
   *
   * @param _formValue: any
   */
  prepareSearchObject(_formValue): QueryParamsModelEGP {
    const { 
      <% Object.keys(JSON.parse(obj)).forEach(key => { %>
        <% if (JSON.parse(obj)[key]['display'] === true && key !== 'stt' && JSON.parse(obj)[key]['isPrimitive'] === true) { %>
            <%= key %>,
        <% } %>
      <% }) %>
     } = _formValue;
    const filterFields: any = {<% Object.keys(JSON.parse(obj)).forEach(key => { %>
      <% if (JSON.parse(obj)[key]['display'] === true && key !== 'stt' && JSON.parse(obj)[key]['isPrimitive'] === true) { %>
          <%= key %>,
      <% } %>
    <% }) %>};
    const searchObject = new QueryParamsModelEGP(filterFields, this.paginator.pageIndex, 'Id', false, this.paginator.pageSize);
    return searchObject;
  }

  /**
   * create
   *
   */
  create(): void {
    const <%= singularize(name) %> = new <%= classify(name) %>();
    <%= singularize(name) %>.clear();
    this.edit(<%= singularize(name) %>);
  }

  /**
   * view
   *
   * @param <%= singularize(name) %>: I<%= classify(name) %>
   */
  view(_<%= singularize(name) %>: I<%= classify(name) %>): void {
    const title = 'Xem chi tiết';
    this.dialogConfig.minWidth = 900;
    this.dialogConfig.data = {
      id: _<%= singularize(name) %>.id,
      title
    };
    // open dialog
    const dialogRef = this._dialog.open(<%= classify(name) %>DetailComponent, this.dialogConfig);
    const closeSubcription = dialogRef.afterClosed().subscribe(res => {});
    this.subscriptions.push(closeSubcription);
  }

  /**
   * edit
   *
   * @param <%= singularize(name) %>: I<%= classify(name) %>
   */
  edit(_<%= singularize(name) %>: I<%= classify(name) %>): void {
    const title = _<%= singularize(name) %>.id > 0 ? 'Cập nhật thông tin' : 'Thêm mới';
    this.dialogConfig.data = {
      id: _<%= singularize(name) %>.id,
      title
    };
    // open dialog
    const dialogRef = this._dialog.open(<%= classify(name) %>EditComponent, this.dialogConfig);
    // after close dialog
    this._crudService.closeDialogListenter(dialogRef, _<%= singularize(name) %>, 'edit', () => location.reload());
  }

  /**
   * delete
   *
   * @param <%= singularize(name) %>: I<%= classify(name) %>
   */
  deleteItem(_<%= singularize(name) %>: I<%= classify(name) %>): void {
    const _title = `Xoá`;
    const _description = 'Bạn có chắc chắn muốn xoá';
    const _waitDesciption = `Đang xoá`;
    const _deleteMessage = `Đã xoá`;

    this.ids = new Array<number>();
    this.ids.push(_<%= singularize(name) %>.id);
    const deleteItem = new DeleteBase(this.ids, 'admin');
    const dialogRef = this._layoutService.deleteElement(_title, _description, _waitDesciption);
    // after close dialog
    this._crudService.closeDialogListenter(dialogRef, _<%= singularize(name) %>, 'confirm', () => this.dataSource.delete(deleteItem));
    this._crudService.crudListener(() => {
      this._layoutService.showActionNotification(_deleteMessage, MessageType.Delete);
      setTimeout(() => location.reload(), 1000);
    });
  }
}
