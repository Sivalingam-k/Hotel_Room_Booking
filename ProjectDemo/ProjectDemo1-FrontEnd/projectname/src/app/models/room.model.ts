export interface Room {
    id: number;
    roomNumber: number;
    roomType: string;
    price: number;
    ISAvailable: boolean;
    imagePath?: string; 
    editMode?: boolean; 
}
  
  