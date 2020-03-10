import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { <%= classify(name) %>Service } from '../../<%= singularize(name) %>/<%= singularize(name) %>.service';
import { I<%= classify(name) %>, <%= classify(name) %> } from '../../<%= singularize(name) %>/<%= singularize(name) %>.model';
import { Subscription, Observable, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { AppState } from 'app/core/reducers';
import { tap, concatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { <%= classify(name) %>DataSource } from '../../<%= singularize(name) %>/<%= singularize(name) %>.data-source';
import { StringRegexUtilsService } from 'app/core/_base/crud';

type IEntity = I<%= classify(name) %>;
@Component({
  selector: 'jhi-<%= singularize(name) %>-edit',
  templateUrl: './<%= singularize(name) %>-edit.component.html'
})
export class <%= classify(name) %>EditComponent {

  dataSource: <%= classify(name) %>DataSource;
  title: string;
  <%= singularize(name) %>: IEntity;
  <%= singularize(name) %>$: Observable<HttpResponse<IEntity>>;
  form: FormGroup;
  hasFormErrors = false;
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
   * Component constructor
   *
   * @param dialogRef: MatDialogRef<<%= classify(name) %>EditDialogComponent>
   * @param data: any, default,
   * @param fb: FormBuilder,
   * @param  _service: <%= classify(name) %>Service,
   * @param store: Store<AppState>
   */
  constructor(
    public dialogRef: MatDialogRef<<%= classify(name) %>EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _service: <%= classify(name) %>Service,
    private _regexutils: StringRegexUtilsService,
    private store: Store<AppState>
  ) {}

  /**
   * ngOnInit
   * initialize datasource
   */
  ngOnInit() {
    this.dataSource = new <%= classify(name) %>DataSource(this._service);
    // Check data Id
    if (this.data.id) {
      this.<%= singularize(name) %>$ = this._service.findById(this.data.id);
    } else {
      const <%= singularize(name) %> = new <%= classify(name) %>();
      <%= singularize(name) %>.clear();
      this.<%= singularize(name) %>$ = of(new HttpResponse({ body: <%= singularize(name) %> }));
    }

    // get title
    this.title = this.data.title;

    // Get data and create form
    const getDataSubcription = this.<%= singularize(name) %>$
      .pipe(
        tap(res => {
          const { status, body } = res;
          if (status === 200) {
            this.<%= singularize(name) %> = body;
          }
        })
      )
      .subscribe(() => this.createForm());

    // Subcribe when create or edit successfully, close dialog and emit data back to list
    const createOrUpdateSubscription = this.dataSource._createOrUpdateSuccess$.subscribe(res => {
      if (!res) {
        return;
      }
      const dialogData =
        this.<%= singularize(name) %>.id > 0 ? { <%= singularize(name) %>: this.<%= singularize(name) %>, isEdit: true, isDone: true } : { <%= singularize(name) %>: this.<%= singularize(name) %>, isEdit: false, isDone: true };
      this.form.reset();
      this.dialogRef.close(dialogData);
    });

    // Push all Subscription to Subscription list to avoid memory leak
    this.subscriptions.push(getDataSubcription);
    this.subscriptions.push(createOrUpdateSubscription);
  }

  /**
   * ngOnDestroy
   * unSubcribe all subcriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Close alert
   *
   * @param $event: Event
   */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  /**
   * Create form
   */
  createForm() {
    const { 
      <% Object.keys(JSON.parse(obj)).forEach(key => { %>
        <% if (JSON.parse(obj)[key]['display'] === true && key !== 'stt' && JSON.parse(obj)[key]['isPrimitive'] === true) { %>
          <%= key %>,
        <% } %>
      <% }) %>
     } = this.<%= singularize(name) %>;
    this.form = this.fb.group({
      <% Object.keys(JSON.parse(obj)).forEach(key => { %>
        <% if (JSON.parse(obj)[key]['display'] === true && key !== 'stt' && JSON.parse(obj)[key]['isPrimitive'] === true) { %>
            <%= key %>: [<%= key %> ? <%= key %> : '', [
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
   * Save data
   */
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;
    /** check form, if invalid return null */
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      this.hasFormErrors = true;
      return;
    }
    const item = this.prepare();
    this.dataSource.createOrUpdate(item);
  }

  /**
   * Close dialog
   */
  close() {
    this.form.reset();
    this.dialogRef.close({ isDone: false });
  }

  /**
   * Returns item to save or create
   */
  prepare(): IEntity {
    const controls = this.form.controls;
    const item = Object.assign({}, this.<%= singularize(name) %>);
    <% Object.keys(JSON.parse(obj)).forEach(key => { %>
      <% if (JSON.parse(obj)[key]['display'] === true && key !== 'stt' && JSON.parse(obj)[key]['isPrimitive'] === true) { %>
          item.<%= key %> = controls.<%= key %>.value; 
      <% } %>
    <% }) %>
    item.updatedBy = 'admin';
    if (!item.id) {
      // menu.createdBy = this.currentUser.username ? this.currentUser.username : 'admin';
      item.createdBy = 'admin';
      item.isDeleted = false;
    }
    return item;
  }
}

