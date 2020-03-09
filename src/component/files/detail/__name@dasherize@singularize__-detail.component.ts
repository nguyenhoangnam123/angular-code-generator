import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { <%= classify(name) %>Service } from '../../<%= singularize(name) %>/<%= singularize(name) %>.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpResponse } from '@angular/common/http';
import { I<%= classify(name) %> } from '../../<%= singularize(name) %>/<%= singularize(name) %>.model';

type IEntity = I<%= classify(name) %>;
@Component({
  selector: 'jhi-<%= singularize(name) %>-detail',
  templateUrl: './<%= singularize(name) %>-detail.component.html',
})
export class <%= classify(name) %>DetailComponent implements OnInit, OnDestroy {
  title: string;
  <%= singularize(name) %>: IEntity;
  <%= singularize(name) %>$: Observable<HttpResponse<IEntity>>;
  private subscriptions: Subscription[] = [];
  constructor(
    private _service: <%= classify(name) %>Service,
    public dialogRef: MatDialogRef<<%= classify(name) %>DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.<%= singularize(name) %>$ = this._service.findById(this.data.id);
    const <%= singularize(name) %>Subscription = this.<%= singularize(name) %>$.subscribe(res => {
      const { status, body } = res;
      if (status === 200) {
        this.<%= singularize(name) %> = body;
      }
    });

    // get title
    this.title = this.data.title;

    this.subscriptions.push(<%= singularize(name) %>Subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  close() {
    this.dialogRef.close();
  }
}
