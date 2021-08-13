import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Html } from '../negate-regex';
import { MessageService } from '../_services/message.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private messageService : MessageService,
              private formBuilder: FormBuilder,
              private _snackBar: MatSnackBar) { }

  textForm: FormGroup;
  nextId = 1;
  loading = false;


  ngOnInit(): void {
    this.textForm = this.formBuilder.group({
      text: [null, [Validators.required, Validators.maxLength(140)]]
    },
    {
      validator: Html('text')
    });
  }

  submit() {    

    if (!this.textForm.valid) {
      return;
    }
    this.loading = true;
    this.messageService.getNextId().subscribe(id => {
        if(id){
          this.nextId = id[Object.keys(id)[0]].id + 1;
        }
        let text = this.textForm.controls.text.value.toString();
        this.messageService.post({text: text, date: new Date().toLocaleDateString('en-us'), id: this.nextId}).subscribe(result => {                
          this.textForm.reset();
          console.log(this.textForm.controls.text);
          this.loading = false;
          this._snackBar.open('Text saved successfully', 'dismiss',{duration:  5000, panelClass: ['success']});
        },
        error => {        
          this.loading = false;
          this._snackBar.open(error.message,'dismiss',{duration:  5000, panelClass: ['error']})
        })
    })
  }

}
