using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Online_Book_Store.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }

        [Required, ForeignKey("User")]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    }
}
