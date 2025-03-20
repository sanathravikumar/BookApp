using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Online_Book_Store.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemId { get; set; }

        [Required, ForeignKey("Cart")]
        public int CartId { get; set; }
        public Cart Cart { get; set; }

        [Required, ForeignKey("Book")]
        public int BookId { get; set; }
        public Book Book { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
