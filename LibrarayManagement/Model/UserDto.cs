using System.ComponentModel.DataAnnotations;

namespace LibrarayManagement.Model
{
    public class UserDto
    {
        [Required]
        public string UserName { get; set; }
        [Required(AllowEmptyStrings = false)]

        public string Password { get; set; }
        
    }
}
