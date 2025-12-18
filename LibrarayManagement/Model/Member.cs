using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibrarayManagement.Model
{
    public class Member
    {
        [Key]
        public int MemberId { get; set; }

        [Required]
        public string MemberName { get; set; }

        public string Mobile { get; set; }
        public string Address { get; set; }

        [DataType(DataType.ImageUrl)]
        public string? PhotoPath { get; set; }

        

        public List<Issue>? Issue { get; set; }
    }
}
