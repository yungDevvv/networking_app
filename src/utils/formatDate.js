export const formatDate = (date) => {
   date = new Date(date);
   
   const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

   return formattedDate;
}