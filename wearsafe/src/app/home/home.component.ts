import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Html } from '../negate-regex';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private messageService : MessageService,
              private formBuilder: FormBuilder) { }

  textForm: FormGroup;
  nextId = 1;


  ngOnInit(): void {
    this.textForm = this.formBuilder.group({
      text: [null, [Validators.required]]
    },
    {
      validator: Html('text')
    });
  }

  submit() {
    if (!this.textForm.valid) {
      return;
    }
    this.messageService.getNextId().subscribe(id => {
        if(id){
          this.nextId = id[Object.keys(id)[0]].id + 1;
        }
        let text = this.textForm.controls.text.value.toString();
        this.messageService.post({text: text, date: new Date().toLocaleDateString('en-us'), id: this.nextId}).subscribe(result => {         
          this.textForm.reset();
        })
    })
  }

}
