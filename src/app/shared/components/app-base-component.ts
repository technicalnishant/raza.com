import { Injector } from "@angular/core";
import { ReCaptchaV3Service, OnExecuteData } from "ng-recaptcha";
import { map } from "rxjs/operators";

export abstract class AppBaseComponent {

  private recaptchaV3Service: ReCaptchaV3Service

  constructor(injector: Injector) {
    this.recaptchaV3Service = injector.get(ReCaptchaV3Service)
  }

  executeCaptcha(action: string) {
    return this.recaptchaV3Service.execute(action);
  }

  runCaptcha() {
    return this.recaptchaV3Service.onExecute.pipe(map(a => a.token)).toPromise();
  }

}