import { Component, OnInit, Input } from '@angular/core';
import { FaqModel } from '../../model/faq-model';
import { Observable } from 'rxjs';
import { FaqsService } from '../../services/faqs.service';

@Component({
  selector: 'app-faq-generic',
  templateUrl: './faq-generic.component.html',
  styleUrls: ['./faq-generic.component.scss']
})
export class FaqGenericComponent implements OnInit {

  faqs: Observable<FaqModel[]>;
  @Input() promotionCode: string;
  constructor(
    private faqService: FaqsService
  ) { }

  ngOnInit() {
    this.faqs = this.faqService.get(this.promotionCode);
  }

}
