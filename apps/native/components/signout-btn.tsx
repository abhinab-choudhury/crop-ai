import { useClerk } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(drawer)/login');
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      activeOpacity={0.6}
      className="flex flex-row items-center justify-center gap-2 bg-red-100 px-5 py-3 rounded-xl mt-4 shadow"
    >
      <Ionicons name="log-out" size={22} color="#B91C1C" />
      <Text className="font-poppinsSemiBold text-red-700 font-semibold text-base">Logout</Text>
    </TouchableOpacity>
  );
};
