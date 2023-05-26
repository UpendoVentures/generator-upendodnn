import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { DnnContextService } from '../app/services/DNN/ddncontext.service';
import { Observable } from 'rxjs';

@Injectable()
export class DnnInterceptor implements HttpInterceptor {
  private context;
  constructor(private ctx: DnnContextService) {
    this.context = this.ctx.getServiceFramework();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        ModuleId: this.context.moduleId.toString(),
        TabId: this.context.tabId.toString(),
        RequestVerificationToken: this.context.antiForgeryToken,
        'X-Debugging-Hint': 'bootstrapped by bbAngular',
      }
    });
    return next.handle(request);
  }
}