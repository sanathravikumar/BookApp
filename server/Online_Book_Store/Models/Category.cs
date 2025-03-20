using System.ComponentModel.DataAnnotations;

namespace Online_Book_Store.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required, MaxLength(50)]
        public string CategoryName { get; set; }
    }
}
