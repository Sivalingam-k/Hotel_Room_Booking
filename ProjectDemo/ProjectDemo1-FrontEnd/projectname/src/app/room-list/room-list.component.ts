import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room.model';
import { environment } from '../environments/environments';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoomComponent } from '../add-room/add-room.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  rooms: Room[] = [];
  roomTypes = ['Single Bed', 'Double Bed', 'Family Type'];
  selectedImage: File | null = null;

  constructor(private http: HttpClient,private router:Router,private modalService: NgbModal) {}
  openAddRoomModal() {
    const modalRef = this.modalService.open(AddRoomComponent);
    modalRef.result.then((result) => {
      console.log('Room data:', result);
    }).catch((error) => {
      console.log('Dismissed:', error);
    });
  }
  onImageChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }
  apiUrl = `${environment.apiUrl}/api/Room`;
  ngOnInit(): void {
    this.loadRooms();
  }
  

  loadRooms(): void {
    this.http.get<Room[]>(`${this.apiUrl}/GetRooms`).subscribe(
      (data: Room[]) => this.rooms = data,
      error => console.error('Error loading rooms', error)
    );
  }
 
  
  deleteRoom(id: number): void {
    window.alert("Are you sure ? Want to delete the room ?");
    this.http.delete<void>(`${this.apiUrl}/DeleteRoom/${id}`).subscribe(
      () => this.loadRooms(),
      error => console.error('Error deleting room', error)
    );
  }

  editRoom(room: Room): void {
    room.editMode = true;
  }

  cancelEdit(room: Room): void {
    room.editMode = false;
    this.loadRooms(); // Reload rooms to reset any unsaved changes
  }

  updateRoom(room: any) {
    const formData = new FormData();
    formData.append('roomNumber', room.roomNumber);
    formData.append('roomType', room.roomType);
    formData.append('price', room.price.toString());
    formData.append('isAvailable', room.isAvailable.toString());

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.http.put(`http://localhost:5046/api/Room/UpdateRoom/${room.id}`, formData)
      .subscribe(response => {
        console.log('Room updated successfully', response);
        // Handle successful response
      }, error => {
        console.error('Error updating room', error);
      });
  }
}
