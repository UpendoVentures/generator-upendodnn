import { Component } from '@angular/core';

@Component({
    selector: '<%= namespace.toLowerCase()%>-<%= moduleName.toLowerCase() %>',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = '<%= moduleName %>';
    constructor() {}
}
