/*

              ,-----.
            W/,-. ,-.\W
            ()>a   a<()
            (.--(_)--.)
          ,'/.-'\_/`-.\`.
        ,' /    `-'    \ `.
       /   \           /   \
      /     `.       ,'     \
     /    /   `-._.-'   \    \
   ,-`-._/|     |=|o    |\_.-<
  <,--.)  |_____| |o____|  )_ \
   `-)|    |//   _   \\|     )/
     ||    |'    |    `|
     ||    |     |     |
     ||    (    )|(    )
     ||    |     |     |
     ||    |     |     |
     ||    |_.--.|.--._|
     ||     /'""| |""`\
     []     `===' `==='  hjw

*/
import AsyncStorage from "@react-native-community/async-storage";

const FREE_SUBSCRIPTION_KEY = "@Grandfathered:free-subscription";

export async function isGrandfatheredIntoFreeSubscription(): Promise<boolean> {
  // we're free for everyone now!
  return true;
}
