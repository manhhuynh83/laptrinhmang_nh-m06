using System.Threading.Tasks;

namespace ChatServerDemo {
    class Program {
        static async Task Main() {
            await ChatServerAsync.RunAsync();
        }
    }
}
