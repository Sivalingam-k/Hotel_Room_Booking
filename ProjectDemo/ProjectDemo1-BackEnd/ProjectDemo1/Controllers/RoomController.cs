using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;
using static System.Net.Mime.MediaTypeNames;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {

        private readonly ProjectDbContext dbContext;

        public RoomController(ProjectDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        [Route("GetRooms")]
        public async Task<IActionResult> GetRooms()
        {
            try
            {
                var rooms = await dbContext.Rooms.ToListAsync();
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving rooms: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("AddRoom")]
        public async Task<IActionResult> AddRoom([FromBody] Room room)
        {
            if (room == null)
            {
                return BadRequest("Room data is null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid room data.");
            }

            try
            {
                dbContext.Rooms.Add(room);
                await dbContext.SaveChangesAsync();
                return CreatedAtAction(nameof(GetRooms), new { id = room.Id }, room);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding room: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("UpdateRoom/{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] Room updatedRoom, IFormFile image)
        {
            if (id != updatedRoom.Id)
            {
                return BadRequest("Room ID mismatch");
            }

            // Example validation logic
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Update logic here
            // Example: Find room by id and update it
            var existingRoom = dbContext.Rooms.Find(id);
            if (existingRoom == null)
            {
                return NotFound();
            }

            existingRoom.RoomType = updatedRoom.RoomType;
            existingRoom.Price = updatedRoom.Price;
            existingRoom.ISAvailable = updatedRoom.ISAvailable; // Ensure this is correctly updated
            if (image != null)
            {
                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }

                var filePath = Path.Combine(uploads, image.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                updatedRoom.ImagePath = $"/uploads/{image.FileName}";
            }
            dbContext.Rooms.Update(existingRoom);
            dbContext.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("DeleteRoom/{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            try
            {
                var room = await dbContext.Rooms.FindAsync(id);
                if (room == null)
                {
                    return NotFound($"Room with ID {id} not found.");
                }

                dbContext.Rooms.Remove(room);
                await dbContext.SaveChangesAsync();
                return NoContent(); // HTTP 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting room: {ex.Message}");
            }
        }
    }
}

