import { Component, OnInit, ViewChild,TemplateRef  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/user.model';
import {  MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private router: Router,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.dataSource.data = this.userService.getUsers();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filter;
  }



  openDeleteDialog(userId: number): void {
    this.dialogRef = this.dialog.open(this.deleteDialog);

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(userId);
        this.loadUsers();

      }
    });
  }



}
