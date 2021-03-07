import { Component, Input, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note-model';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note-trash',
  templateUrl: './note-trash.component.html',
  styleUrls: ['./note-trash.component.scss']
})
export class NoteTrashComponent implements OnInit {
  @Input() note: Note;
  menuActiveTrigger: boolean = false;

  constructor(public noteServcies: NoteService) { }

  ngOnInit(): void {

  }
  changeNote(pin,archive,id){
    this.noteServcies.restoreNote(pin,archive,id,'trashs');
  }
  deleteNote(numb) {
    this.noteServcies.deleteInTrash(numb);
  }

}