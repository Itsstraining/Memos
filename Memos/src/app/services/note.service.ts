import { Injectable, OnInit } from '@angular/core';
import { Note } from '../models/note-model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from "@angular/fire/firestore"
import { Observable } from 'rxjs';
import { finalize, share } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import { arch } from 'node:os';
@Injectable({
  providedIn: 'root'
})
export class NoteService implements OnInit {

  private notes: Note[];
  private notes1: Note[];
  private trashs: Note[];
  private archive: Note[];
  private flag: Note[];
  private img: Note[];
  public userMail: any;
  public preUserMail: any;

  // days = 7;
  // date = new Date();
  // currentDate = new Date();
  // res = this.date.setTime(this.date.getTime() + (this.days * 24 * 60 * 60 * 1000));

  colors: string[] = [
    // Available menu colors
    "#fefefe",
    "#f28c80",
    "#f6bf02",
    "#fff478",
    "#cdfe91",
    "#a6fdea",
    "#cdeff8",
    "#afcbfa",
    "#d5affc",
    "#fdcfe9",
    "#e2cba9",
    "#e9eaee",
  ];



  constructor(private http: HttpClient, public fire: AngularFirestore, private fireData: AngularFireStorage) {

    this.img = [];
    this.notes = [];
    this.notes1 = [];
    this.trashs = [];
    this.archive = [];
    this.flag = [];
    this.getData();
    this.getId();
  }
  ngOnInit(): void {
  }


  public changeNotes(indexPre, indexCur) {
    let id = this.notes[indexPre].id;
    let id1 = this.notes[indexCur].id;
    let data = this.notes[indexPre];
    let data1 = this.notes[indexCur];
    data.id = id1;
    data1.id = id;
    this.fire.doc(`user/user1/notes/${id}`).delete();
    this.fire.doc(`user/user1/notes/${id1}`).delete();
    this.fire.collection("user").doc("user1").collection("notes").doc(data.id.toString()).set(data);
    this.fire.collection("user").doc("user1").collection("notes").doc(data1.id.toString()).set(data1);
  }

  public changeFlag(indexPre, indexCur) {
    let id = this.flag[indexPre].id;
    let id1 = this.flag[indexCur].id;
    let data = this.flag[indexPre];
    let data1 = this.flag[indexCur];
    data.id = id1;
    data1.id = id;
    this.fire.doc(`user/user1/flags/${id}`).delete();
    this.fire.doc(`user/user1/flags/${id1}`).delete();
    this.fire.collection("user").doc("user1").collection("flags").doc(data.id.toString()).set(data);
    this.fire.collection("user").doc("user1").collection("flags").doc(data1.id.toString()).set(data1);
  }

  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;

