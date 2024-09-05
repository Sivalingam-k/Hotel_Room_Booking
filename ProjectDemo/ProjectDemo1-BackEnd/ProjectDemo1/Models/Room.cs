namespace ProjectDemo1.Models
{
    public class Room
    {
        public int Id { get; set; } = 0;
        public int RoomNumber { get; set; }
        public String RoomType { get; set; }
        public int  Price { get; set; }
        public bool ISAvailable { get; set; }
        public string ImagePath { get; set; }
    }
}
