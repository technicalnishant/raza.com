import { Injectable } from "@angular/core";
 
import { HttpClient } from "@angular/common/http";
 
import { Title, Meta } from '@angular/platform-browser';
@Injectable({providedIn: 'root'})
export class MetaTagsService {
    constructor(private httpClient: HttpClient,
        
        private _titleService: Title,
    private _metaService: Meta
    ) { }
    
     
    public getMetaTagsData(page) {
        this.httpClient.get<[]>("/assets/metatags/"+page+".json").subscribe(res => {
          this.setMetaTags(res);
        })
    }
    setMetaTags(tags: any)
    {
        console.log(tags);
        
        this._titleService.setTitle(tags[0].content); 
        this._metaService.addTags(tags)
    }
     


}