import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-archive-page',
  templateUrl: './archive-page.component.html',
  styleUrls: ['./archive-page.component.scss']
})
export class ArchivePageComponent implements OnInit,OnDestroy {

  constructor(public authSer:AuthService) { }

  ngOnInit(): void {
    this.authSer.checkLogin();
  }
  ngOnDestroy():void{

  }

}
