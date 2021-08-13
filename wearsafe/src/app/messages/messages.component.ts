import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from '../types';
import { MessageService } from '../_services/message.service';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  displayedColumns: string[] = ['select','id','text', 'date'];
  dataSource: MatTableDataSource<any>;
  error;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadMessages();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selection = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
    
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Message): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  loadMessages(){
    this.messageService.get().subscribe(messages => {
      for (const key of Object.keys(messages)) {
        messages[key].key = key;        
      }
      this.dataSource = new MatTableDataSource(Object.values(messages));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  remove(){    
    let arrayOfPromises = [];
    for (const item of this.selection.selected) {
      arrayOfPromises.push(this.messageService.delete(item.key));
    }
    Promise.all(arrayOfPromises).then(values => {
      this.loadMessages();
    }).catch(error => {
      this.error = error;
    })
  }
}