  public changeImgURL(event, id, pin, page) {
    let file = event.target.files[0];
    let n = file.name;
    let filePath = `RoomsImages/${n}`;
    let fileRef = this.fireData.ref(filePath);
    let task = this.fireData.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            this.fb;
            this.img[0] = this.fb;
            this.changeImg(id, page, this.fb, pin);

          });
        })
      )
      .subscribe(url => {
        if (url) {
          // console.log(url);
        }
      });
  }

  addUserMail(email) {
    this.userMail = email;
    this.preUserMail = email;


    this.getUserShared();
    this.getData();
  }
  deleteUserMail() {
    this.userMail = undefined;
    this.preUserMail = undefined;
    // this.getData();
  }

  public get getMail() {
    let temp: string;
    temp = this.userMail;
    return temp;
  }
  public id: any;
  public getId() {
    let id: Observable<any>;
    id = this.fire.collection("user").doc("id").valueChanges();
    id.subscribe((data) => {
      this.id = data.id.toString();
    })

  }

  public shared: any;
  getUserShared() {
    let user1 = this.userMail;
    let shared: Observable<any>;
    shared = this.fire.collection("user").doc(user1).collection("shared").valueChanges();
    shared.subscribe((data) => {
      this.shared = data;
    })
  }
  public sharedNote: any;
  getUserNoteShared() {
    let currentUser = this.userMail;
    let shared: Observable<any>;
    shared = this.fire.collection("user").doc(currentUser).collection("sharedNote").valueChanges();
    shared.subscribe((data) => {
      this.sharedNote = data;
    })
  }
  public sharedNoteUser: any
  checkUserSharedNoteTo() {

  }

  check() {
    console.log(this.shared);

  }
  public get getShared() {
    return this.shared;
  }
  public get getSharedNote() {
    return this.sharedNote;
  }

  public activeShared(email) {
    this.userMail = email;
    this.getData();
  }
  public get getUserMail() {
    return this.userMail;
  }
  public changeBack() {
    this.userMail = this.preUserMail;
    this.getData();
  }

  // Example note
  getDefaultNote(): Note {
    return {
      id: "", title: 'firsttitle', description: 'firstdescription', pin: false, notes: true,
      labels: [], selectedColor: 0, color: '#fefefe', todoList: [], imagePreview: "",
      showTodo: false, arhieved: false, trash: false, shareFrom: "", shareTo: ''
    };
  }
  // Generate emptyNote
  getEmptyNote(): Note {
    return {
      id: "", title: "", description: "", labels: [], selectedColor: 0, pin: false, imagePreview: "", notes: true,
      color: '#fefefe', todoList: [], showTodo: false, arhieved: false, trash: false, num: this.notes.length + 1,
      shareFrom: "", shareTo: ''
    }
  }


  // Note empty checking logic
  checkNoteIsEmpty(note: Note) {
    if (note.title || note.description || note.imagePreview ||
      (note.todoList.length && note.showTodo)) return false;
    else return true;
  }
  getNote(id) {
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].id == id) {
        return this.notes[i];
      }
    }
  }
  public addNote(newNote: Note) {
    let user1 = this.userMail;
    newNote.id = this.id;
    newNote.notes = true;
    let temp = {
      email: user1
    }
    this.fire.collection("user").doc(user1).set(temp);
    this.fire.collection("user").doc(user1).collection("notes").doc(this.id).set(newNote);
    // this.http.post(environment.endpoint + "notes/create", newNote).toPromise();
    this.fire.collection("user").doc("id").update({ id: parseInt(this.id) + 1 })
  }

  getData() {
    this.getNotesData();
    this.getNotes1Data();
    this.getFlagsData();
    this.getArchivesData();
    this.getTrashData();
    this.getUserShared();
    this.getUserNoteShared();
    this.checkUserSharedNoteTo();
  }
  public getNotesData() {

    let user1 = this.userMail;
    let notes: Observable<any[]>;
    notes = this.fire.collection("user").doc(user1).collection("notes").valueChanges();
    notes.subscribe((data) => {
      this.notes = data;
    })
  }
  public getNotes1Data() {
    let user1 = this.userMail;
    let notes1: Observable<any[]>;
    notes1 = this.fire.collection("user").doc(user1).collection("notes1").valueChanges();
    notes1.subscribe((data) => {
      this.notes1 = data;
    })
  }


  public getFlagsData() {
    let user1 = this.userMail;
    let flags: Observable<any[]>;
    flags = this.fire.collection("user").doc(user1).collection("flags").valueChanges();
    flags.subscribe((data) => {
      this.flag = data;
    })
  }


  public getArchivesData() {
    let user1 = this.userMail;
    let archives: Observable<any[]>;
    archives = this.fire.collection("user").doc(user1).collection("archives").valueChanges();
    archives.subscribe((data) => {
      this.archive = data;
    })
  }



  public getTrashData() {
    let user1 = this.userMail;
    let trashs: Observable<any[]>;
    trashs = this.fire.collection("user").doc(user1).collection("trashs").valueChanges();
    trashs.subscribe((data) => {
      let temp: any;
      temp = data;
      this.trashs = temp;
    })
  }

  public deleteInTrash(numb: String) {
    let user1 = this.userMail;
    let id = numb;
    let urlDelTrashs = `${environment.endpoint}trashs/id/delete?id=${id}`;
    // this.http.delete(urlDelTrashs).toPromise();
    this.fire.collection("user").doc(user1).collection("trashs").doc(id.toString()).delete();
  }
  public tranferToNotes(notes) {
    let user1 = this.userMail;
    if (notes.notes == true) {
      notes.notes = false;
      this.fire.collection("user").doc(user1).collection("notes1").doc(notes.id.toString()).set(notes);
      this.fire.collection("user").doc(user1).collection("notes").doc(notes.id.toString()).delete();

    } else if (notes.notes == false) {
      notes.notes = true;
      this.fire.collection("user").doc(user1).collection("notes1").doc(notes.id.toString()).delete();
      this.fire.collection("user").doc(user1).collection("notes").doc(notes.id.toString()).set(notes);
    }


  }
  public async addToTrash(id: String, shareTo) {
    let user1 = this.userMail;
    if (shareTo == undefined || shareTo == "") {

    } else {
      this.fire.collection("user").doc(shareTo).collection("sharedNote").doc(user1).collection("notes").doc(id.toString()).delete();
    }
    // let urlDelNotes = `${environment.endpoint}notes/id/delete?id=${id}`;
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].id == id) {
        // this.notes[i].pin = false;
        this.fire.collection("user").doc(user1).collection("notes").doc(id.toString()).delete();
        // this.http.delete(urlDelNotes).toPromise();
        this.fire.collection("user").doc(user1).collection("trashs").doc(id.toString()).set(this.notes[i]);
        // this.http.post(environment.endpoint + "trashs/create", this.notes[i]).toPromise();
      }
    }
  }
  public async add1ToTrash(id: String) {
    let user1 = this.userMail;
    // let urlDelNotes = `${environment.endpoint}notes/id/delete?id=${id}`;
    for (let i = 0; i < this.notes1.length; i++) {
      if (this.notes1[i].id == id) {
        // this.notes[i].pin = false;
        this.fire.collection("user").doc(user1).collection("notes1").doc(id.toString()).delete();
        // this.http.delete(urlDelNotes).toPromise();
        this.fire.collection("user").doc(user1).collection("trashs").doc(id.toString()).set(this.notes1[i]);
        // this.http.post(environment.endpoint + "trashs/create", this.notes[i]).toPromise();
      }
    }
  }
  addNoteToArchive(numb) {
    let id = numb;
    let user1 = this.userMail;
    // let urlDelNotes = `${environment.endpoint}notes/id/delete?id=${id}`;
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].id == id) {

        this.fire.collection("user").doc(user1).collection("notes").doc(id.toString()).delete();
        this.fire.collection("user").doc(user1).collection("archives").doc(id.toString()).set(this.notes[i]);
        // this.notes[i].pin = false;
        // this.http.delete(urlDelNotes).toPromise();
        // this.http.post(environment.endpoint + "archives/create", this.notes[i]).toPromise();
      }
    }
  }
  addNote1ToArchive(numb) {
    let id = numb;
    let user1 = this.userMail;
    // let urlDelNotes = `${environment.endpoint}notes/id/delete?id=${id}`;
    for (let i = 0; i < this.notes1.length; i++) {
      if (this.notes1[i].id == id) {
        this.fire.collection("user").doc(user1).collection("notes1").doc(id.toString()).delete();
        this.fire.collection("user").doc(user1).collection("archives").doc(id.toString()).set(this.notes1[i]);
        // this.notes[i].pin = false;
        // this.http.delete(urlDelNotes).toPromise();
        // this.http.post(environment.endpoint + "archives/create", this.notes[i]).toPromise();
      }
    }
  }

  public addFlagToNote(id) {
    let user1 = this.userMail;
    let flag: any = this.flag;
    for (let i = 0; i < flag.length; i++) {
      if (flag[i].id == id) {


        this.fire.collection("user").doc(user1).collection("flags").doc(flag[i].id).delete();
        this.fire.doc(`user/${user1}/notes/${id}`).set(flag[i]);
      }
    }
  }

  public addNoteToFlag(id) {
    let user1 = this.userMail;
    let notes: any = this.notes;
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id == id) {
        notes[i].pin = true;
        // console.log(notes[i])
        this.fire.collection("user").doc(user1).collection("notes").doc(notes[i].id).delete();
        this.fire.doc(`user/${user1}/flags/${id}`).set(notes[i]);
      }
    }
  }
  public addNote1ToFlag(id) {
    let user1 = this.userMail;
    let notes1: any = this.notes1;
    for (let i = 0; i < notes1.length; i++) {
      if (notes1[i].id == id) {

        notes1[i].pin = true;
        notes1[i].notes = false;
        this.fire.collection("user").doc(user1).collection("notes1").doc(notes1[i].id).delete();
        this.fire.doc(`user/${user1}/flags/${id}`).set(notes1[i]);
      }
    }
  }

  addFlagToArchive(numb) {
    let user1 = this.userMail;
    let id = numb;
    let urlDelFlags = `${environment.endpoint}flags/id/delete?id=${id}`;
    for (let i = 0; i < this.flag.length; i++) {
      if (this.flag[i].id == id) {
        // this.notes[i].pin = false;
        // this.http.delete(urlDelFlags).toPromise();
        // this.http.post(environment.endpoint + "archives/create", this.flag[i]).toPromise();
        this.fire.collection("user").doc(user1).collection("flags").doc(id.toString()).delete();
        this.fire.collection("user").doc(user1).collection("archives").doc(id.toString()).set(this.flag[i]);
      }
    }
  }

  addFlagToTrash(numb) {
    let user1 = this.userMail;
    let id = numb;
    let urlDelFlags = `${environment.endpoint}flags/id/delete?id=${id}`;
    for (let i = 0; i < this.flag.length; i++) {
      if (this.flag[i].id == id) {
        // this.notes[i].pin = false;
        // this.http.delete(urlDelFlags).toPromise();
        // this.http.post(environment.endpoint + "trashs/create", this.flag[i]).toPromise();
        this.fire.collection("user").doc(user1).collection("flags").doc(id.toString()).delete();
        this.fire.collection("user").doc(user1).collection("trashs").doc(id.toString()).set(this.flag[i]);
      }
    }
  }

  deleteArchiveToTrash(numb) {
    let id = numb;
    let user1 = this.userMail;
    let urlDelArchive = `${environment.endpoint}archives/id/delete?id=${id}`;
    for (let i = 0; i < this.archive.length; i++) {
      if (this.archive[i].id == id) {
        this.archive[i].arhieved = true;
        // this.notes[i].pin = false;
        // this.http.delete(urlDelArchive).toPromise();
        // this.http.post(environment.endpoint + "trashs/create", this.archive[i]).toPromise();
        this.fire.collection("user").doc(user1).collection("archives").doc(id.toString()).delete();
        this.fire.collection("user").doc(user1).collection("trashs").doc(id.toString()).set(this.archive[i]);
      }
    }
  }
  public get getFlag(): Note[] {
    return this.flag;
  }
  public get getNotes(): Note[] {
    return this.notes;
  }
  public get getNotes1(): Note[] {
    return this.notes1;
  }
  public get getArchive(): Note[] {
    return this.archive;
  }
  public get getTrash(): Note[] {
    return this.trashs;
  }
  public getArchiveById(id) {
    for (let i = 0; i < this.archive.length; i++) {
      if (this.archive[i].id == id) {
        return this.archive[i];
      }
    }
  }
  public getTrashsById(id) {
    for (let i = 0; i < this.trashs.length; i++) {
      if (this.trashs[i].id == id) {
        return this.trashs[i];
      }
    }
  }

  public restoreNote(pin, archive, id, page) {
    let user = this.userMail;
    if (page == 'archive') {
      let archiveData = this.getArchiveById(id);
      if (pin == false) {
        this.fire.collection("user").doc(user).collection("notes").doc(id).set(archiveData);
        this.fire.collection("user").doc(user).collection("archives").doc(id).delete();
        //restore archive to note
      } else if (pin == true) {
        this.fire.collection("user").doc(user).collection("flags").doc(id).set(archiveData);
        this.fire.collection("user").doc(user).collection("archives").doc(id).delete();
        //restore archive to flag
      }
    } else {
      let trashsData = this.getTrashsById(id);
      if (archive == true) {
        this.fire.collection("user").doc(user).collection("archives").doc(id).set(trashsData);
        this.fire.collection("user").doc(user).collection("trashs").doc(id).delete();
        //restore trashs to archive
      } else if (pin == true && archive == false) {
        this.fire.collection("user").doc(user).collection("flags").doc(id).set(trashsData);
        this.fire.collection("user").doc(user).collection("trashs").doc(id).delete();
        //restore trashs to flag
      } else if (pin == false && archive == false) {
        this.fire.collection("user").doc(user).collection("notes").doc(id).set(trashsData);
        this.fire.collection("user").doc(user).collection("trashs").doc(id).delete();
        //restore trashs to note
      }
    }

  }

  public changColor(color, id, page, shareTo) {
    let currentUser = this.userMail;
    if (shareTo == "") {
    } else {
      this.fire.collection("user").doc(shareTo).collection("sharedNote").doc(currentUser).collection("notes").doc(id).update({ color: color })
    }
    let user1 = this.userMail;
    switch (page) {
      case 'note': {
        let url = `${environment.endpoint}notes/id/update/color/`;
        // this.http.put(url, temp).toPromise();
        this.fire.collection("user").doc(user1).collection("notes").doc(id.toString()).update({ color: color });
        break;
      }
      case 'note1': {
        let url = `${environment.endpoint}notes/id/update/color/`;
        // this.http.put(url, temp).toPromise();
        this.fire.collection("user").doc(user1).collection("notes1").doc(id.toString()).update({ color: color });
        break;
      }
      case 'flag': {
        let url = `${environment.endpoint}flags/id/update/color/`;
        // this.http.put(url, temp).toPromise();
        this.fire.collection("user").doc(user1).collection("flags").doc(id.toString()).update({ color: color });
        break;
      }
      case 'archive': {
        let url = `${environment.endpoint}archives/id/update/color/`;
        this.fire.collection("user").doc(user1).collection("archives").doc(id.toString()).update({ color: color });
        // this.http.put(url, temp).toPromise();
        break;
      }
      default:
        console.log("error!");
        break;
    }

  }

  public getColor(id) {
    return this.notes[id].color;
  }

  public getImg() {

    return this.img[0];
  }

  public changeImg(id, page, img: string, pin) {
    let temp = {
      "id": id,
      "img": img,
      "pin": pin
    }
    let user1 = this.userMail;

    if (page == 'archive') {
      let url = `${environment.endpoint}archives/id/update/img/`;
      // this.http.put(url, temp).toPromise();
      this.fire.collection("user").doc(user1).collection("archives").doc(id.toString()).update({ imagePreview: img });

    } else if (page == 'note' && pin == false) {
      let url = `${environment.endpoint}notes/id/update/img`;
      // console.log(temp);
      // this.http.put(url, temp).toPromise();
      this.fire.collection("user").doc(user1).collection("notes").doc(id.toString()).update({ imagePreview: img });

    } else if (page == 'note' && pin == true) {
      let url = `${environment.endpoint}flags/id/update/img`;
      // this.http.put(url, temp).toPromise();

      this.fire.collection("user").doc(user1).collection("flags").doc(id.toString()).update({ imagePreview: img });
    } else if (page == 'note1') {
      let url = `${environment.endpoint}flags/id/update/img`;
      // this.http.put(url, temp).toPromise();

      this.fire.collection("user").doc(user1).collection("notes1").doc(id.toString()).update({ imagePreview: img });
    }
  }

  public deteleAllOnDays() {
    // let current = this.currentDate.getTime();
    // if (current == this.res) {
    //   let url = `${environment.endpoint}trash/delete/all`;
    //   this.http.delete(url).toPromise();
    // }
  }

  public deleteAll() {
    // let url = `${environment.endpoint}trash/delete/all`;
    // this.http.delete(url).toPromise();

    // let urlDelTrashs = `${environment.endpoint}trashs/id/delete?id=${id}`;
    // this.http.delete(urlDelTrashs).toPromise();
    let user1 = this.userMail;
    for (let i = 0; i < this.trashs.length; i++) {
      let urlDelTrashs = `${environment.endpoint}trashs/id/delete?id=${this.trashs[i].id}`;
      // this.http.delete(urlDelTrashs).toPromise();
      this.fire.collection("user").doc(user1).collection("trashs").doc(this.trashs[i].id).delete();
    }


    // let data: any;
    // this.http.delete(urlDelTrashs).toPromise();
  }

  public getColorById(id, page: string, notes) {
    switch (page) {
      case 'note': {
        for (let i = 0; i < this.notes.length; i++) {
          if (this.notes[i].id == id) {
            return this.notes[i].color;
          }
        }
        break;
      }
      case 'archive': {
        for (let i = 0; i < this.archive.length; i++) {
          if (this.archive[i].id == id) {
            return this.archive[i].color;
          }
        }
        break;
      }
      case 'flag': {
        for (let i = 0; i < this.flag.length; i++) {
          if (this.flag[i].id == id) {
            return this.flag[i].color;
          }
        }
        break;
      }
      case 'trash': {
        for (let i = 0; i < this.trashs.length; i++) {
          if (this.trashs[i].id == id) {
            return this.trashs[i].color;
          }
        }
        break;
      } case 'note1': {
        for (let i = 0; i < this.notes1.length; i++) {
          if (this.notes1[i].id == id) {
            return this.notes1[i].color;
          }
        }
        break;
      }
      default: {
        return console.log("can't get color")
        break;
      }
    }


  }
  public getColorByNumArchive(num: number, page: string) {
    if (page == 'archive') { return this.archive[num - 1].color; }
  }



}
