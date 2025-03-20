using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;

namespace Online_Book_Store.Models
{
    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { UserID = 101, FirstName = "Sanath", LastName = "R", Email = "Sanath@email.com", Password = "SR123", CellNumber = "9876543215" },
                new User { UserID = 102, FirstName = "Sai", LastName = "Thrinath", Email = "Sai@email.com", Password = "Sai456", CellNumber = "9876543211" }
            );

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Biography" },
                new Category { CategoryId = 2, CategoryName = "Fiction" },
                new Category { CategoryId = 3, CategoryName = "Mystery" },
                new Category { CategoryId = 4, CategoryName = "Fantasy" },
                new Category { CategoryId = 5, CategoryName = "Romance" }
            );

            // Seed Books
            modelBuilder.Entity<Book>().HasData(
                new Book { BookId = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Price = 149.00m, Stock = 50, CoverImageName = "TheGreatGatsby.jpg", CategoryId = 2 },
                new Book { BookId = 2, Title = "Becoming", Author = "Michelle Obama", Price = 875.00m, Stock = 30, CoverImageName = "Becoming.jpg", CategoryId = 1 },
                new Book { BookId = 3, Title = "The Hobbit", Author = "J.R.R. Tolkien", Price = 1484.00m, Stock = 40, CoverImageName = "TheHobbit.jpg", CategoryId = 4 }
            );

            // Seed Orders
            modelBuilder.Entity<Order>().HasData(
                new Order { OrderId = 5001, UserID = 102, TotalAmount = 28.98m, OrderDate = new DateTime(2023, 10, 1) }
            );

            // Seed OrderDetails
            modelBuilder.Entity<OrderDetail>().HasData(
                new OrderDetail { OrderDetailsId = 7001, OrderId = 5001, BookId = 1, Quantity = 1, Price = 12.99m },
                new OrderDetail { OrderDetailsId = 7002, OrderId = 5001, BookId = 3, Quantity = 1, Price = 10.99m }
            );
        }
    }
}
