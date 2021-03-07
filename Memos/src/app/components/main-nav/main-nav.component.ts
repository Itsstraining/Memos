import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { NoteService } from 'src/app/services/note.service';
import { SharedService } from 'src/app/services/shared.service';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  constructor(private noteSer: NoteService,
    private breakpointObserver: BreakpointObserver,
    public auth: AuthService,
    private shareSer: SharedService,
    ) {

  }
  value = 'Clear me';
  routeName: string = 'Memos';
  labels: string[];
  onEnter(value: string) {
    this.shareSer.checkEmail(value);
    // console.log("test");
  }
  public noteShared:Array<any>;
  sharedNote(){
    
    this.noteShared = this.noteSer.getSharedNote;
    
  }
  getSharedNote(email){
    this.shareSer.addNoteShared(email);
  }
  public shared:Array<any>
  check() {
    this.shared = this.noteSer.getShared;

    
  }

  public getShared(email){
    this.noteSer.activeShared(email);
  }
  public changeBack(){
    this.noteSer.changeBack();
  }


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  
  
  ngOnInit(): void {
    
  }
  logout(){
    this.auth.signOut();
    this.noteSer.deleteUserMail();
  }

}
