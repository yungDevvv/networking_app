import axios from "axios"

export const getUsersProfiles = async () => {
   try {
      const res = await axios.get('https://nodetest.crossmedia.fi/api/get-users');
      return res.data;
   } catch (error) {
      console.log("ERROR fetching users:", error)
   }
}
export const getUserProfile = async (id) => {
   try {
      const res = await axios.get('https://nodetest.crossmedia.fi/api/users/' + id);
      return res.data;
   } catch (error) {
      console.log("ERROR fetching user:", error)
   }
}
