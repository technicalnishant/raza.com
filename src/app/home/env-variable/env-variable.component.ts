import { Component, OnInit } from '@angular/core';
import { SupportService } from '../service/support.service';

@Component({
  selector: 'app-env-variable',
  templateUrl: './env-variable.component.html',
  styleUrls: ['./env-variable.component.scss']
})
export class EnvVariableComponent implements OnInit {

  variables: any;
  constructor(
    private supportService: SupportService
  ) { }

  ngOnInit() {
    this.supportService.getEnvVar().subscribe(res => {
      this.variables = res;
    })
  }

}
