using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_Book_Store.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Online_Book_Store.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class JWTProtalController : ControllerBase
    {
        // GET: api/<JWTProtalController>
        private IConfiguration _configuration;
        private readonly AppDBContext _context;
        public JWTProtalController(IConfiguration configuration, AppDBContext context) 
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpPost]
        [AllowAnonymous]
        [Route("PostLoginDetails")]
        public async Task<IActionResult> PostLoginDetails(UserModel userModel)
        {
            if (userModel!=null)
            {
                var resultLoginCheck = await _context.Users.Where(x => x.Email == userModel.Email && x.Password == userModel.Password).FirstOrDefaultAsync();
                if (resultLoginCheck == null)
                {
                    return BadRequest("Invalid Credentials");
                }
                else
                {
                    userModel.UserID = resultLoginCheck.UserID;
                    userModel.UserMessage = "Login Sucess";
                    var claims = new[]
                    {
                            new Claim(JwtRegisteredClaimNames.Sub,_configuration["Jwt:Subject"]),
                            new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                            new Claim(JwtRegisteredClaimNames.Iat,DateTime.UtcNow.ToString()),
                            new Claim("UserID",resultLoginCheck.UserID.ToString()),
                            new Claim("FirstName",resultLoginCheck.FirstName.ToString()),
                            new Claim("LastName",resultLoginCheck.LastName.ToString()),
                            new Claim("Email",resultLoginCheck.Email.ToString())
                    };
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var SignIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims, expires: DateTime.UtcNow.AddMinutes(10), signingCredentials: SignIn);

                    userModel.AccessToken = new JwtSecurityTokenHandler().WriteToken(token);
                    return Ok(userModel);
                }
            }
            else
            {
                return BadRequest("No Bad Request");
            }
        }
    }
}
