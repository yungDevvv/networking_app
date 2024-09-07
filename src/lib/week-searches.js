import axios from "axios"

export const createWeekSearches = async (data) => {
   try {
      const res = await axios.post("https://nodetest.crossmedia.fi/api/week-searches", {...data});
      return res.data;
   } catch (error) {
      console.error("Error creating search post", error)
   }
}

export const getWeekSearches = async () => {
   try {
      const res = await axios.get("https://nodetest.crossmedia.fi/api/week-searches");
      return res.data;
   } catch (error) {
      console.error("Error getting search post", error)
   }
}

export const getUserWeekSearches = async (profileId) => {
   try {
      const res = await axios.get("https://nodetest.crossmedia.fi/api/week-searches/" + profileId);
      return res.data;
   } catch (error) {
      console.error("Error getting user search post", error)
   }
}

export const deleteUserWeekSearch = async (id, profileId) => {
   try {
      const res = await axios.delete(`https://nodetest.crossmedia.fi/api/week-searches/${id}?reqProfileId=${profileId}`);
      return res.data;
   } catch (error) {
      console.error("Error deleting search post", error)
   }
}

export const updateUserWeekSearch = async (id, text) => {
   try {
      const res = await axios.put(`https://nodetest.crossmedia.fi/api/week-searches/${id}`, {
         search_text: text
      });
      return res.data;
   } catch (error) {
      console.error("Error updating search post", error)
   }
}

export const createWeekSearchComment = async (profileId, weekSearchId, text) => {
   try {
      const res = await axios.post(`https://nodetest.crossmedia.fi/api/week-searches/${weekSearchId}/comments`, {
         profileId: profileId,
         comment_text: text
      });
      return res.data;
   } catch (error) {
      console.error("Error creating search comment", error)
   }
}

export const getWeekSearchComments = async (weekSearchId) => {
   try {
      const res = await axios.get(`https://nodetest.crossmedia.fi/api/week-searches/${weekSearchId}/comments`);
      return res.data;
   } catch (error) {
      console.error("Error getting search comment", error)
   }
}