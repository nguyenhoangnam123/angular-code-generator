import { IBase } from 'app/core/base/model/base.interface';
import { Base } from '../../../core/_base/crud/models/eGP-models/_base.model';
export interface I<%= classify(singularize(name)) %> extends IBase{
    
    <% Object.keys(JSON.parse(obj)).forEach(key => { %>
        <%= key %>?: <%= JSON.parse(obj)[key] %>;
    <% }) %>
}

export class <%= classify(singularize(name)) %> extends Base implements IBase{
    <% Object.keys(JSON.parse(obj)).forEach(key => { %>
        <%= key %>?: <%= JSON.parse(obj)[key] %>;
    <% }) %>
    constructor();
    constructor(
        <% Object.keys(JSON.parse(obj)).forEach(key => { %>
            <%= key %>?: <%= JSON.parse(obj)[key] %>,
        <% }) %>
      ){
        super();
        <% Object.keys(JSON.parse(obj)).forEach(key => { %>
            <% if (JSON.parse(obj)[key] === 'string') { %>
                this.<%= key %> = <%= key %> || '';
            <% } %>
            <% if (JSON.parse(obj)[key] === 'number' || JSON.parse(obj)[key] === 'moment') { %>
                this.<%= key %> = <%= key %> || undefined;
            <% } %>
            <% if (JSON.parse(obj)[key] === 'boolean') { %>
                this.<%= key %> = <%= key %> || false;
            <% } %>
            <% if (JSON.parse(obj)[key].indexOf('[]') > 0) { %>
                this.<%= key %> = <%= key %> || [];
            <% } %>
        <% }) %>
      }
      clear(): void {}
    }