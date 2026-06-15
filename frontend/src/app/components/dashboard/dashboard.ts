import { Component, OnInit } from '@angular/core';
import { Task } from '../../services/task';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  tasks: any[] = [];

  taskData = {
    title: '',
    completed: false,
    priority: 'Medium',
      dueDate: ''
  };

  editMode = false;
  currentTaskId = '';
  searchText = '';
  filterType = 'all';


  constructor(private taskService: Task, private cdr: ChangeDetectorRef, private router: Router) { }


  ngOnInit(): void {

    this.getTasks();
  }
  get TotalTasks() {
    return this.tasks.length;
  }
  get CompletedTasks() {
    return this.tasks.filter(task => task.completed).length;
  }
  get PendingTasks() {
    return this.tasks.filter(task => !task.completed).length;
  }
  get filteredTasks() {
    let filtered = this.tasks;
    if (this.filterType === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }
    if (this.filterType === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }
    return filtered.filter(task => task.title.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  getTasks() {
  //  console.log(this.taskData);
    this.taskService.getTasks().subscribe({

      next: (res) => {
        this.tasks = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  logout() {

    localStorage.clear();

    this.router.navigate(['/login']);

  }

  addTask() {
    console.log("Current Task Data:", this.taskData);
   if (this.editMode) {

      this.taskService.updateTask(
        this.currentTaskId,
        this.taskData
      ).subscribe(() => {

        this.editMode = false;

        this.taskData = {
          title: '',
          completed: false,
          priority: '',
          dueDate: ''
        };

        this.getTasks();
      });
 
    } else {

      this.taskService.addTask(this.taskData)
        .subscribe(() => {

          this.taskData = {
            title: '',
            completed: false,
            priority: '',
            dueDate: ''
          };

          this.getTasks();
        });
    }

  }


  editTask(task: any) {
    this.editMode = true;
    this.currentTaskId = task._id;
    this.taskData = {
      title: task.title,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate
    };
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.getTasks();
    });
  }

  markCompleted(id: string) {
    //console.log('Complete clicked', id);

    this.taskService.markCompleted(id).subscribe((res) => {


      console.log('PATCH response', res);

      this.getTasks();

    });

  }

}