import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';

import { Note } from 'src/app/models/note-model';
import { NoteService } from 'src/app/services/note.service';
import { EditNoteModalComponent } from './edit-note-modal/edit-note-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})


export class NoteComponent implements OnInit {
  animal: string;
  name: string;

  @Input() note: Note;
  menuActiveTrigger: boolean = false;
  fileProgress: boolean = false;
  @Input() details: boolean; // means that menu not in noteComponent
  @Input() newNote: boolean; // means that menu in newPageComponent
  selecetdFile: File;
  menuActive: boolean = false; // means that one of menu item open
  
  openDialog(id): void {
    const dialogRef = this.dialog.open(DialogNote, {
      width: 'auto',
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }

  public color = this.noteServcies.colors;

  addToShare(id,shareTo){
    this.shareSer.checkEmailShared(id,shareTo);
  }
  onEnter(value: string) {
    // this.shareSer.checkEmail(value);
    // console.log("test");
  }

  constructor(public noteServcies: NoteService,
    public dialog: MatDialog,public shareSer:SharedService) {
  }

  ngOnInit(): void {
  }
  public deleteNote(id,shareTo) {
    this.noteServcies.addToTrash(id,shareTo);
  }

  public storeNote(id) {
    this.noteServcies.addNoteToArchive(id);
  }

  public noteFlag(id) {
    this.noteServcies.addNoteToFlag(id);
  }


  // Check current color is selected
  isSelect(index: number): boolean {
    return this.note.selectedColor == index;
  }
  // Color menu item click event handler
  colorClick(index: number, numb: number,shareTo) {
    // console.log(shareTo)
    this.noteServcies.changColor(this.color[index], numb, 'note',shareTo);
  }
  setFileProgress(fileProgress: boolean) {
    this.fileProgress = fileProgress;
  }
  // Open modal note edit
  
  upload(event: any, id, pin) {
    
    this.noteServcies.changeImgURL(event, id, pin, "note");

  }

  check() {
    console.log("testing");
  }
  // Outputing menu opened trigger
  @Output() setMenu = new EventEmitter<boolean>();
  setMenuStatus(status: boolean) {
    this.setMenu.emit(status);
  }
}


@Component({
  selector: 'dialog-note',
  templateUrl: './dialog-note.html',
})


export class DialogNote {
  @Input() note: Note;
  constructor(
    public dialogRef: MatDialogRef<DialogNote>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public shareSer:SharedService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  check(data){
    console.log(data.id);
  }

  addToShare(data,shareTo){
    this.shareSer.checkEmailShared(data.id,shareTo);
  }
}
