namespace Online_Book_Store.Models
{
    public class UserModel
    {
        public int UserID { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
   
        public string UserMessage { get; set; } = "Login Status";
        public string AccessToken { get; set; } = "space for token";
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
