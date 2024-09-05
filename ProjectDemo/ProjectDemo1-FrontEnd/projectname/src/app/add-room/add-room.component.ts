import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.css'
})
export class AddRoomComponent {
  roomForm: FormGroup;
  private apiUrl = `${environment.apiUrl}/api/Room`; // Adjust the URL as necessary

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.roomForm = this.fb.group({
      roomType: ['', Validators.required],
      price: ['', Validators.required],
      isAvailable: [true, Validators.required],
      imagePath: ['']
    });
  }

  onSubmit() {
    if (this.roomForm.valid) {
      this.http.post<any>(`${this.apiUrl}/AddRoom`, this.roomForm.value).subscribe(
        response => {
          console.log('Room added successfully', response);
          this.activeModal.close(this.roomForm.value);
        },
        error => {
          console.error('Error adding room', error);
        }
      );
    }
  }

  close() {
    this.activeModal.dismiss();
  }
}
