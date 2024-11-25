export const formatDate = (date) => {
   date = new Date(date);
   
   const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

   return formattedDate;
}

export function formatDateTime(dateString, lang) {
   const date = new Date(dateString);
 
   if (isNaN(date.getTime())) {
     return;
   }
 
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);  

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); 

  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

 
  const time = `${hours}:${minutes}`;

  
  if (date >= today) {
      return lang === "fi" ? `Tänään ${time}` : `Today ${time}`
  }


  if (date >= yesterday && date < today) {
    return lang === "fi" ? `Eilen ${time}` : `Yesterday ${time}`
  }

  return `${day}/${month}/${year} ${time}`;
 }