using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibrarayManagement.Model
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string Category { get; set; }
        [ForeignKey("Issue")]
        public int IssueId { get; set; }
        public Issue? Issue { get; set; }


        

    }
}
