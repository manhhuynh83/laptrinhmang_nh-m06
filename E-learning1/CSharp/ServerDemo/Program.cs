using System.Threading.Tasks;

namespace AsyncDemoApp {
    class Program {
        static async Task Main() {
            await EchoServerAsync.RunAsync();
        }
    }
}
