import { Component } from '@angular/core';

@Component({
    selector: '<%= namespaceRoot.toLowerCase()%>-<%= friendlyName.toLowerCase() %>',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = '<%= friendlyName %>';
    constructor() {}
}
