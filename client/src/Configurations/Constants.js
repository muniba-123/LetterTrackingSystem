export var Constants = {
    appVersion: "1",
    domainUrl: 'http://localhost:3001/',
    appName:"Mail Tracking System",
    adminName:"admin"
}
  export const getFormattedDate = (date, format) => {
    date = new Date(date);
    const month =
      date?.getMonth() + 1 < 10
        ? `0${date?.getMonth() + 1}`
        : date?.getMonth() + 1;
    const day = date?.getDate() < 10 ? `0${date?.getDate()}` : date?.getDate();
    const year = date?.getFullYear();
    if (format === "mm/dd/yyyy") return `${month}/${day}/${year}`;
   else if (format === "dd-mm-yyyy") return `${day}-${month}-${year}`;

    else return `${year}-${month}-${day}`;
  };
  export const letterStatus={
    0:"Pending",
    1:"Received"
  }