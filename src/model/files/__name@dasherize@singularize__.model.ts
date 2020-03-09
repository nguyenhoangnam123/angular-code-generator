import { IBase } from 'app/core/base/model/base.interface';
import { Base } from '../../../core/_base/crud/models/eGP-models/_base.model';
export interface I<%= classify(singularize(name)) %> extends IBase{
    
    <% Object.keys(JSON.parse(obj)).forEach(key => { %>
        <%= key %>?: <%= JSON.parse(obj)[key]['type'] %>;
    <% }) %>
}

export class <%= classify(singularize(name)) %> extends Base implements IBase{
    <% Object.keys(JSON.parse(obj)).forEach(key => { %>
        <%= key %>?: <%= JSON.parse(obj)[key]['type'] %>;
    <% }) %>
    constructor();
    constructor(
        <% Object.keys(JSON.parse(obj)).forEach(key => { %>
            <%= key %>?: <%= JSON.parse(obj)[key]['type'] %>,
        <% }) %>
      ){
        super();
        <% Object.keys(JSON.parse(obj)).forEach(key => { %>
            <% if (JSON.parse(obj)[key]['type'] === 'string') { %>
                this.<%= key %> = <%= key %> || '';
            <% } %>
            <% if (JSON.parse(obj)[key]['type'] === 'number' || JSON.parse(obj)[key]['type'] === 'moment') { %>
                this.<%= key %> = <%= key %> || undefined;
            <% } %>
            <% if (JSON.parse(obj)[key]['type'] === 'boolean') { %>
                this.<%= key %> = <%= key %> || false;
            <% } %>
            <% if (JSON.parse(obj)[key]['type'].indexOf('[]') > 0) { %>
                this.<%= key %> = <%= key %> || [];
            <% } %>
        <% }) %>
      }
      clear(): void {}
    }