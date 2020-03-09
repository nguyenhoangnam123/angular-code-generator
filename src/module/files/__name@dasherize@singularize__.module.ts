import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartialsModule } from 'app/views/partials/partials.module';
import { Routes, RouterModule } from '@angular/router';
import { ActionNotificationComponent, DeleteEntityDialogComponent } from 'app/views/partials/content/crud';
import { <%= classify(singularize(name)) %>Component } from './user.component';
import { <%= classify(singularize(name)) %>DetailComponent } from './user-detail/user-detail.component';
import { <%= classify(singularize(name)) %>EditComponent } from './user-edit/user-edit.component';

import {<%= classify(singularize(name)) %>Component} from './<%= dasherize(pluralize(name)) %>.component';
import {<%= classify(singularize(name)) %>DetailComponent} from './<%= dasherize(pluralize(name)) %>-detail/<%= dasherize(pluralize(name)) %>-detail.component';
import {<%= classify(singularize(name)) %>EditComponent} from './<%= dasherize(pluralize(name)) %>-edit/<%= dasherize(pluralize(name)) %>-edit.component';

const routes: Routes = [{ path: '', pathMatch: 'full', component: <%= classify(singularize(name)) %>Component }];

@NgModule({
  declarations: [
    <%= classify(singularize(name)) %>Component,
    <%= classify(singularize(name)) %>DetailComponent,
    <%= classify(singularize(name)) %>EditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PartialsModule
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    <%= classify(singularize(name)) %>EditComponent,
    <%= classify(singularize(name)) %>DetailComponent,
  ]
})

export class <%= classify(name) %>Module {
}
