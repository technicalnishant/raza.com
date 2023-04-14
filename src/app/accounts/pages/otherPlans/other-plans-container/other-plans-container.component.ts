import { Component, OnInit, OnDestroy } from '@angular/core';
import { RazaLayoutService } from '../../../../core/services/raza-layout.service';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { userContext } from '../../../../core/interfaces';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-other-plans-container',
  templateUrl: './other-plans-container.component.html',
  styleUrls: ['./other-plans-container.component.scss']
})
export class OtherPlansContainerComponent implements OnInit, OnDestroy {
  username: string;
  isVisibleCloseIcon: boolean = false;
  routeSubs$: Subscription
  isSmallScreen: boolean;
  constructor(
    private razaLayoutService: RazaLayoutService,
    private router: Router,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.razaLayoutService.setFixedHeader(true);
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');

    const userContext: userContext = this.authService.getCurrentLoginUser();
    this.username = userContext.username;

    this.routeSubs$ = this.router.events.subscribe(res => {
      if (res instanceof NavigationStart) {
        if ((res as NavigationStart).url.toLowerCase().endsWith('/other-plans') === true) {
          this.isVisibleCloseIcon = false;
        } else {
          this.isVisibleCloseIcon = true;
        }
      }
    })
  }

  onClickClose() {
    this.router.navigate(['account/other-plans']);
  }

  ngOnDestroy(): void {
    this.routeSubs$.unsubscribe();
  }
}
