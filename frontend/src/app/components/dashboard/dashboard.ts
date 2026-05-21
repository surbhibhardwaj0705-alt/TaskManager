import { Component } from '@angular/core';
import { Task } from '../../services/task';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
tasks: any[] = [];

 taskData = {
    title: '',
    completed: false
  };

   editMode = false;
  currentTaskId = '';


  constructor(private taskService: Task) {}

  getTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addTask() {
    if (this.editMode) {

      this.taskService.updateTask(
        this.currentTaskId,
        this.taskData
      ).subscribe(() => {

        this.editMode = false;

        this.taskData = {
          title: 'this.taskData.title',
          completed: false
        };

        this.getTasks();
      });

    } else {

      this.taskService.addTask(this.taskData)
      .subscribe(() => {

        this.taskData = {
          title: 'this.taskData.title',
          completed: false
        };

        this.getTasks();
      });
    }
      
  }


  editTask(task: any) {
    this.editMode = true;
    this.currentTaskId = task._id;
    this.taskData ={
      title: task.title,
      completed: task.completed
    };
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.getTasks();
    });
  }

    markCompleted(id: string) {

  this.taskService.markCompleted(id).subscribe(() => {

    this.getTasks();

  });

}

}