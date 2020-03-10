import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartialsModule } from 'app/views/partials/partials.module';
import { Routes, RouterModule } from '@angular/router';
import { ActionNotificationComponent, DeleteEntityDialogComponent } from 'app/views/partials/content/crud';
import {<%= classify(singularize(name)) %>Component} from './<%= dasherize(singularize(name)) %>.component';
<% if(singularize(action) === 'detail' || singularize(action) === 'all') { %>  
import {<%= classify(singularize(name)) %>DetailComponent} from './<%= dasherize(singularize(name)) %>-detail/<%= dasherize(singularize(name)) %>-detail.component';
<% } %>
<% if(singularize(action) === 'edit' || singularize(action) === 'all'){ %>  
import {<%= classify(singularize(name)) %>EditComponent} from './<%= dasherize(singularize(name)) %>-edit/<%= dasherize(singularize(name)) %>-edit.component';
<% } %>

const routes: Routes = [{ path: '', pathMatch: 'full', component: <%= classify(singularize(name)) %>Component }];

@NgModule({
  declarations: [
    <%= classify(singularize(name)) %>Component,
    <% if(singularize(action) === 'detail' || singularize(action) === 'all'){ %>  
    <%= classify(singularize(name)) %>DetailComponent,
    <% } %>
    <% if(singularize(action) === 'edit' || singularize(action) === 'all'){ %> 
    <%= classify(singularize(name)) %>EditComponent,
    <% } %>
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PartialsModule
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    <% if(singularize(action) === 'edit' || singularize(action) === 'all'){ %> 
    <%= classify(singularize(name)) %>EditComponent,
    <% } %>
    <% if(singularize(action) === 'detail' || singularize(action) === 'all'){ %>  
    <%= classify(singularize(name)) %>DetailComponent,
    <% } %>
  ]
})

export class <%= classify(name) %>Module {
}
